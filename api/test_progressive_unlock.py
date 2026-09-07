"""End-to-end test of progressive chain unlocking: clear every stage and assert progression.

Judges through whatever `PISTON_ENDPOINTS` points at. If no judge is reachable it falls back to
running the submitted Python locally so the unlock logic is still exercised.

Run `api/local_piston.py` first for a real judge, then:

    cd api && export $(grep -v '^#' ../.env | xargs) && .venv/bin/python test_progressive_unlock.py
"""
import os
import subprocess
import sys
import uuid

import httpx
from fastapi.testclient import TestClient

import piston_service
import scoring
from index import app

PASSED: list[str] = []
FAILED: list[str] = []

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@local.dev")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "Admin@12345")

# Reference solutions keyed by stage order for the "contains duplicate" chain.
SOLUTIONS = {
    1: "print(1 if len(nums) != len(set(nums)) else 0)",
    2: """seen = set()
ans = -1
for i, v in enumerate(nums):
    if v in seen:
        ans = i
        break
    seen.add(v)
print(ans)""",
    3: """from collections import Counter
print(sum(1 for f in Counter(nums).values() if f >= 2))""",
    4: """from collections import Counter
c = Counter(nums)
best = max(c.values())
print(min(v for v, f in c.items() if f == best))""",
    5: """from collections import Counter
c = Counter(nums)
print(" ".join(str(v) for v in sorted(x for x, f in c.items() if f >= 2)))""",
    6: """ans = 0
for i in range(len(nums)):
    for j in range(i + 1, min(i + 4, len(nums))):
        if nums[i] == nums[j]:
            ans = 1
            break
    if ans:
        break
print(ans)""",
    7: """last = {}
start = 0
best = 0
for i, v in enumerate(nums):
    if v in last and last[v] >= start:
        start = last[v] + 1
    last[v] = i
    best = max(best, i - start + 1)
print(best)""",
}

PREAMBLE = """import sys
data = sys.stdin.read().split()
n = int(data[0])
nums = [int(x) for x in data[1:1 + n]]
"""


def check(name: str, condition: bool, detail: str = "") -> None:
    if condition:
        PASSED.append(name)
        print(f"  PASS  {name}")
    else:
        FAILED.append(name)
        print(f"  FAIL  {name}{(' -> ' + detail) if detail else ''}")


async def fake_execute(language: str, code: str, stdin: str, time_limit: int = 5) -> dict:
    """Fallback judge: run the submitted Python locally, shaped like piston_service.execute."""
    try:
        proc = subprocess.run(
            [sys.executable, "-c", code], input=stdin, capture_output=True, text=True, timeout=15,
        )
        run = {"stdout": proc.stdout, "stderr": proc.stderr, "code": proc.returncode, "signal": None}
        status = "COMPLETED" if proc.returncode == 0 else "RUNTIME_ERROR"
    except subprocess.TimeoutExpired:
        run = {"stdout": "", "stderr": "timeout", "code": None, "signal": "SIGKILL"}
        status = "TIME_LIMIT_EXCEEDED"
    return {
        "ok": True, "endpoint": "stub", "elapsedMs": 5,
        "result": {"compile": {"code": 0, "stderr": "", "output": ""}, "run": run},
        "status": status,
    }


def judge_is_reachable() -> bool:
    for endpoint in piston_service.piston_endpoints():
        try:
            r = httpx.post(
                f"{endpoint}/execute", timeout=10,
                json={
                    "language": "python", "version": "*",
                    "files": [{"name": "main.py", "content": "print(1)"}], "stdin": "",
                },
            )
            if r.status_code == 200:
                return True
        except httpx.HTTPError:
            continue
    return False


