"""
Load test for the submission API.

Simulates N concurrent users submitting solutions at the same time.
Measures per-request latency, overall throughput, and error rates.

Prerequisites:
  1. The API server must be running (uvicorn index:app --port 8000)
  2. A contest must exist with at least one problem (status=active)
  3. Disable rate limiting: RATE_LIMIT_ENABLED=false in .env

Usage:
  cd api
  # Quick test (10 users)
  .venv/bin/python load_test.py

  # Full load test (100 users)
  .venv/bin/python load_test.py --users 100

  # Custom target
  .venv/bin/python load_test.py --users 50 --base-url http://localhost:8000
"""

import argparse
import asyncio
import statistics
import sys
import time

# pyrefly: ignore [missing-import]
import httpx


# ── Configuration ────────────────────────────────────────────────────────────

DEFAULT_BASE_URL = "http://localhost:8000"
ADMIN_EMAIL = "admin@zap.dev"
ADMIN_PASSWORD = "Z@padmin#1"

# Simple solutions that compile and produce output
TEST_SOLUTIONS = {
"python": 'n=int(input()); nums=list(map(int,input().split())); target=int(input()); l,r=0,n-1; exec("while l<=r:\\n m=(l+r)//2\\n if nums[m]==target: print(m); break\\n elif nums[m]<target: l=m+1\\n else: r=m-1\\nelse: print(-1)")',
   "cpp": '#include <iostream>\nusing namespace std;\nint main() { string s; getline(cin, s); cout << s; return 0; }',
    "c": '#include <stdio.h>\nint main() { char s[1000]; fgets(s, sizeof(s), stdin); printf("%s", s); return 0; }',
    "java": 'import java.util.Scanner;\npublic class Main { public static void main(String[] args) { Scanner sc = new Scanner(System.in); System.out.println(sc.nextLine()); } }',
}

HTTP_TIMEOUT = 120.0


# ── Helpers ──────────────────────────────────────────────────────────────────

async def login(client: httpx.AsyncClient, base_url: str, email: str, password: str) -> str:
    """Login and return JWT token."""
    resp = await client.post(f"{base_url}/api/auth/login", json={"email": email, "password": password})
    resp.raise_for_status()
    return resp.json()["token"]


async def discover_contest(client: httpx.AsyncClient, base_url: str, token: str) -> tuple:
    """Find an active contest and its problem IDs via admin APIs.
    Returns (contest_id, problem_id, language) or raises SystemExit.
    """
    headers = {"Authorization": f"Bearer {token}"}

    # Get all contests
    resp = await client.get(f"{base_url}/api/contests", headers=headers, timeout=120.0)
    resp.raise_for_status()
    contests = resp.json()

    active_contests = [c for c in contests if c.get("status") == "active"]
    print(active_contests)
    if not active_contests:
        print("❌ No active contests found. Create and publish a contest first.")
        sys.exit(1)

    contest = active_contests[0]
    contest_id = contest["id"]
    print(f"   Contest: {contest.get('title', contest_id)} (status=active)")

    # Check current session
    sess_resp = await client.get(f"{base_url}/api/contests/{contest_id}/session", headers=headers, timeout=120.0)
    session = sess_resp.json()
    session_status = session.get("status", "none")

    if session.get("started") and session_status in ("completed", "auto_completed"):
        print(f"   ⚠️  Session is '{session_status}' — resetting via DB for load test...")
        # Reset participant directly via DB
        reset_resp = await client.post(
            f"{base_url}/api/contests/{contest_id}/start", headers=headers, timeout=30.0
        )
        # If 409 (already completed), we need to reset via DB — add a load-test reset endpoint
        if reset_resp.status_code == 409:
            print("   ⚠️  Cannot restart completed contest via API.")
            print("   💡 Run this SQL to reset the admin participant:")
            print(f"      UPDATE contest_participants SET status='in_progress', completed_at=NULL,")
            print(f"        expires_at=NOW() + INTERVAL '2 hours'")
            print(f"        WHERE contest_id='{contest_id}' AND status IN ('completed','auto_completed');")
            print()
            print("   Or use a different active contest. Trying to proceed with admin API...")
    elif not session.get("started"):
        # Start fresh
        start_resp = await client.post(
            f"{base_url}/api/contests/{contest_id}/start", headers=headers, timeout=120.0
        )
        start_resp.raise_for_status()
        print("   Session: started fresh")
    else:
        print(f"   Session: {session_status}")

    # Use admin API to discover problems (doesn't need an active session)
    resp = await client.get(f"{base_url}/api/admin/problems", headers=headers, timeout=120.0)
    resp.raise_for_status()
    all_problems = resp.json()

    if not all_problems:
        print("❌ No problems found in the system.")
        sys.exit(1)

    # Pick the first problem that has test cases
    problem = all_problems[6]
    problem_id = problem["id"]
    available_langs = problem.get("languages", ["python"])
    language = "python" if "python" in available_langs else available_langs[0]

    print(f"   Problem: {problem.get('title', problem_id)}")
    print(f"   Language: {language}")

    return contest_id, problem_id, language


