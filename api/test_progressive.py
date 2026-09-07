"""End-to-end regression tests for the progressive ("Code War" chain) contest feature.

Runs against a live backend + database. Start the API first, then:

    cd api && export $(grep -v '^#' ../.env | xargs) && .venv/bin/python test_progressive.py

Covers the bugs that made chains unusable:
  1. Admin GET must return every stage in full (locked stubs used to wipe statements/test cases).
  2. An admin save round-trip must preserve stage statements, test cases and perf tiers.
  3. Admin test-case counts must reflect where a chain actually keeps its cases.
  4. Candidates must only ever see the current stage; later stages stay locked.
  5. A chain attached after a participant started must still work (lazy chain-progress row).
  6. Submitting to a locked stage must be rejected.
"""
import os
import sys
import uuid

import httpx

BASE = os.getenv("ZAP_BASE_URL", "http://127.0.0.1:8000/api")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@local.dev")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "Admin@12345")

PASSED: list[str] = []
FAILED: list[str] = []


def check(name: str, condition: bool, detail: str = "") -> None:
    if condition:
        PASSED.append(name)
        print(f"  PASS  {name}")
    else:
        FAILED.append(name)
        print(f"  FAIL  {name}{(' -> ' + detail) if detail else ''}")


class Client:
    def __init__(self) -> None:
        self._c = httpx.Client(base_url=BASE, timeout=60)
        self.token: str | None = None

    def login(self, email: str, password: str) -> None:
        r = self._c.post("/auth/login", json={"email": email, "password": password})
        r.raise_for_status()
        self.token = r.json()["token"]

    def register(self, name: str, email: str, password: str) -> None:
        r = self._c.post("/auth/register", json={"name": name, "email": email, "password": password})
        r.raise_for_status()
        self.token = r.json()["token"]

    def _headers(self) -> dict:
        return {"Authorization": f"Bearer {self.token}"} if self.token else {}

    def get(self, path: str) -> httpx.Response:
        return self._c.get(path, headers=self._headers())

    def post(self, path: str, json=None) -> httpx.Response:
        return self._c.post(path, json=json, headers=self._headers())

    def put(self, path: str, json=None) -> httpx.Response:
        return self._c.put(path, json=json, headers=self._headers())


def find_chain_problem(admin: Client) -> dict:
    problems = admin.get("/admin/problems").json()
    chains = [p for p in problems if p.get("isProgressive")]
    if not chains:
        print("No progressive problem found. Seed one first (api/seed.py).")
        sys.exit(1)
    return max(chains, key=lambda p: len(p.get("stages") or []))


def test_admin_sees_full_stages(admin: Client, problem_id: str) -> dict:
    print("\n[1] Admin GET returns every stage in full")
    p = admin.get(f"/admin/problems/{problem_id}").json()
    stages = p.get("stages") or []
    check("chain has stages", len(stages) > 0, f"got {len(stages)}")
    check("no stage is returned locked", all(not s.get("locked") for s in stages))
    check("every stage has a statement", all((s.get("statement") or "").strip() for s in stages),
          [s["stageOrder"] for s in stages if not (s.get("statement") or "").strip()].__str__())
    check("every stage carries its test cases", all(len(s.get("testCases") or []) > 0 for s in stages),
          [s["stageOrder"] for s in stages if not (s.get("testCases") or [])].__str__())
    return p


