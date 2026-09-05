from typing import Optional
import models


def serialize_test_case(tc: models.TestCase, include_hidden: bool) -> dict:
    if tc.hidden and not include_hidden:
        return {"id": tc.id, "name": tc.name, "hidden": True, "marks": tc.marks}
    return {
        "id": tc.id, "name": tc.name, "input": tc.input, "expectedOutput": tc.expected_output,
        "hidden": tc.hidden, "marks": tc.marks,
    }


def serialize_stage(stage: models.ProblemStage, include_hidden: bool, locked: bool = False) -> dict:
    if locked:
        return {"id": stage.id, "stageOrder": stage.stage_order, "title": stage.title, "locked": True}
    return {
        "id": stage.id, "stageOrder": stage.stage_order, "title": stage.title, "statement": stage.statement,
        "expectedComplexity": stage.expected_complexity, "timeLimit": stage.time_limit,
        "memoryLimit": stage.memory_limit, "maxScore": stage.max_score,
        "testCases": [
            serialize_test_case(tc, include_hidden) for tc in sorted(stage.test_cases, key=lambda t: t.order)
            if tc.perf_tier in (None, "", "small")
        ],
        "locked": False,
    }


def serialize_problem(
    p: models.Problem, include_hidden: bool = False, chain_progress: Optional["models.ContestChainProgress"] = None
) -> dict:
    out = {
        "id": p.id, "title": p.title, "slug": p.slug, "difficulty": p.difficulty,
        "description": p.description, "inputFormat": p.input_format, "outputFormat": p.output_format,
        "constraints": p.constraints, "examples": p.examples or [], "tags": p.tags or [],
        "languages": p.languages or [], "boilerplates": p.boilerplates or {},
        "testCases": [
            serialize_test_case(tc, include_hidden) for tc in sorted(p.test_cases, key=lambda t: t.order)
            if not tc.stage_id
        ],
        "timeLimit": p.time_limit, "memoryLimit": p.memory_limit, "maxScore": p.max_score,
        "status": p.status, "createdAt": p.created_at.isoformat(), "isProgressive": p.is_progressive,
        "type": getattr(p, "type", "coding"),
        "debuggingData": getattr(p, "debugging_data", None),
    }
    if p.is_progressive:
        stages = sorted(p.stages, key=lambda s: s.stage_order)
        current_order = chain_progress.current_stage_order if chain_progress else 1
        out["currentStageOrder"] = current_order
        out["totalStages"] = len(stages)
        # Never leak future-stage statements/test cases to the candidate.
        out["stages"] = [
            serialize_stage(s, include_hidden, locked=s.stage_order > current_order) for s in stages
        ]
    return out


def serialize_problem_summary(p: models.Problem) -> dict:
    return {
        "id": p.id, "title": p.title, "slug": p.slug, "difficulty": p.difficulty,
        "tags": p.tags or [], "languages": p.languages or [], "status": p.status,
    }


def serialize_contest(c: models.Contest, include_problems: bool = True) -> dict:
    out = {
        "id": c.id, "name": c.name, "slug": c.slug, "description": c.description,
        "instructions": c.instructions or "",
        "startTime": c.start_time.isoformat(), "endTime": c.end_time.isoformat(), "duration": c.duration,
        "status": c.status, "scoringMode": c.scoring_mode, "mode": c.mode, "leaderboardVisible": c.leaderboard_visible,
        "problemCount": len(c.problems),
        "maxScore": sum(cp.max_score for cp in c.problems),
        "moderators": [
            {"userId": m.user_id, "name": m.user.name if m.user else None, "email": m.user.email if m.user else None}
            for m in c.moderators
        ],
        "createdAt": c.created_at.isoformat(),
    }
    # Titles and difficulties stay hidden until the candidate is inside the contest.
    out["problems"] = [
        {"problemId": cp.problem_id, "order": cp.order, "maxScore": cp.max_score,
         "title": cp.problem.title if cp.problem else None,
         "difficulty": cp.problem.difficulty if cp.problem else None}
        for cp in sorted(c.problems, key=lambda x: x.order)
    ] if include_problems else []
    return out


def serialize_submission(s: models.Submission, problem_title: Optional[str] = None, include_code: bool = True) -> dict:
    out = {
        "id": s.id, "contestId": s.contest_id, "problemId": s.problem_id, "stageId": s.stage_id,
        "problemTitle": problem_title,
        "userId": s.user_id, "language": s.language, "status": s.status, "passedTests": s.passed_tests,
        "totalTests": s.total_tests, "score": s.score, "executionTime": s.execution_time,
        "memoryUsage": s.memory_usage, "submittedAt": s.submitted_at.isoformat(), "compileOutput": s.compile_output,
        "isLate": bool(s.is_late),
    }
    if include_code:
        out["sourceCode"] = s.source_code
    return out


def serialize_participant(p: models.ContestParticipant, user: Optional[models.User] = None) -> dict:
    return {
        "id": p.id, "contestId": p.contest_id, "userId": p.user_id,
        "userName": user.name if user else None, "userEmail": user.email if user else None,
        "joinedAt": p.joined_at.isoformat(),
        "startedAt": p.started_at.isoformat() if p.started_at else None,
        "expiresAt": p.expires_at.isoformat() if p.expires_at else None,
        "completedAt": p.completed_at.isoformat() if p.completed_at else None,
        "status": p.status, "score": p.score, "problemsSolved": p.problems_solved,
        "totalSubmissions": p.total_submissions,
    }