def auth(client: TestClient, token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def main() -> int:
    if judge_is_reachable():
        print(f"Judging via {', '.join(piston_service.piston_endpoints())}")
    else:
        print("No judge reachable - falling back to the local Python runner")
        scoring.execute = fake_execute  # scoring imported execute into its own namespace

    client = TestClient(app)

    r = client.post("/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    if r.status_code != 200:
        print(f"Admin login failed: {r.status_code} {r.text[:200]}")
        return 1
    admin_token = r.json()["token"]

    contests = client.get("/api/admin/contests", headers=auth(client, admin_token)).json()
    progressive = [c for c in contests if c.get("mode") == "progressive" and c.get("status") == "active"]
    if not progressive:
        print("No active progressive contest found. Run api/seed.py first.")
        return 1
    contest = progressive[0]

    suffix = uuid.uuid4().hex[:10]
    r = client.post("/api/auth/register", json={
        "name": f"Unlock Tester {suffix}", "email": f"unlock.{suffix}@local.dev", "password": "Test@12345",
    })
    if r.status_code != 200:
        print(f"Register failed: {r.status_code} {r.text[:200]}")
        return 1
    token = r.json()["token"]

    r = client.post(f"/api/contests/{contest['id']}/start", headers=auth(client, token))
    check("contest starts", r.status_code == 200, f"{r.status_code} {r.text[:200]}")

    problems = client.get(f"/api/contests/{contest['id']}/problems", headers=auth(client, token)).json()
    chain = next((p for p in problems if p.get("isProgressive")), None)
    if chain is None:
        print("No chain problem attached to the progressive contest.")
        return 1
    total = chain["totalStages"]
    print(f"Chain: {chain['title']} ({total} stages)\n")

    print("[1] Clearing each stage unlocks exactly the next one")
    for expected_order in range(1, total + 1):
        problems = client.get(f"/api/contests/{contest['id']}/problems", headers=auth(client, token)).json()
        chain = next(p for p in problems if p.get("isProgressive"))
        check(f"stage {expected_order} is the current stage",
              chain["currentStageOrder"] == expected_order, str(chain["currentStageOrder"]))

        stage = next((s for s in chain["stages"] if s["stageOrder"] == expected_order), None)
        if stage is None or stage.get("locked"):
            check(f"stage {expected_order} is unlocked", False, "stage missing or locked")
            break
        check(f"stage {expected_order} exposes its statement", bool((stage.get("statement") or "").strip()))

        solution = SOLUTIONS.get(expected_order)
        if solution is None:
            print(f"  SKIP  no reference solution for stage {expected_order}")
            break

        r = client.post("/api/submissions", headers=auth(client, token), json={
            "problemId": chain["id"], "contestId": contest["id"], "stageId": stage["id"],
            "language": "python", "code": PREAMBLE + solution,
        })
        check(f"stage {expected_order} submission created", r.status_code == 201, f"{r.status_code} {r.text[:300]}")
        if r.status_code != 201:
            break
        body = r.json()
        check(f"stage {expected_order} verdict is ACCEPTED", body["status"] == "ACCEPTED",
              f"{body['status']} ({body['passedTests']}/{body['totalTests']})")
        if body["status"] != "ACCEPTED":
            break

    print("\n[2] Chain reports completion once the final stage clears")
    problems = client.get(f"/api/contests/{contest['id']}/problems", headers=auth(client, token)).json()
    chain = next(p for p in problems if p.get("isProgressive"))
    check("cursor advanced past the last stage", chain["currentStageOrder"] == total + 1,
          str(chain["currentStageOrder"]))
    check("chainCompleted flag is set", chain.get("chainCompleted") is True, str(chain.get("chainCompleted")))
    check("every stage is now unlocked", all(not s.get("locked") for s in chain["stages"]))

    print("\n[3] Completed chain counts as one solved problem")
    session = client.get(f"/api/contests/{contest['id']}/session", headers=auth(client, token)).json()
    check("problemsSolved incremented exactly once", session["problemsSolved"] == 1,
          str(session["problemsSolved"]))
    check("score is greater than zero", session["score"] > 0, str(session["score"]))

    print("\n[4] Re-submitting a cleared stage is rejected")
    first_stage = next(s for s in chain["stages"] if s["stageOrder"] == 1)
    r = client.post("/api/submissions", headers=auth(client, token), json={
        "problemId": chain["id"], "contestId": contest["id"], "stageId": first_stage["id"],
        "language": "python", "code": PREAMBLE + SOLUTIONS[1],
    })
    check("cleared stage returns 409", r.status_code == 409, f"{r.status_code} {r.text[:200]}")

    print("\n[5] Submitting a chain problem without a stageId is rejected")
    r = client.post("/api/submissions", headers=auth(client, token), json={
        "problemId": chain["id"], "contestId": contest["id"], "language": "python", "code": "print(0)",
    })
    check("missing stageId returns 400", r.status_code == 400, f"{r.status_code} {r.text[:200]}")

    print(f"\n{len(PASSED)} passed, {len(FAILED)} failed")
    if FAILED:
        for name in FAILED:
            print(f"  - {name}")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