async def run_code(
    client: httpx.AsyncClient, base_url: str, token: str,
    contest_id: str, problem_id: str, language: str, code: str,
    user_id: int,
) -> dict:
    """Hit /api/code/run (doesn't require active contest session). Best for Piston load testing."""
    start = time.perf_counter()
    try:
        resp = await client.post(
            f"{base_url}/api/code/run",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "contestId": contest_id,
                "problemId": problem_id,
                "language": language,
                "code": code,
                "stdin": "",
            },
            timeout=HTTP_TIMEOUT,
        )
        elapsed = time.perf_counter() - start

        if resp.status_code == 429:
            return {"user": user_id, "status": "RATE_LIMITED", "elapsed": elapsed, "http_status": 429, "error": "Rate limited"}
        if resp.status_code >= 400:
            return {"user": user_id, "status": "HTTP_ERROR", "elapsed": elapsed, "http_status": resp.status_code, "error": resp.text[:200]}

        data = resp.json()
        return {
            "user": user_id, "status": data.get("status", "UNKNOWN"), "elapsed": elapsed,
            "http_status": resp.status_code,
            "passedCount": data.get("passedCount", 0),
            "totalCount": data.get("totalCount", 0),
        }
    except Exception as e:
        elapsed = time.perf_counter() - start
        return {"user": user_id, "status": "EXCEPTION", "elapsed": elapsed, "http_status": 0, "error": str(e)[:200]}


async def submit_solution(
    client: httpx.AsyncClient, base_url: str, token: str,
    contest_id: str, problem_id: str, language: str, code: str,
    user_id: int,
) -> dict:
    """Hit /api/submissions (requires active contest session). Full end-to-end test."""
    start = time.perf_counter()
    try:
        resp = await client.post(
            f"{base_url}/api/submissions",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "contestId": contest_id,
                "problemId": problem_id,
                "language": language,
                "code": code,
            },
            timeout=HTTP_TIMEOUT,
        )
        elapsed = time.perf_counter() - start

        if resp.status_code == 429:
            return {"user": user_id, "status": "RATE_LIMITED", "elapsed": elapsed, "http_status": 429, "error": "Rate limited"}
        if resp.status_code >= 400:
            return {"user": user_id, "status": "HTTP_ERROR", "elapsed": elapsed, "http_status": resp.status_code, "error": resp.text[:200]}

        data = resp.json()
        return {
            "user": user_id, "status": data.get("status", "UNKNOWN"), "elapsed": elapsed,
            "http_status": resp.status_code,
            "score": data.get("score", 0),
            "passedTests": data.get("passedTests", 0),
            "totalTests": data.get("totalTests", 0),
        }
    except Exception as e:
        elapsed = time.perf_counter() - start
        return {"user": user_id, "status": "EXCEPTION", "elapsed": elapsed, "http_status": 0, "error": str(e)[:200]}


# ── Main load test ───────────────────────────────────────────────────────────

