import json
from typing import Any, Optional

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


async def judge_submission(
    problem: models.Problem, language: str, code: str, stage: Optional[models.ProblemStage] = None
) -> dict[str, Any]:
    """Run every test case (public + hidden) and compute a server-side score. Never reveals hidden IO.

    When `stage` is given (progressive/"Code War" mode), judges against that stage's own
    test cases instead of the problem-level ones, using the stage's time limit override.
    """
    if getattr(problem, "type", "coding") == "debugging":
        try:
            answer = json.loads(code)
            candidate_index = int(answer.get("index", -1))
            candidate_value = str(answer.get("expected_value", "")).strip()
            
            debugging_data = problem.debugging_data or {}
            expected_index = int(debugging_data.get("bug_row", -1))
            expected_val = str(debugging_data.get("expected_value", "")).strip()
            
            passed = (candidate_index == expected_index and candidate_value == expected_val)
            max_score = problem.max_score
            score = max_score if passed else 0
            status = "ACCEPTED" if passed else "WRONG_ANSWER"
            return {
                "status": status,
                "passedTests": 1 if passed else 0,
                "totalTests": 1,
                "score": score,
                "maxScore": max_score,
                "executionTime": 0.0,
                "compileOutput": None,
                "testResults": [{
                    "name": "Spot the Imposter",
                    "hidden": False,
                    "passed": passed,
                    "status": "PASSED" if passed else "WRONG_ANSWER",
                    "executionTime": 0.0,
                    "errorMessage": None if passed else "Incorrect row or expected value."
                }]
            }
        except Exception as e:
            return {
                "status": "INTERNAL_ERROR",
                "passedTests": 0,
                "totalTests": 1,
                "score": 0,
                "maxScore": problem.max_score,
                "executionTime": 0.0,
                "compileOutput": f"Failed to parse debugging answer: {e}",
                "testResults": []
            }

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
            "status": "INTERNAL_ERROR", "passedTests": 0, "totalTests": 0, "score": 0,
            "executionTime": 0, "compileOutput": None, "testResults": [],
        }

    test_results: list[dict[str, Any]] = []
    passed_marks = 0
    total_marks = sum(max(tc.marks, 0) for tc in test_cases) or len(test_cases)
    total_time = 0.0
    compile_output = None
    overall_status = "ACCEPTED"

    for index, tc in enumerate(test_cases, start=1):
        execution = await execute(language, code, tc.input, time_limit)
        result = execution.get("result") or {}
        run_result = result.get("run") or {}
        compile_result = result.get("compile") or {}
        status = execution["status"]
        total_time += execution["elapsedMs"] / 1000

        if status == "COMPILATION_ERROR":
            compile_output = compile_result.get("stderr") or compile_result.get("output")

        stdout = run_result.get("stdout") or run_result.get("output")
        passed = status == "COMPLETED" and normalize_output(stdout) == normalize_output(tc.expected_output)
        verdict = "PASSED" if passed else (status if status != "COMPLETED" else "WRONG_ANSWER")

        if passed:
            passed_marks += max(tc.marks, 0) or 1

        test_results.append({
            "name": f"Hidden test {index}" if tc.hidden else tc.name,
            "hidden": tc.hidden,
            "passed": passed,
            "status": verdict,
            "executionTime": round(execution["elapsedMs"] / 1000, 3),
            "errorMessage": (compile_result.get("stderr") or run_result.get("stderr") or execution.get("error"))
            if not passed else None,
        })

        if status in {"COMPILATION_ERROR", "JUDGE_UNAVAILABLE"}:
            overall_status = status
            # Remaining test cases could not be evaluated; treat as not-passed but don't fabricate results.
            break

    passed_count = sum(1 for t in test_results if t["passed"])
    total_count = len(test_cases)

    if overall_status == "ACCEPTED":
        first_failure = next((t for t in test_results if not t["passed"]), None)
        overall_status = first_failure["status"] if first_failure else "ACCEPTED"

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
