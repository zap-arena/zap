from typing import Optional
import re
import time
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

import models
import schemas
from database import get_db
from deps import get_current_user, require_admin
from serializers import serialize_contest, serialize_problem, serialize_submission, serialize_participant

router = APIRouter(tags=["contests"])


def slugify(name: str) -> str:
    base = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-") or "contest"
    return f"{base}-{int(time.time() * 1000) % 100000}"


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def compute_status(contest: models.Contest) -> str:
    if contest.status in ("draft", "cancelled"):
        return contest.status
    now = now_utc()
    if now < contest.start_time:
        return "scheduled"
    if now > contest.end_time:
        return "completed"
    return "active"


def get_contest_or_404(db: Session, contest_id_or_slug: str) -> models.Contest:
    contest = db.get(models.Contest, contest_id_or_slug) or db.scalar(
        select(models.Contest).where(models.Contest.slug == contest_id_or_slug)
    )
    if not contest:
        raise HTTPException(status_code=404, detail="Contest not found")
    return contest


def get_participant(db: Session, contest_id: str, user_id: str) -> Optional[models.ContestParticipant]:
    return db.scalar(
        select(models.ContestParticipant).where(
            models.ContestParticipant.contest_id == contest_id,
            models.ContestParticipant.user_id == user_id,
        )
    )


# ---------- Public / participant ----------
@router.get("/api/contests")
def list_public_contests(db: Session = Depends(get_db)):
    contests = db.scalars(select(models.Contest)).all()
    visible = [c for c in contests if c.status in ("active", "scheduled", "completed")]
    return [serialize_contest(c, include_problems=False) | {"status": compute_status(c)} for c in visible]


@router.get("/api/contests/{slug}")
def get_contest(slug: str, db: Session = Depends(get_db)):
    contest = get_contest_or_404(db, slug)
    if contest.status == "draft":
        raise HTTPException(status_code=404, detail="Contest not found")
    # Problem list stays hidden until the attempt starts.
    return serialize_contest(contest, include_problems=False) | {"status": compute_status(contest)}


COMPLETED_STATUSES = ("completed", "auto_completed")


