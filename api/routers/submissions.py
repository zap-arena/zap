from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

import models
import schemas
from database import get_db
from deps import get_current_user
from scoring import judge_submission, run_public, compute_problem_score
from serializers import serialize_submission

router = APIRouter(prefix="/api", tags=["submissions"])

MIN_SUBMIT_INTERVAL_SECONDS = 3


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def _get_active_problem(db: Session, problem_id: str) -> models.Problem:
    problem = db.get(models.Problem, problem_id)
    if not problem or problem.status != "active":
        raise HTTPException(status_code=404, detail="Problem not found")
    return problem


@router.post("/code/run")
async def run_code(payload: schemas.RunRequest, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    problem = _get_active_problem(db, payload.problemId)
    if payload.language not in (problem.languages or []):
        raise HTTPException(status_code=400, detail="Language not supported for this problem")

    result = await run_public(problem, payload.language, payload.code, payload.stdin, problem.time_limit)
    db.add(models.ContestActivityLog(
        contest_id=payload.contestId, user_id=user.id, problem_id=problem.id, event_type="CODE_RUN",
    ))
    db.commit()
    return result


@router.post("/submissions", status_code=201)
async def create_submission(payload: schemas.SubmitRequest, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    problem = _get_active_problem(db, payload.problemId)
    if payload.language not in (problem.languages or []):
        raise HTTPException(status_code=400, detail="Language not supported for this problem")

    contest = None
    contest_max_score = problem.max_score
    if payload.contestId:
        contest = db.get(models.Contest, payload.contestId)
        if not contest:
            raise HTTPException(status_code=404, detail="Contest not found")
        participant = db.scalar(select(models.ContestParticipant).where(
            models.ContestParticipant.contest_id == contest.id, models.ContestParticipant.user_id == user.id,
        ))
        if not participant or participant.status != "in_progress":
            raise HTTPException(status_code=403, detail="You have not started this contest")
        if participant.expires_at and now_utc() > participant.expires_at:
            participant.status = "auto_completed"
            participant.completed_at = now_utc()
            db.commit()
            raise HTTPException(status_code=403, detail="Contest time has expired")

        cp = db.scalar(select(models.ContestProblem).where(
            models.ContestProblem.contest_id == contest.id, models.ContestProblem.problem_id == problem.id,
        ))
        if not cp:
            raise HTTPException(status_code=400, detail="Problem is not part of this contest")
        contest_max_score = cp.max_score

    last_submission = db.scalar(select(models.Submission).where(
        models.Submission.user_id == user.id, models.Submission.problem_id == problem.id,
    ).order_by(models.Submission.submitted_at.desc()))
    if last_submission and (now_utc() - last_submission.submitted_at).total_seconds() < MIN_SUBMIT_INTERVAL_SECONDS:
        raise HTTPException(status_code=429, detail="Please wait a few seconds before submitting again")

    verdict = await judge_submission(problem, payload.language, payload.code)
    all_passed = verdict["passedTests"] == verdict["totalTests"] and verdict["status"] == "ACCEPTED"
    score = compute_problem_score(
        contest.scoring_mode if contest else "partial", contest_max_score,
        verdict["score"], verdict["maxScore"], all_passed,
    )

    # Judging is slow, so re-check the clock: anything landing after the contest ended is recorded but never scored.
    is_late = bool(contest and now_utc() > contest.end_time)

    submission = models.Submission(
        contest_id=contest.id if contest else None, problem_id=problem.id, user_id=user.id,
        language=payload.language, source_code=payload.code, status=verdict["status"],
        passed_tests=verdict["passedTests"], total_tests=verdict["totalTests"],
        score=0 if is_late else score,
        execution_time=verdict["executionTime"], compile_output=verdict["compileOutput"],
        is_late=is_late,
    )
    db.add(submission)
    db.flush()

    for tr in verdict["testResults"]:
        db.add(models.SubmissionTestResult(
            submission_id=submission.id, name=tr["name"], status=tr["status"],
            execution_time=tr["executionTime"], error_message=tr.get("errorMessage"),
        ))

    db.add(models.ExecutionLog(
        submission_id=submission.id, user_id=user.id, problem_id=problem.id, language=payload.language,
        execution_duration=verdict["executionTime"], passed_tests=verdict["passedTests"],
        failed_tests=verdict["totalTests"] - verdict["passedTests"], status=verdict["status"],
        error_type=verdict["status"] if verdict["status"] != "ACCEPTED" else None,
    ))

    if contest:
        participant = db.scalar(select(models.ContestParticipant).where(
            models.ContestParticipant.contest_id == contest.id, models.ContestParticipant.user_id == user.id,
        ))
        participant.total_submissions += 1
        if not is_late:
            prior_best = db.scalar(select(models.Submission).where(
                models.Submission.contest_id == contest.id, models.Submission.user_id == user.id,
                models.Submission.problem_id == problem.id, models.Submission.id != submission.id,
                models.Submission.is_late.is_(False),
            ).order_by(models.Submission.score.desc()))
            prior_best_score = prior_best.score if prior_best else 0
            if score > prior_best_score:
                participant.score += (score - prior_best_score)
                if all_passed and prior_best_score < contest_max_score:
                    participant.problems_solved += 1
        db.add(models.ContestActivityLog(
            contest_id=contest.id, user_id=user.id, problem_id=problem.id, submission_id=submission.id,
            event_type="SOLUTION_SUBMITTED" if all_passed and not is_late else "SUBMISSION_FAILED",
        ))

    db.commit()
    db.refresh(submission)
    return serialize_submission(submission, problem.title) | {"testResults": verdict["testResults"]}


@router.get("/submissions/{submission_id}")
def get_submission(submission_id: str, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    submission = db.get(models.Submission, submission_id)
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    if submission.user_id != user.id and user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to view this submission")
    problem = db.get(models.Problem, submission.problem_id)
    results = db.scalars(select(models.SubmissionTestResult).where(
        models.SubmissionTestResult.submission_id == submission.id,
    )).all()
    return serialize_submission(submission, problem.title if problem else None) | {
        "testResults": [
            {"name": r.name, "status": r.status, "executionTime": r.execution_time, "errorMessage": r.error_message}
            for r in results
        ]
    }