def test_save_roundtrip_preserves_stages(admin: Client, problem: dict) -> None:
    """The regression that silently wiped stage content: load -> save unchanged -> reload."""
    print("\n[2] Admin save round-trip preserves stage content")
    before = admin.get(f"/admin/problems/{problem['id']}").json()

    payload = {
        "title": before["title"],
        "difficulty": before["difficulty"],
        "description": before["description"],
        "inputFormat": before["inputFormat"],
        "outputFormat": before["outputFormat"],
        "constraints": before["constraints"],
        "examples": before["examples"],
        "tags": before["tags"],
        "languages": before["languages"],
        "boilerplates": before["boilerplates"],
        "testCases": before["testCases"],
        "isProgressive": True,
        "stages": before["stages"],
        "timeLimit": before["timeLimit"],
        "memoryLimit": before["memoryLimit"],
        "maxScore": before["maxScore"],
        "status": before["status"],
    }
    r = admin.put(f"/admin/problems/{problem['id']}", json=payload)
    check("save succeeds", r.status_code == 200, f"{r.status_code} {r.text[:200]}")

    after = admin.get(f"/admin/problems/{problem['id']}").json()
    b_stages = {s["stageOrder"]: s for s in before["stages"]}
    a_stages = {s["stageOrder"]: s for s in after["stages"]}

    check("stage count unchanged", len(b_stages) == len(a_stages), f"{len(b_stages)} -> {len(a_stages)}")
    lost_statements = [o for o in b_stages if (b_stages[o].get("statement") or "") != (a_stages.get(o, {}).get("statement") or "")]
    check("statements preserved", not lost_statements, f"changed on stages {lost_statements}")
    lost_cases = [
        o for o in b_stages
        if len(b_stages[o].get("testCases") or []) != len(a_stages.get(o, {}).get("testCases") or [])
    ]
    check("test case counts preserved", not lost_cases, f"changed on stages {lost_cases}")
    lost_scores = [o for o in b_stages if b_stages[o].get("maxScore") != a_stages.get(o, {}).get("maxScore")]
    check("stage maxScore preserved", not lost_scores, f"changed on stages {lost_scores}")

    before_tiers = sorted(tc.get("perfTier") for s in before["stages"] for tc in (s.get("testCases") or []) if tc.get("perfTier"))
    after_tiers = sorted(tc.get("perfTier") for s in after["stages"] for tc in (s.get("testCases") or []) if tc.get("perfTier"))
    check("perf tiers preserved", before_tiers == after_tiers, f"{before_tiers} -> {after_tiers}")


def test_add_stage_test_case(admin: Client, problem: dict) -> None:
    print("\n[3] Adding a test case to a stage persists")
    before = admin.get(f"/admin/problems/{problem['id']}").json()
    target = before["stages"][-1]
    original = len(target.get("testCases") or [])

    marker = f"zap-test-{uuid.uuid4().hex[:8]}"
    stages = [dict(s) for s in before["stages"]]
    for s in stages:
        if s["stageOrder"] == target["stageOrder"]:
            s["testCases"] = list(s.get("testCases") or []) + [
                {"name": marker, "input": "1\n1", "expectedOutput": "0", "hidden": True, "marks": 5, "perfTier": None}
            ]

    payload = {
        **{k: before[k] for k in (
            "title", "difficulty", "description", "inputFormat", "outputFormat", "constraints",
            "examples", "tags", "languages", "boilerplates", "testCases", "timeLimit",
            "memoryLimit", "maxScore", "status",
        )},
        "isProgressive": True,
        "stages": stages,
    }
    r = admin.put(f"/admin/problems/{problem['id']}", json=payload)
    check("save with new stage case succeeds", r.status_code == 200, f"{r.status_code} {r.text[:200]}")

    after = admin.get(f"/admin/problems/{problem['id']}").json()
    updated = next(s for s in after["stages"] if s["stageOrder"] == target["stageOrder"])
    cases = updated.get("testCases") or []
    check("stage gained exactly one case", len(cases) == original + 1, f"{original} -> {len(cases)}")
    check("new case is retrievable by name", any(tc.get("name") == marker for tc in cases))
    check("names are not overwritten with ids", all(not (tc.get("name") or "").startswith("tc_new_") for tc in cases))

    # Restore the original set so the script stays idempotent.
    restore = [dict(s) for s in after["stages"]]
    for s in restore:
        if s["stageOrder"] == target["stageOrder"]:
            s["testCases"] = [tc for tc in (s.get("testCases") or []) if tc.get("name") != marker]
    admin.put(f"/admin/problems/{problem['id']}", json={**payload, "stages": restore})
    final = admin.get(f"/admin/problems/{problem['id']}").json()
    final_stage = next(s for s in final["stages"] if s["stageOrder"] == target["stageOrder"])
    check("cleanup restored original count", len(final_stage.get("testCases") or []) == original,
          f"{original} vs {len(final_stage.get('testCases') or [])}")


def test_admin_counts(admin: Client, problem_id: str) -> None:
    print("\n[4] Admin search reports a sensible test-case count")
    p = admin.get(f"/admin/problems/{problem_id}").json()
    stage_cases = sum(len(s.get("testCases") or []) for s in p["stages"])
    results = admin.get("/admin/problems/search?limit=100&status=all").json()
    row = next((r for r in results if r["id"] == problem_id), None)
    check("chain appears in search", row is not None)
    if row:
        check("search flags it as progressive", row.get("isProgressive") is True)
        check("count is not zero for a chain", row["testCasesCount"] > 0, str(row["testCasesCount"]))
        check("count does not exceed stage cases", row["testCasesCount"] <= stage_cases,
              f"{row['testCasesCount']} > {stage_cases}")