@router.post("/api/contests/{contest_id}/start")
def start_contest(contest_id: str, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    contest = get_contest_or_404(db, contest_id)
    participant = get_participant(db, contest.id, user.id)

    # One attempt per candidate: finishing is final, even while the contest is still open.
    if participant and participant.status in COMPLETED_STATUSES:
        raise HTTPException(
            status_code=409,
            detail=(
                f"You have already completed this contest. "
                f"Your score was {participant.score} point(s) with {participant.problems_solved} problem(s) solved. "
                f"Only one attempt is allowed."
            ),
        )

    status = compute_status(contest)
    if status == "scheduled":
        raise HTTPException(
            status_code=403,
            detail=f"This contest opens at {contest.start_time.isoformat()}",
        )
    if status == "completed":
        raise HTTPException(
            status_code=403,
            detail=f"This contest closed at {contest.end_time.isoformat()}",
        )
    if status != "active":
        raise HTTPException(status_code=400, detail=f"Contest is not active ({status})")

    now = now_utc()
    if participant is None:
        expires = min(now.timestamp() + contest.duration * 60, contest.end_time.timestamp())
        participant = models.ContestParticipant(
            contest_id=contest.id, user_id=user.id, started_at=now,
            expires_at=datetime.fromtimestamp(expires, tz=timezone.utc), status="in_progress",
        )
        db.add(participant)
        db.add(models.ContestActivityLog(contest_id=contest.id, user_id=user.id, event_type="CONTEST_STARTED"))
        db.commit()
        db.refresh(participant)
    else:
        # Resuming after a logout or refresh: the original timer keeps running.
        db.add(models.ContestActivityLog(contest_id=contest.id, user_id=user.id, event_type="CONTEST_RESUMED"))
        db.commit()
    return serialize_participant(participant)


@router.get("/api/contests/{contest_id}/session")
def get_session(contest_id: str, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    contest = get_contest_or_404(db, contest_id)
    participant = get_participant(db, contest.id, user.id)
    if not participant:
        return {"started": False}

    if participant.status == "in_progress" and participant.expires_at and now_utc() > participant.expires_at:
        participant.status = "auto_completed"
        participant.completed_at = now_utc()
        db.commit()

    return {"started": True, **serialize_participant(participant)}


@router.post("/api/contests/{contest_id}/finish")
def finish_contest(contest_id: str, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    contest = get_contest_or_404(db, contest_id)
    participant = get_participant(db, contest.id, user.id)
    if not participant or participant.status not in ("in_progress",):
        raise HTTPException(status_code=400, detail="No active contest attempt to finish")
    participant.status = "completed"
    participant.completed_at = now_utc()
    db.add(models.ContestActivityLog(contest_id=contest.id, user_id=user.id, event_type="CONTEST_FINISHED"))
    db.commit()
    return serialize_participant(participant)


def _require_started(db: Session, contest_id: str, user_id: str) -> models.ContestParticipant:
    participant = get_participant(db, contest_id, user_id)
    if not participant or participant.status not in ("in_progress",):
        raise HTTPException(status_code=403, detail="You have not started this contest")
    if participant.expires_at and now_utc() > participant.expires_at:
        participant.status = "auto_completed"
        participant.completed_at = now_utc()
        db.commit()
        raise HTTPException(status_code=403, detail="Contest time has expired")
    return participant


@router.get("/api/contests/{contest_id}/problems")
def contest_problems(contest_id: str, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    contest = get_contest_or_404(db, contest_id)
    _require_started(db, contest.id, user.id)
    return [
        serialize_problem(cp.problem, include_hidden=False) | {"maxScore": cp.max_score, "order": cp.order}
        for cp in sorted(contest.problems, key=lambda x: x.order)
    ]


@router.put("/api/contests/{contest_id}/problems/{problem_id}/draft")
def save_draft(contest_id: str, problem_id: str, payload: schemas.DraftIn, db: Session = Depends(get_db),
               user: models.User = Depends(get_current_user)):
    contest = get_contest_or_404(db, contest_id)
    _require_started(db, contest.id, user.id)

    draft = db.scalar(select(models.CodeDraft).where(
        models.CodeDraft.contest_id == contest.id, models.CodeDraft.problem_id == problem_id,
        models.CodeDraft.user_id == user.id,
    ))
    if draft is None:
        draft = models.CodeDraft(contest_id=contest.id, problem_id=problem_id, user_id=user.id,
                                  language=payload.language, source_code=payload.sourceCode)
        db.add(draft)
    else:
        draft.language = payload.language
        draft.source_code = payload.sourceCode
    db.commit()
    return {"ok": True, "updatedAt": now_utc().isoformat()}


@router.get("/api/contests/{contest_id}/problems/{problem_id}/draft")
def get_draft(contest_id: str, problem_id: str, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    draft = db.scalar(select(models.CodeDraft).where(
        models.CodeDraft.contest_id == contest_id, models.CodeDraft.problem_id == problem_id,
        models.CodeDraft.user_id == user.id,
    ))
    if not draft:
        return None
    return {"language": draft.language, "sourceCode": draft.source_code, "updatedAt": draft.updated_at.isoformat()}


@router.get("/api/contests/{contest_id}/my-submissions")
def my_submissions(contest_id: str, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    subs = db.scalars(select(models.Submission).where(
        models.Submission.contest_id == contest_id, models.Submission.user_id == user.id,
    ).order_by(models.Submission.submitted_at.desc())).all()
    out = []
    for s in subs:
        problem = db.get(models.Problem, s.problem_id)
        out.append(serialize_submission(s, problem.title if problem else None))
    return out


@router.post("/api/contests/{contest_id}/activity", status_code=202)
def record_activity(contest_id: str, payload: schemas.ProctorBatchIn, db: Session = Depends(get_db),
                    user: models.User = Depends(get_current_user)):
    """Ingest a batch of proctoring events. Only accepted while the attempt is in progress."""
    contest = get_contest_or_404(db, contest_id)
    participant = get_participant(db, contest.id, user.id)
    if not participant or participant.status != "in_progress":
        raise HTTPException(status_code=403, detail="No active contest attempt")

    incoming = {e.clientEventId: e for e in payload.events}
    already = set(db.scalars(select(models.ContestActivityLog.client_event_id).where(
        models.ContestActivityLog.user_id == user.id,
        models.ContestActivityLog.client_event_id.in_(list(incoming)),
    )).all())

    stored = 0
    for client_event_id, event in incoming.items():
        if client_event_id in already:
            continue
        db.add(models.ContestActivityLog(
            contest_id=contest.id, user_id=user.id, problem_id=event.problemId,
            event_type=event.type, event_metadata=event.metadata,
            client_event_id=client_event_id, occurred_at=event.occurredAt,
        ))
        stored += 1

    db.commit()
    return {"received": len(payload.events), "stored": stored, "duplicates": len(payload.events) - stored}


@router.get("/api/contests/{contest_id}/notifications")
def my_notifications(contest_id: str, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    contest = get_contest_or_404(db, contest_id)
    if not get_participant(db, contest.id, user.id):
        raise HTTPException(status_code=403, detail="You have not joined this contest")
    rows = db.scalars(select(models.ContestNotification).where(
        models.ContestNotification.contest_id == contest.id,
    ).order_by(models.ContestNotification.created_at.desc())).all()
    return [{"id": n.id, "message": n.message, "createdAt": n.created_at.isoformat()} for n in rows]


@router.get("/api/contests/{contest_id}/leaderboard")
def leaderboard(contest_id: str, db: Session = Depends(get_db)):
    contest = get_contest_or_404(db, contest_id)
    if not contest.leaderboard_visible:
        raise HTTPException(status_code=403, detail="Leaderboard is not visible for this contest")

    participants = db.scalars(select(models.ContestParticipant).where(
        models.ContestParticipant.contest_id == contest.id,
    )).all()

    def sort_key(p: models.ContestParticipant):
        completion = (p.completed_at or now_utc())
        duration = (completion - p.started_at).total_seconds() if p.started_at else float("inf")
        return (-p.score, -p.problems_solved, duration)

    ranked = sorted(participants, key=sort_key)
    total_problems = len(contest.problems)
    entries = []
    for rank, p in enumerate(ranked, start=1):
        user = db.get(models.User, p.user_id)
        duration_s = int((p.completed_at - p.started_at).total_seconds()) if p.started_at and p.completed_at else None
        entries.append({
            "rank": rank, "userId": p.user_id, "userName": user.name if user else "Unknown",
            "score": p.score, "solved": p.problems_solved, "totalProblems": total_problems,
            "submissions": p.total_submissions,
            "completionTime": f"{duration_s // 60}m" if duration_s is not None else "-",
        })
    return entries


# ---------- Admin CRUD ----------
@router.get("/api/admin/contests")
def admin_list_contests(db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    contests = db.scalars(select(models.Contest)).all()
    return [serialize_contest(c) | {"status": compute_status(c)} for c in contests]


@router.get("/api/admin/contests/{contest_id}")
def admin_get_contest(contest_id: str, db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    contest = get_contest_or_404(db, contest_id)
    return serialize_contest(contest) | {"status": compute_status(contest)}


def _apply_contest_fields(contest: models.Contest, payload: schemas.ContestIn, db: Session):
    problem_ids = [cp.problemId for cp in payload.problems]
    if len(set(problem_ids)) != len(problem_ids):
        raise HTTPException(status_code=400, detail="The same problem was added to the contest more than once")
    known = set(db.scalars(select(models.Problem.id).where(models.Problem.id.in_(problem_ids))).all())
    missing = [pid for pid in problem_ids if pid not in known]
    if missing:
        raise HTTPException(status_code=400, detail=f"Unknown problem id(s): {', '.join(missing)}")

    moderator_ids = list(dict.fromkeys(payload.moderatorIds))
    if moderator_ids:
        admins = set(db.scalars(select(models.User.id).where(
            models.User.id.in_(moderator_ids), models.User.role == "admin",
        )).all())
        not_admins = [uid for uid in moderator_ids if uid not in admins]
        if not_admins:
            raise HTTPException(status_code=400, detail="Moderators must be existing admin users")

    contest.name = payload.name.strip()
    contest.description = payload.description
    contest.instructions = payload.instructions
    contest.start_time = payload.startTime
    contest.end_time = payload.endTime
    contest.duration = payload.duration
    contest.scoring_mode = payload.scoringMode
    contest.leaderboard_visible = payload.leaderboardVisible

    db.add(contest)
    db.flush()  # assigns contest.id before the child rows reference it

    db.query(models.ContestProblem).filter(models.ContestProblem.contest_id == contest.id).delete()
    for order, cp in enumerate(payload.problems):
        db.add(models.ContestProblem(contest_id=contest.id, problem_id=cp.problemId, order=order, max_score=cp.maxScore))

    db.query(models.ContestModerator).filter(models.ContestModerator.contest_id == contest.id).delete()
    for uid in moderator_ids:
        db.add(models.ContestModerator(contest_id=contest.id, user_id=uid))


@router.post("/api/admin/contests", status_code=201)
def create_contest(payload: schemas.ContestIn, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    contest = models.Contest(slug=slugify(payload.name), created_by=admin.id, status="draft")
    _apply_contest_fields(contest, payload, db)
    db.commit()
    db.refresh(contest)
    return serialize_contest(contest) | {"status": compute_status(contest)}


@router.put("/api/admin/contests/{contest_id}")
def update_contest(contest_id: str, payload: schemas.ContestIn, db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    contest = get_contest_or_404(db, contest_id)
    _apply_contest_fields(contest, payload, db)
    db.commit()
    db.refresh(contest)
    return serialize_contest(contest) | {"status": compute_status(contest)}


@router.delete("/api/admin/contests/{contest_id}", status_code=204)
def delete_contest(contest_id: str, db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    contest = get_contest_or_404(db, contest_id)
    contest.status = "cancelled"
    db.commit()
    return None


@router.post("/api/admin/contests/{contest_id}/publish")
def publish_contest(contest_id: str, db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    contest = get_contest_or_404(db, contest_id)
    contest.status = "scheduled"
    db.commit()
    return serialize_contest(contest) | {"status": compute_status(contest)}


@router.get("/api/admin/contests/{contest_id}/participants")
def admin_participants(contest_id: str, db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    contest = get_contest_or_404(db, contest_id)
    participants = db.scalars(select(models.ContestParticipant).where(
        models.ContestParticipant.contest_id == contest.id,
    )).all()
    out = []
    for p in participants:
        user = db.get(models.User, p.user_id)
        out.append(serialize_participant(p, user))
    return out


@router.get("/api/admin/contests/{contest_id}/participants/{user_id}")
def admin_participant_detail(contest_id: str, user_id: str, db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    contest = get_contest_or_404(db, contest_id)
    participant = get_participant(db, contest.id, user_id)
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
    user = db.get(models.User, user_id)
    subs = db.scalars(select(models.Submission).where(
        models.Submission.contest_id == contest.id, models.Submission.user_id == user_id,
    ).order_by(models.Submission.submitted_at.desc())).all()
    submissions = []
    for s in subs:
        problem = db.get(models.Problem, s.problem_id)
        submissions.append(serialize_submission(s, problem.title if problem else None))
    return {"participant": serialize_participant(participant, user), "submissions": submissions}


@router.get("/api/admin/contests/{contest_id}/results")
def admin_results(contest_id: str, db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    return leaderboard(contest_id, db)


@router.get("/api/admin/contests/{contest_id}/activity")
def admin_activity(contest_id: str, userId: Optional[str] = None, limit: int = 500,
                   db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    """Proctoring trail for a contest, newest first."""
    contest = get_contest_or_404(db, contest_id)
    stmt = select(models.ContestActivityLog).where(models.ContestActivityLog.contest_id == contest.id)
    if userId:
        stmt = stmt.where(models.ContestActivityLog.user_id == userId)
    stmt = stmt.order_by(models.ContestActivityLog.created_at.desc()).limit(max(1, min(limit, 2000)))

    rows = db.scalars(stmt).all()
    users = {u.id: u for u in db.scalars(select(models.User).where(
        models.User.id.in_({r.user_id for r in rows if r.user_id}),
    )).all()}
    return [
        {
            "id": r.id, "userId": r.user_id,
            "userName": users[r.user_id].name if r.user_id in users else None,
            "eventType": r.event_type, "problemId": r.problem_id,
            "metadata": r.event_metadata or {},
            "occurredAt": (r.occurred_at or r.created_at).isoformat(),
        }
        for r in rows
    ]


@router.get("/api/admin/contests/{contest_id}/activity/summary")
def admin_activity_summary(contest_id: str, db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    """Per-participant counts of each proctoring event type."""
    contest = get_contest_or_404(db, contest_id)
    rows = db.execute(
        select(models.ContestActivityLog.user_id, models.ContestActivityLog.event_type, func.count())
        .where(models.ContestActivityLog.contest_id == contest.id)
        .group_by(models.ContestActivityLog.user_id, models.ContestActivityLog.event_type)
    ).all()

    users = {u.id: u for u in db.scalars(select(models.User).where(
        models.User.id.in_({r[0] for r in rows if r[0]}),
    )).all()}

    summary: dict[str, dict] = {}
    for user_id, event_type, count in rows:
        entry = summary.setdefault(user_id, {
            "userId": user_id,
            "userName": users[user_id].name if user_id in users else None,
            "events": {}, "total": 0,
        })
        entry["events"][event_type] = count
        entry["total"] += count
    return sorted(summary.values(), key=lambda e: -e["total"])


@router.get("/api/admin/contests/{contest_id}/notifications")
def admin_list_notifications(contest_id: str, db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    contest = get_contest_or_404(db, contest_id)
    rows = db.scalars(select(models.ContestNotification).where(
        models.ContestNotification.contest_id == contest.id,
    ).order_by(models.ContestNotification.created_at.desc())).all()
    return [{"id": n.id, "message": n.message, "createdAt": n.created_at.isoformat()} for n in rows]


@router.post("/api/admin/contests/{contest_id}/notifications", status_code=201)
def admin_create_notification(contest_id: str, payload: schemas.NotificationIn, db: Session = Depends(get_db),
                              admin: models.User = Depends(require_admin)):
    contest = get_contest_or_404(db, contest_id)
    notification = models.ContestNotification(
        contest_id=contest.id, message=payload.message.strip(), created_by=admin.id,
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)

    recipients = db.scalar(select(func.count()).select_from(models.ContestParticipant).where(
        models.ContestParticipant.contest_id == contest.id,
    ))
    return {
        "id": notification.id, "message": notification.message,
        "createdAt": notification.created_at.isoformat(), "recipients": recipients or 0,
    }


@router.delete("/api/admin/contests/{contest_id}/notifications/{notification_id}", status_code=204)
def admin_delete_notification(contest_id: str, notification_id: str, db: Session = Depends(get_db),
                              _: models.User = Depends(require_admin)):
    notification = db.get(models.ContestNotification, notification_id)
    if not notification or notification.contest_id != contest_id:
        raise HTTPException(status_code=404, detail="Notification not found")
    db.delete(notification)
    db.commit()
    return None
