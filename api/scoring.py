from typing import Any, Optional

import asyncio

import models
from piston_service import execute, normalize_output


async def run_public(problem: models.Problem, language: str, code: str, stdin: str, time_limit: int) -> dict[str, Any]:
    """Run with custom/sample stdin. Used for the 'Run Code' action (not scored)."""
    execution = await execute(language, code, stdin, time_limit)
    result = execution.get("result") or {}
    run_result = result.get("run") or {}
    compile_result = result.get("compile") or {}
    return {
        "status": execution["status"],
        "stdout": run_result.get("stdout") or run_result.get("output") or "",
        "stderr": run_result.get("stderr") or "",
        "compileOutput": compile_result.get("stderr") or compile_result.get("output") or "",
        "executionTime": execution["elapsedMs"] / 1000,
        "exitCode": run_result.get("code"),
        "error": execution.get("error"),
    }


def visible_test_cases(problem: models.Problem, stage: Optional[models.ProblemStage] = None) -> list[models.TestCase]:
    source = stage.test_cases if stage is not None else [tc for tc in problem.test_cases if not tc.stage_id]
    return sorted(
        [tc for tc in source if not tc.hidden and tc.perf_tier in (None, "", "small")],
        key=lambda t: t.order,
    )


def _parse_sample_result(tc: models.TestCase, execution: dict[str, Any]) -> dict[str, Any]:
    """Parse a single piston execution into a sample test result dict."""
    result = execution.get("result") or {}
    run_result = result.get("run") or {}
    compile_result = result.get("compile") or {}
    status = execution["status"]

    actual = run_result.get("stdout") or run_result.get("output") or ""
    passed = status == "COMPLETED" and normalize_output(actual) == normalize_output(tc.expected_output)

    return {
        "id": tc.id,
        "name": tc.name,
        "input": tc.input,
        "expectedOutput": tc.expected_output,
        "actualOutput": actual,
        "passed": passed,
        "status": "PASSED" if passed else (status if status != "COMPLETED" else "WRONG_ANSWER"),
        "executionTime": round(execution["elapsedMs"] / 1000, 3),
        "stderr": run_result.get("stderr") or "",
        "errorMessage": (
            compile_result.get("stderr") or run_result.get("stderr") or execution.get("error")
        ) if not passed else None,
        "_compile_output": compile_result.get("stderr") or compile_result.get("output") or "",
        "_raw_status": status,
    }


async def run_samples(
    problem: models.Problem, language: str, code: str, time_limit: int,
    stage: Optional[models.ProblemStage] = None,
) -> dict[str, Any]:
    """Run every visible sample case so 'Run' can show actual vs expected output per case.

    Runs the first test case to check for compilation errors, then fires
    all remaining cases concurrently for maximum speed.
    """
    test_cases = visible_test_cases(problem, stage)
    if not test_cases:
        return {"status": "NO_SAMPLES", "stdout": "", "stderr": "", "compileOutput": "", "testResults": []}

    # ── Run first case to check compilation ──────────────────────────────
    first_exec = await execute(language, code, test_cases[0].input, time_limit)
    first_result = _parse_sample_result(test_cases[0], first_exec)

    # If compilation fails or judge is down, no point running the rest.
    if first_result["_raw_status"] in {"COMPILATION_ERROR", "JUDGE_UNAVAILABLE"}:
        return {
            "status": first_result["_raw_status"],
            "stdout": "",
            "stderr": "",
            "compileOutput": first_result["_compile_output"],
            "passedCount": 0,
            "totalCount": len(test_cases),
            "testResults": [{k: v for k, v in first_result.items() if not k.startswith("_")}],
        }

    # ── Fire remaining cases concurrently ────────────────────────────────
    if len(test_cases) > 1:
        remaining_execs = await asyncio.gather(
            *(execute(language, code, tc.input, time_limit) for tc in test_cases[1:])
        )
        remaining_results = [
            _parse_sample_result(tc, ex) for tc, ex in zip(test_cases[1:], remaining_execs)
        ]
    else:
        remaining_results = []

    all_results = [first_result] + remaining_results
    # Strip internal keys before returning
    test_results = [{k: v for k, v in r.items() if not k.startswith("_")} for r in all_results]

    compile_output = ""
    overall_status = "COMPLETED"
    for r in all_results:
        if r["_raw_status"] == "COMPILATION_ERROR":
            compile_output = r["_compile_output"]
            overall_status = "COMPILATION_ERROR"
            break
        if r["_raw_status"] == "JUDGE_UNAVAILABLE":
            overall_status = "JUDGE_UNAVAILABLE"
            break

    if overall_status == "COMPLETED" and any(not t["passed"] for t in test_results):
        overall_status = "WRONG_ANSWER"

    return {
        "status": overall_status,
        "stdout": "",
        "stderr": "",
        "compileOutput": compile_output,
        "passedCount": sum(1 for t in test_results if t["passed"]),
        "totalCount": len(test_cases),
        "testResults": test_results,
    }


