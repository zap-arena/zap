from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

import models
from database import get_db
from routers.contests import compute_status

router = APIRouter(prefix="/api/public", tags=["public"])


@router.get("/home")
def home_snapshot(db: Session = Depends(get_db)):
    contests = db.scalars(select(models.Contest)).all()
    active_or_scheduled = [c for c in contests if compute_status(c) in ("active", "scheduled")]
    active_or_scheduled.sort(key=lambda c: c.start_time)

    total_users = db.scalar(select(func.count(models.User.id))) or 0
    total_problems = db.scalar(select(func.count(models.Problem.id)).where(models.Problem.status == "active")) or 0
    total_contests = db.scalar(select(func.count(models.Contest.id))) or 0

    def contest_summary(c: models.Contest) -> dict:
        return {
            "id": c.id, "name": c.name, "slug": c.slug, "description": c.description,
            "status": compute_status(c), "duration": c.duration,
            "problemCount": len(c.problems), "maxScore": sum(cp.max_score for cp in c.problems),
        }

    # Only the problem count is exposed; the problem bank itself stays private.
    return {
        "contests": [contest_summary(c) for c in active_or_scheduled[:6]],
        "stats": {"totalUsers": total_users, "totalProblems": total_problems, "totalContests": total_contests},
    }
