from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

import models
from database import get_db
from deps import get_current_user

router = APIRouter(prefix="/api/me", tags=["profile"])


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _contest_status(contest: models.Contest) -> str:
    if contest.status in ("draft", "cancelled"):
        return contest.status
    now = _now()
    if now < contest.start_time:
        return "scheduled"
    if now > contest.end_time:
        return "completed"
    return "active"


def _rank_key(p: models.ContestParticipant):
    completion = p.completed_at or _now()
    duration = (completion - p.started_at).total_seconds() if p.started_at else float("inf")
    return (-p.score, -p.problems_solved, duration)


@router.get("/profile")
def my_profile(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    participations = db.scalars(select(models.ContestParticipant).where(
        models.ContestParticipant.user_id == user.id,
    )).all()

    # Only non-late submissions count towards scores, matching leaderboard behaviour.
    submissions = db.scalars(select(models.Submission).where(
        models.Submission.user_id == user.id,
    )).all()

    contests_out = []
    for p in participations:
        contest = db.get(models.Contest, p.contest_id)
        if not contest:
            continue

        peers = db.scalars(select(models.ContestParticipant).where(
            models.ContestParticipant.contest_id == contest.id,
        )).all()
        ranked = sorted(peers, key=_rank_key)
        rank = next((i for i, x in enumerate(ranked, start=1) if x.user_id == user.id), None)

        best_by_problem: dict[str, int] = {}
        for s in submissions:
            if s.contest_id != contest.id or s.is_late:
                continue
            best_by_problem[s.problem_id] = max(best_by_problem.get(s.problem_id, 0), s.score)

        problems = []
        for cp in sorted(contest.problems, key=lambda x: x.order):
            best = best_by_problem.get(cp.problem_id, 0)
            problems.append({
                "problemId": cp.problem_id,
                "title": cp.problem.title if cp.problem else None,
                "difficulty": cp.problem.difficulty if cp.problem else None,
                "maxScore": cp.max_score,
                "score": best,
                "solved": best >= cp.max_score and cp.max_score > 0,
                "attempted": cp.problem_id in best_by_problem,
            })

        contests_out.append({
            "contestId": contest.id,
            "name": contest.name,
            "slug": contest.slug,
            "status": _contest_status(contest),
            "startTime": contest.start_time.isoformat(),
            "endTime": contest.end_time.isoformat(),
            "leaderboardVisible": contest.leaderboard_visible,
            "participantStatus": p.status,
            "joinedAt": p.joined_at.isoformat() if p.joined_at else None,
            "startedAt": p.started_at.isoformat() if p.started_at else None,
            "completedAt": p.completed_at.isoformat() if p.completed_at else None,
            "score": p.score,
            "maxScore": sum(cp.max_score for cp in contest.problems),
            "problemsSolved": sum(1 for x in problems if x["solved"]),
            "totalProblems": len(contest.problems),
            "submissions": p.total_submissions,
            "rank": rank,
            "totalParticipants": len(ranked),
            "problems": problems,
        })

    contests_out.sort(key=lambda c: c["startTime"], reverse=True)

    return {
        "user": {"id": user.id, "name": user.name, "email": user.email, "role": user.role},
        "stats": {
            "contestsRegistered": len(contests_out),
            "contestsCompleted": sum(1 for c in contests_out if c["participantStatus"] in ("completed", "auto_completed")),
            "problemsSolved": sum(c["problemsSolved"] for c in contests_out),
            "totalScore": sum(c["score"] for c in contests_out),
            "totalSubmissions": len(submissions),
            "acceptedSubmissions": sum(1 for s in submissions if s.status == "ACCEPTED" and not s.is_late),
        },
        "contests": contests_out,
    }