async def run_load_test(base_url: str, num_users: int, mode: str = "run"):
    print(f"\n{'='*60}")
    print(f"  ZAP Load Test — {num_users} concurrent {'runs' if mode == 'run' else 'submissions'}")
    print(f"  Target: {base_url}")
    print(f"  Mode: {mode} ({'POST /api/code/run' if mode == 'run' else 'POST /api/submissions'})")
    print(f"{'='*60}\n")

    async with httpx.AsyncClient(timeout=120.0) as client:
        # Step 1: Login
        print("🔑 Logging in as admin...")
        try:
            token = await login(client, base_url, ADMIN_EMAIL, ADMIN_PASSWORD)
        except Exception as e:
            print(f"❌ Login failed: {e}")
            sys.exit(1)
        print(f"   ✅ Got token: {token[:20]}...")

        # Step 2: Find an active contest + problem
        print("\n📋 Discovering contest and problems...")
        contest_id, problem_id, language = await discover_contest(client, base_url, token)
        code = TEST_SOLUTIONS.get(language, TEST_SOLUTIONS["python"])

        # Step 3: Fire concurrent requests
        fn = run_code if mode == "run" else submit_solution
        print(f"\n🚀 Launching {num_users} concurrent {'runs' if mode == 'run' else 'submissions'}...")
        print(f"   (all using the same admin token — simulates concurrent load on Piston)\n")
        wall_start = time.perf_counter()

        tasks = [
            fn(client, base_url, token, contest_id, problem_id, language, code, i + 1)
            for i in range(num_users)
        ]
        results = await asyncio.gather(*tasks)

        wall_elapsed = time.perf_counter() - wall_start

    # Step 4: Analyze results
    _print_results(results, wall_elapsed, num_users)
    return results


def _print_results(results: list, wall_elapsed: float, num_users: int):
    print(f"\n{'='*60}")
    print(f"  RESULTS — {num_users} concurrent requests")
    print(f"{'='*60}\n")

    timings = [r["elapsed"] for r in results]
    successes = [r for r in results if r["http_status"] in (200, 201)]
    rate_limited = [r for r in results if r["status"] == "RATE_LIMITED"]
    errors = [r for r in results if r["status"] in ("HTTP_ERROR", "EXCEPTION")]

    print(f"  Total wall time:    {wall_elapsed:.2f}s")
    print(f"  Throughput:         {len(results) / wall_elapsed:.1f} req/s")
    print()
    print(f"  ✅ Successful:      {len(successes)}/{len(results)}")
    print(f"  ⚠️  Rate limited:   {len(rate_limited)}/{len(results)}")
    print(f"  ❌ Errors:          {len(errors)}/{len(results)}")

    if timings:
        print(f"\n  ⏱  Latency (all requests):")
        print(f"     Min:    {min(timings):.3f}s")
        print(f"     Max:    {max(timings):.3f}s")
        print(f"     Avg:    {statistics.mean(timings):.3f}s")
        print(f"     Median: {statistics.median(timings):.3f}s")
        if len(timings) >= 10:
            sorted_t = sorted(timings)
            print(f"     P90:    {sorted_t[int(len(sorted_t) * 0.9)]:.3f}s")
            print(f"     P95:    {sorted_t[int(len(sorted_t) * 0.95)]:.3f}s")
            print(f"     P99:    {sorted_t[int(len(sorted_t) * 0.99)]:.3f}s")

    if successes:
        success_times = [r["elapsed"] for r in successes]
        print(f"\n  ⏱  Latency (successful only):")
        print(f"     Min:    {min(success_times):.3f}s")
        print(f"     Max:    {max(success_times):.3f}s")
        print(f"     Avg:    {statistics.mean(success_times):.3f}s")
        print(f"     Median: {statistics.median(success_times):.3f}s")

    # Verdict breakdown
    verdicts: dict[str, int] = {}
    for r in results:
        v = r["status"]
        verdicts[v] = verdicts.get(v, 0) + 1
    print(f"\n  📊 Verdict breakdown:")
    for v, count in sorted(verdicts.items(), key=lambda x: -x[1]):
        print(f"     {v}: {count}")

    if errors:
        print(f"\n  ❌ Error details (first 5):")
        for r in errors[:5]:
            print(f"     User {r['user']}: [{r['http_status']}] {r.get('error', 'unknown')[:100]}")

    if rate_limited:
        print(f"\n  ⚠️  {len(rate_limited)} requests were rate-limited.")
        print(f"     Set RATE_LIMIT_ENABLED=false in .env to disable for load testing.")

    print(f"\n{'='*60}\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Load test the ZAP submission API")
    parser.add_argument("--users", type=int, default=10, help="Number of concurrent users (default: 10)")
    parser.add_argument("--base-url", default=DEFAULT_BASE_URL, help=f"API base URL (default: {DEFAULT_BASE_URL})")
    parser.add_argument("--mode", choices=["run", "submit"], default="run",
                        help="'run' uses /code/run (no session needed), 'submit' uses /submissions (default: run)")
    args = parser.parse_args()

    results = asyncio.run(run_load_test(args.base_url, args.users, args.mode))
