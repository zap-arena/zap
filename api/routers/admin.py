from typing import Optional
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
import analytics_engine

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
    contestId: Optional[str] = None, userId: Optional[str] = None, problemId: Optional[str] = None, status: Optional[str] = None,
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
def admin_users(contest_id: Optional[str] = None, db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    query = select(models.User)
    if contest_id:
        query = query.join(models.ContestParticipant, models.User.id == models.ContestParticipant.user_id)\
                     .where(models.ContestParticipant.contest_id == contest_id)
    users = db.scalars(query.order_by(models.User.created_at.desc())).all()
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

@router.get("/analytics/users")
def analytics_users(
    contest_id: Optional[str] = None,
    user_id: Optional[str] = None,
    db: Session = Depends(get_db), 
    _: models.User = Depends(require_admin)
):
    query = select(models.ContestActivityLog.user_id, models.ContestActivityLog.event_type, func.count()).where(models.ContestActivityLog.user_id.is_not(None))
    
    if contest_id:
        query = query.where(models.ContestActivityLog.contest_id == contest_id)
    if user_id:
        query = query.where(models.ContestActivityLog.user_id == user_id)
        
    rows = db.execute(query.group_by(models.ContestActivityLog.user_id, models.ContestActivityLog.event_type)).all()
    
    users_data = {}
    for user_id, event_type, count in rows:
        if user_id not in users_data:
            user = db.get(models.User, user_id)
            if not user:
                continue
            users_data[user_id] = {
                "user": {"id": user.id, "name": user.name, "email": user.email},
                "metrics": {}
            }
        users_data[user_id]["metrics"][event_type] = count
        
    return list(users_data.values())

@router.get("/analytics/events")
def analytics_events(
    interval: Optional[str] = "hour",
    contest_id: Optional[str] = None,
    user_id: Optional[str] = None,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin)
):
    query = select(models.ContestActivityLog)
    if contest_id:
        query = query.where(models.ContestActivityLog.contest_id == contest_id)
    if user_id:
        query = query.where(models.ContestActivityLog.user_id == user_id)
        
    logs = db.scalars(query.order_by(models.ContestActivityLog.created_at)).all()
    
    summary = {}
    timeseries_dict = {}
    
    for log in logs:
        # summary
        summary[log.event_type] = summary.get(log.event_type, 0) + 1
        
        # timeseries
        dt = log.created_at
        if dt:
            if interval == "minute":
                time_key = dt.replace(second=0, microsecond=0).isoformat()
            elif interval == "day":
                time_key = dt.replace(hour=0, minute=0, second=0, microsecond=0).isoformat()
            else:
                time_key = dt.replace(minute=0, second=0, microsecond=0).isoformat()
                
            if time_key not in timeseries_dict:
                timeseries_dict[time_key] = {"time": time_key}
            timeseries_dict[time_key][log.event_type] = timeseries_dict[time_key].get(log.event_type, 0) + 1
            
    summary_list = [{"label": k, "total": v} for k, v in summary.items()]
    summary_list.sort(key=lambda x: x["total"], reverse=True)
    
    timeseries_list = sorted(list(timeseries_dict.values()), key=lambda x: x["time"])
    
    return {
        "summary": summary_list,
        "timeseries": timeseries_list,
        "labels": list(summary.keys())
    }


