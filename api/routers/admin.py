import csv
import io

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy import func, select
from sqlalchemy.orm import Session

import models
from database import get_db
from deps import require_admin
from routers.contests import compute_status, get_contest_or_404, leaderboard
from serializers import serialize_submission

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/statistics")
def statistics(db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    total_users = db.scalar(select(func.count(models.User.id))) or 0
    total_problems = db.scalar(select(func.count(models.Problem.id)).where(models.Problem.status == "active")) or 0
    total_contests = db.scalar(select(func.count(models.Contest.id))) or 0
    contests = db.scalars(select(models.Contest)).all()
    active_contests = sum(1 for c in contests if compute_status(c) == "active")
    total_submissions = db.scalar(select(func.count(models.Submission.id))) or 0
    accepted = db.scalar(select(func.count(models.Submission.id)).where(models.Submission.status == "ACCEPTED")) or 0

    recent_contests = db.scalars(select(models.Contest).order_by(models.Contest.created_at.desc()).limit(5)).all()
    recent_subs = db.scalars(select(models.Submission).order_by(models.Submission.submitted_at.desc()).limit(8)).all()

    return {
        "totalUsers": total_users, "totalProblems": total_problems, "totalContests": total_contests,
        "activeContests": active_contests, "totalSubmissions": total_submissions,
        "acceptedSubmissions": accepted, "failedSubmissions": total_submissions - accepted,
        "recentContests": [{"id": c.id, "name": c.name, "status": compute_status(c)} for c in recent_contests],
        "recentSubmissions": [
            serialize_submission(s, db.get(models.Problem, s.problem_id).title if db.get(models.Problem, s.problem_id) else None, include_code=False)
            for s in recent_subs
        ],
    }


@router.get("/submissions")
def admin_submissions(
    db: Session = Depends(get_db), _: models.User = Depends(require_admin),
    contestId: str | None = None, userId: str | None = None, problemId: str | None = None, status: str | None = None,
    limit: int = Query(default=100, le=500),
):
    stmt = select(models.Submission).order_by(models.Submission.submitted_at.desc()).limit(limit)
    if contestId:
        stmt = stmt.where(models.Submission.contest_id == contestId)
    if userId:
        stmt = stmt.where(models.Submission.user_id == userId)
    if problemId:
        stmt = stmt.where(models.Submission.problem_id == problemId)
    if status:
        stmt = stmt.where(models.Submission.status == status)

    subs = db.scalars(stmt).all()
    out = []
    for s in subs:
        problem = db.get(models.Problem, s.problem_id)
        user = db.get(models.User, s.user_id)
        row = serialize_submission(s, problem.title if problem else None)
        row["userName"] = user.name if user else None
        row["userEmail"] = user.email if user else None
        out.append(row)
    return out


@router.get("/logs")
def admin_logs(db: Session = Depends(get_db), _: models.User = Depends(require_admin), limit: int = Query(default=100, le=500)):
    logs = db.scalars(select(models.ExecutionLog).order_by(models.ExecutionLog.created_at.desc()).limit(limit)).all()
    out = []
    for log in logs:
        user = db.get(models.User, log.user_id) if log.user_id else None
        problem = db.get(models.Problem, log.problem_id) if log.problem_id else None
        out.append({
            "id": log.id, "submissionId": log.submission_id, "userId": log.user_id,
            "userName": user.name if user else None, "problemTitle": problem.title if problem else None,
            "language": log.language, "status": log.status, "executionDuration": log.execution_duration,
            "passedTests": log.passed_tests, "failedTests": log.failed_tests, "errorType": log.error_type,
            "createdAt": log.created_at.isoformat(),
        })
    return out


@router.get("/users")
def admin_users(db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    users = db.scalars(select(models.User).order_by(models.User.created_at.desc())).all()
    return [{"id": u.id, "name": u.name, "email": u.email, "role": u.role, "createdAt": u.created_at.isoformat()} for u in users]


def _export_rows(db: Session, contest: models.Contest) -> list[dict]:
    entries = leaderboard(contest.id, db)
    rows = []
    for e in entries:
        participant = db.scalar(select(models.ContestParticipant).where(
            models.ContestParticipant.contest_id == contest.id, models.ContestParticipant.user_id == e["userId"],
        ))
        user = db.get(models.User, e["userId"])
        rows.append({
            "Rank": e["rank"], "ParticipantId": e["userId"], "Name": user.name if user else "",
            "Email": user.email if user else "", "Score": e["score"], "Solved": e["solved"],
            "TotalProblems": e["totalProblems"], "Submissions": e["submissions"],
            "StartedAt": participant.started_at.isoformat() if participant and participant.started_at else "",
            "CompletedAt": participant.completed_at.isoformat() if participant and participant.completed_at else "",
        })
    return rows


@router.get("/contests/{contest_id}/results/export")
def export_results(contest_id: str, format: str = Query(default="csv"), db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    contest = get_contest_or_404(db, contest_id)
    rows = _export_rows(db, contest)
    if not rows:
        rows = [{}]
    fieldnames = list(rows[0].keys()) if rows[0] else [
        "Rank", "ParticipantId", "Name", "Email", "Score", "Solved", "TotalProblems", "Submissions", "StartedAt", "CompletedAt"
    ]

    if format == "xlsx":
        try:
            from openpyxl import Workbook
        except ImportError:
            raise HTTPException(status_code=500, detail="XLSX export dependency not installed")
        wb = Workbook()
        ws = wb.active
        ws.append(fieldnames)
        for row in rows:
            ws.append([row.get(f, "") for f in fieldnames])
        buffer = io.BytesIO()
        wb.save(buffer)
        buffer.seek(0)
        return StreamingResponse(
            buffer, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f"attachment; filename=contest-{contest.slug}-results.xlsx"},
        )

    buffer = io.StringIO()
    writer = csv.DictWriter(buffer, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)
    buffer.seek(0)
    return StreamingResponse(
        iter([buffer.getvalue()]), media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=contest-{contest.slug}-results.csv"},
    )
