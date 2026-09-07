"""Tests for the 'Run' action: every sample case must report actual vs expected output.

Requires a reachable judge (see api/local_piston.py).

    cd api && export $(grep -v '^#' ../.env | xargs) && .venv/bin/python test_run_samples.py
"""
import os
import uuid

from fastapi.testclient import TestClient

from index import app

PASSED: list[str] = []
FAILED: list[str] = []

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@local.dev")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "Admin@12345")

CORRECT = """import sys
data = sys.stdin.read().split()
n = int(data[0])
nums = [int(x) for x in data[1:1 + n]]
print(1 if len(nums) != len(set(nums)) else 0)
"""

WRONG = """import sys
sys.stdin.read()
print(999)
"""

CRASHES = """raise SystemExit("boom")
"""


def check(name: str, condition: bool, detail: str = "") -> None:
    if condition:
        PASSED.append(name)
        print(f"  PASS  {name}")
    else:
        FAILED.append(name)
        print(f"  FAIL  {name}{(' -> ' + detail) if detail else ''}")


def main() -> int:
    client = TestClient(app)

    r = client.post("/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    if r.status_code != 200:
        print(f"Admin login failed: {r.status_code}")
        return 1
    admin = {"Authorization": f"Bearer {r.json()['token']}"}

    contests = client.get("/api/admin/contests", headers=admin).json()
    active = [c for c in contests if c.get("status") == "active"]
    if not active:
        print("No active contest. Run api/seed.py first.")
        return 1
    contest = next((c for c in active if c.get("mode") == "progressive"), active[0])

    suffix = uuid.uuid4().hex[:10]
    r = client.post("/api/auth/register", json={
        "name": f"Run Tester {suffix}", "email": f"run.{suffix}@local.dev", "password": "Test@12345",
    })
    token = {"Authorization": f"Bearer {r.json()['token']}"}
    client.post(f"/api/contests/{contest['id']}/start", headers=token)

    problems = client.get(f"/api/contests/{contest['id']}/problems", headers=token).json()
    problem = problems[0]
    stage = None
    if problem.get("isProgressive"):
        stage = next(s for s in problem["stages"] if s["stageOrder"] == problem["currentStageOrder"])
    samples = (stage or problem).get("testCases") or []
    samples = [tc for tc in samples if not tc.get("hidden")]
    print(f"Problem: {problem['title']} ({len(samples)} visible sample cases)\n")

    def run(code: str, stdin: str = ""):
        return client.post("/api/code/run", headers=token, json={
            "problemId": problem["id"], "contestId": contest["id"],
            "stageId": stage["id"] if stage else None,
            "language": "python", "code": code, "stdin": stdin,
        })

    print("[1] Run with no custom stdin returns every sample case")
    r = run(CORRECT)
    check("run succeeds", r.status_code == 200, f"{r.status_code} {r.text[:200]}")
    body = r.json()
    results = body.get("testResults") or []
    check("one result per visible sample", len(results) == len(samples), f"{len(results)} vs {len(samples)}")
    check("every case reports its input", all("input" in t for t in results))
    check("every case reports expectedOutput", all("expectedOutput" in t for t in results))
    check("every case reports actualOutput", all("actualOutput" in t for t in results))
    check("every case reports a pass flag", all(isinstance(t.get("passed"), bool) for t in results))
    check("expected matches the sample definition",
          [t["expectedOutput"].strip() for t in results] == [s["expectedOutput"].strip() for s in samples])

    print("\n[2] A correct solution passes every sample")
    check("all samples pass", all(t["passed"] for t in results),
          str([t["name"] for t in results if not t["passed"]]))
    check("overall status is COMPLETED", body["status"] == "COMPLETED", body["status"])
    check("passedCount matches totalCount", body.get("passedCount") == body.get("totalCount"),
          f"{body.get('passedCount')}/{body.get('totalCount')}")

    print("\n[3] A wrong solution shows the mismatch instead of just failing")
    r = run(WRONG)
    body = r.json()
    results = body.get("testResults") or []
    check("wrong run still returns cases", len(results) == len(samples), str(len(results)))
    check("cases are marked failed", all(not t["passed"] for t in results))
    check("actual output is captured", all(t["actualOutput"].strip() == "999" for t in results),
          str([t["actualOutput"] for t in results]))
    check("expected differs from actual", all(
        t["expectedOutput"].strip() != t["actualOutput"].strip() for t in results
    ))
    check("overall status is WRONG_ANSWER", body["status"] == "WRONG_ANSWER", body["status"])

    print("\n[4] A crashing solution surfaces the error")
    r = run(CRASHES)
    body = r.json()
    results = body.get("testResults") or []
    check("crash returns at least one case", len(results) >= 1)
    if results:
        check("case is not passed", not results[0]["passed"])
        check("an error message is surfaced", bool(results[0].get("errorMessage")),
              str(results[0].get("errorMessage")))

    print("\n[5] Custom stdin still does a single plain run")
    r = run(CORRECT, stdin="3\n1 2 3")
    body = r.json()
    check("custom stdin run succeeds", r.status_code == 200)
    check("no per-case comparison for custom stdin", not (body.get("testResults") or []))
    check("stdout is returned", body.get("stdout", "").strip() == "0", repr(body.get("stdout")))

    print("\n[6] Hidden and perf-tier cases are never exposed by Run")
    r = run(CORRECT)
    results = r.json().get("testResults") or []
    visible_inputs = {s["input"] for s in samples}
    check("only visible sample inputs appear", all(t["input"] in visible_inputs for t in results))

    print(f"\n{len(PASSED)} passed, {len(FAILED)} failed")
    if FAILED:
        for name in FAILED:
            print(f"  - {name}")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