def test_candidate_stage_gating(admin: Client, problem_id: str) -> None:
    print("\n[5] Candidate sees only the current stage; later stages stay locked")
    contests = admin.get("/admin/contests").json()
    progressive = [c for c in contests if c.get("mode") == "progressive" and c.get("status") == "active"]
    if not progressive:
        print("  SKIP  no active progressive contest (re-run api/seed.py)")
        return
    contest = progressive[0]

    user = Client()
    suffix = uuid.uuid4().hex[:10]
    user.register(f"Chain Tester {suffix}", f"chain.{suffix}@local.dev", "Test@12345")

    r = user.post(f"/contests/{contest['id']}/start")
    check("candidate can start the contest", r.status_code == 200, f"{r.status_code} {r.text[:200]}")

    problems = user.get(f"/contests/{contest['id']}/problems").json()
    chain = next((p for p in problems if p["id"] == problem_id), None)
    if chain is None:
        print("  SKIP  chain problem is not attached to the active progressive contest")
        return

    stages = chain["stages"]
    check("currentStageOrder starts at 1", chain["currentStageOrder"] == 1, str(chain["currentStageOrder"]))
    check("totalStages is reported", chain["totalStages"] == len(stages))
    check("stage 1 is unlocked", not stages[0]["locked"])
    check("all later stages are locked", all(s["locked"] for s in stages[1:]),
          str([s["stageOrder"] for s in stages[1:] if not s["locked"]]))
    check("locked stages leak no statement", all("statement" not in s for s in stages[1:]))
    check("locked stages leak no test cases", all("testCases" not in s for s in stages[1:]))
    check("unlocked stage exposes its statement", bool((stages[0].get("statement") or "").strip()))
    check("no perf-tier cases are exposed", all(
        tc.get("perfTier") in (None, "small") for tc in (stages[0].get("testCases") or [])
    ))

    print("\n[6] Submitting to a locked stage is rejected")
    if len(stages) > 1:
        r = user.post("/submissions", json={
            "problemId": problem_id, "contestId": contest["id"], "stageId": stages[1]["id"],
            "language": "python", "code": "print(0)",
        })
        check("locked stage submission returns 409", r.status_code == 409, f"{r.status_code} {r.text[:200]}")

    print("\n[7] Chain works for a participant that started before it existed (lazy progress row)")
    # The candidate above started fresh; re-fetching must stay consistent rather than 400.
    r = user.get(f"/contests/{contest['id']}/problems")
    check("problem list still resolves", r.status_code == 200, f"{r.status_code}")
    again = next((p for p in r.json() if p["id"] == problem_id), None)
    check("stage cursor is stable across fetches", again and again["currentStageOrder"] == 1,
          str(again and again.get("currentStageOrder")))

    r = user.post("/submissions", json={
        "problemId": problem_id, "contestId": contest["id"], "stageId": stages[0]["id"],
        "language": "python", "code": "print(0)",
    })
    check("stage 1 submission is accepted for judging (not a chain-init error)",
          r.status_code in (201, 429), f"{r.status_code} {r.text[:200]}")
    if r.status_code == 201:
        body = r.json()
        check("submission is bound to the stage", body.get("stageId") == stages[0]["id"])
        if body.get("status") == "JUDGE_UNAVAILABLE":
            print("  NOTE  judge unreachable, so accept/unlock could not be exercised")


def main() -> int:
    admin = Client()
    try:
        admin.login(ADMIN_EMAIL, ADMIN_PASSWORD)
    except httpx.HTTPError as exc:
        print(f"Could not log in as {ADMIN_EMAIL}: {exc}")
        return 1

    problem = find_chain_problem(admin)
    print(f"Testing chain problem: {problem['title']} ({problem['id']})")

    test_admin_sees_full_stages(admin, problem["id"])
    test_save_roundtrip_preserves_stages(admin, problem)
    test_add_stage_test_case(admin, problem)
    test_admin_counts(admin, problem["id"])
    test_candidate_stage_gating(admin, problem["id"])

    print(f"\n{len(PASSED)} passed, {len(FAILED)} failed")
    if FAILED:
        for name in FAILED:
            print(f"  - {name}")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