def _parse_judge_result(tc: models.TestCase, index: int, execution: dict[str, Any]) -> dict[str, Any]:
    """Parse a single piston execution into a judge test result dict."""
    result = execution.get("result") or {}
    run_result = result.get("run") or {}
    compile_result = result.get("compile") or {}
    status = execution["status"]

    stdout = run_result.get("stdout") or run_result.get("output")
    passed = status == "COMPLETED" and normalize_output(stdout) == normalize_output(tc.expected_output)
    verdict = "PASSED" if passed else (status if status != "COMPLETED" else "WRONG_ANSWER")

    return {
        "name": f"Hidden test {index}" if tc.hidden else tc.name,
        "hidden": tc.hidden,
        "passed": passed,
        "status": verdict,
        "executionTime": round(execution["elapsedMs"] / 1000, 3),
        "errorMessage": (compile_result.get("stderr") or run_result.get("stderr") or execution.get("error"))
        if not passed else None,
        "_marks": max(tc.marks, 0) or 1,
        "_raw_status": status,
        "_compile_output": compile_result.get("stderr") or compile_result.get("output"),
    }


async def judge_submission(
    problem: models.Problem, language: str, code: str, stage: Optional[models.ProblemStage] = None
) -> dict[str, Any]:
    """Run every test case (public + hidden) and compute a server-side score. Never reveals hidden IO.

    When `stage` is given (progressive/"Code War" mode), judges against that stage's own
    test cases instead of the problem-level ones, using the stage's time limit override.

    Runs the first test case to validate compilation, then fires all remaining
    cases concurrently for maximum throughput.
    """
    if stage is not None:
        test_cases = sorted(
            [tc for tc in stage.test_cases if tc.perf_tier in (None, "", "small")], key=lambda t: t.order
        )
        time_limit = stage.time_limit or problem.time_limit
    else:
        test_cases = sorted([tc for tc in problem.test_cases if not tc.stage_id], key=lambda t: t.order)
        time_limit = problem.time_limit
    if not test_cases:
        return {
            "status": "INTERNAL_ERROR", "passedTests": 0, "totalTests": 0, "score": 0, "maxScore": 0,
            "executionTime": 0, "compileOutput": None, "testResults": [],
        }

    total_marks = sum(max(tc.marks, 0) for tc in test_cases) or len(test_cases)

    # ── Run first case to check compilation ──────────────────────────────
    first_exec = await execute(language, code, test_cases[0].input, time_limit)
    first_result = _parse_judge_result(test_cases[0], 1, first_exec)

    if first_result["_raw_status"] in {"COMPILATION_ERROR", "JUDGE_UNAVAILABLE"}:
        return {
            "status": first_result["_raw_status"],
            "passedTests": 0,
            "totalTests": len(test_cases),
            "score": 0,
            "maxScore": total_marks,
            "executionTime": round(first_exec["elapsedMs"] / 1000, 3),
            "compileOutput": first_result["_compile_output"],
            "testResults": [{k: v for k, v in first_result.items() if not k.startswith("_")}],
        }

    # ── Fire remaining cases concurrently ────────────────────────────────
    if len(test_cases) > 1:
        remaining_execs = await asyncio.gather(
            *(execute(language, code, tc.input, time_limit) for tc in test_cases[1:])
        )
        remaining_results = [
            _parse_judge_result(tc, i, ex)
            for i, (tc, ex) in enumerate(zip(test_cases[1:], remaining_execs), start=2)
        ]
    else:
        remaining_results = []

    all_results = [first_result] + remaining_results

    # Compute scoring
    passed_marks = sum(r["_marks"] for r in all_results if r["passed"])
    total_time = sum(r["executionTime"] for r in all_results)
    passed_count = sum(1 for r in all_results if r["passed"])
    total_count = len(test_cases)

    compile_output = None
    overall_status = "ACCEPTED"
    for r in all_results:
        if r["_raw_status"] in {"COMPILATION_ERROR", "JUDGE_UNAVAILABLE"}:
            overall_status = r["_raw_status"]
            compile_output = r["_compile_output"]
            break

    if overall_status == "ACCEPTED":
        first_failure = next((r for r in all_results if not r["passed"]), None)
        overall_status = first_failure["status"] if first_failure else "ACCEPTED"

    # Strip internal keys
    test_results = [{k: v for k, v in r.items() if not k.startswith("_")} for r in all_results]

    return {
        "status": overall_status,
        "passedTests": passed_count,
        "totalTests": total_count,
        "score": passed_marks if overall_status != "JUDGE_UNAVAILABLE" else 0,
        "maxScore": total_marks,
        "executionTime": round(total_time, 3),
        "compileOutput": compile_output,
        "testResults": test_results,
    }


def compute_problem_score(scoring_mode: str, max_score: int, passed_marks: int, max_marks: int, passed_all: bool) -> int:
    if scoring_mode == "full":
        return max_score if passed_all else 0
    if max_marks <= 0:
        return 0
    return round((passed_marks / max_marks) * max_score)