# ---------- Progressive ("Code War") chain behavior analytics ----------
async def _analyze_participant_chain(
    db: Session, contest_id: str, user_id: str, problem: models.Problem
) -> dict:
    metrics = analytics_engine.compute_stage_metrics(db, contest_id, user_id, problem.id)
    stages_by_id = {s.id: s for s in problem.stages}

    complexities: dict[str, dict] = {}
    for m in metrics:
        stage = stages_by_id.get(m.stage_id)
        accepted = db.scalar(select(models.Submission).where(
            models.Submission.contest_id == contest_id, models.Submission.user_id == user_id,
            models.Submission.stage_id == m.stage_id, models.Submission.status == "ACCEPTED",
        ).order_by(models.Submission.submitted_at))
        if stage and accepted:
            complexities[m.stage_id] = await analytics_engine.estimate_complexity(stage, accepted.language, accepted.source_code)
    analytics_engine.attach_complexity(metrics, complexities)

    expected = {s.id: s.expected_complexity for s in problem.stages}
    pattern = analytics_engine.classify_pattern(metrics, expected)

    return {
        "problemId": problem.id, "problemTitle": problem.title, "pattern": pattern,
        "stages": [
            {
                "stageId": m.stage_id, "stageOrder": m.stage_order, "solved": m.solved,
                "attempts": m.attempts, "runs": m.runs, "errorsSeen": sorted(m.errors_seen),
                "errorsResolved": m.errors_resolved, "timeToSolveSeconds": m.time_to_solve_seconds,
                "codeChurn": round(m.code_churn, 3), "crossStageRewrite": round(m.cross_stage_rewrite, 3) if m.cross_stage_rewrite is not None else None,
                "complexity": m.complexity, "expectedComplexity": expected.get(m.stage_id),
            }
            for m in metrics
        ],
        "_metrics": metrics,
    }


@router.get("/contests/{contest_id}/progressive-analytics")
async def progressive_analytics(contest_id: str, db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    contest = get_contest_or_404(db, contest_id)
    if contest.mode != "progressive":
        raise HTTPException(status_code=400, detail="This contest is not in progressive mode")

    chain_problems = [cp.problem for cp in contest.problems if cp.problem and cp.problem.is_progressive]
    participants = db.scalars(select(models.ContestParticipant).where(
        models.ContestParticipant.contest_id == contest.id,
    )).all()

    per_participant: list[dict] = []
    cohort_by_problem: dict[str, list[list]] = {p.id: [] for p in chain_problems}
    for participant in participants:
        user = db.get(models.User, participant.user_id)
        chains = []
        for problem in chain_problems:
            analysis = await _analyze_participant_chain(db, contest.id, participant.user_id, problem)
            cohort_by_problem[problem.id].append(analysis["_metrics"])
            chains.append(analysis)
        per_participant.append({
            "userId": participant.user_id, "userName": user.name if user else "Unknown", "chains": chains,
        })

    for entry in per_participant:
        for chain in entry["chains"]:
            cohort = cohort_by_problem[chain["problemId"]]
            chain["behaviorScore"] = analytics_engine.compute_behavior_score(chain.pop("_metrics"), cohort)

    return per_participant


@router.get("/contests/{contest_id}/progressive-analytics/{user_id}")
async def progressive_analytics_detail(
    contest_id: str, user_id: str, db: Session = Depends(get_db), _: models.User = Depends(require_admin)
):
    contest = get_contest_or_404(db, contest_id)
    if contest.mode != "progressive":
        raise HTTPException(status_code=400, detail="This contest is not in progressive mode")

    chain_problems = [cp.problem for cp in contest.problems if cp.problem and cp.problem.is_progressive]
    chains = []
    for problem in chain_problems:
        analysis = await _analyze_participant_chain(db, contest.id, user_id, problem)
        metrics = analysis.pop("_metrics")
        analysis["behaviorScore"] = analytics_engine.compute_behavior_score(metrics, [metrics])
        # Drill-down: attach each stage's submitted code snapshots for review.
        for stage_view in analysis["stages"]:
            subs = db.scalars(select(models.Submission).where(
                models.Submission.contest_id == contest.id, models.Submission.user_id == user_id,
                models.Submission.stage_id == stage_view["stageId"],
            ).order_by(models.Submission.submitted_at)).all()
            stage_view["submissions"] = [
                {"id": s.id, "status": s.status, "submittedAt": s.submitted_at.isoformat(), "language": s.language}
                for s in subs
            ]
        chains.append(analysis)

    user = db.get(models.User, user_id)
    return {"userId": user_id, "userName": user.name if user else "Unknown", "chains": chains}
