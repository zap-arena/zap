"""Seed the database with test data.

Usage (from the repo root):
    api\\.venv\\Scripts\\python.exe api\\seed.py
    api\\.venv\\Scripts\\python.exe api\\seed.py --reset          # wipe seeded rows first
    api\\.venv\\Scripts\\python.exe api\\seed.py --no-submissions # skip fake submissions

Re-running without --reset is safe: everything is matched on a natural key
(email / slug / name) and updated instead of duplicated.
"""

import argparse
import io
import os
import sys
import zipfile
from datetime import datetime, timedelta, timezone
from pathlib import Path

from dotenv import load_dotenv

_API_DIR = os.path.dirname(os.path.abspath(__file__))
_ROOT_DIR = os.path.dirname(_API_DIR)
sys.path.insert(0, _API_DIR)

load_dotenv(os.path.join(_API_DIR, ".env"))
load_dotenv(os.path.join(_ROOT_DIR, ".env"))

import models  # noqa: E402
import problem_import  # noqa: E402
import security  # noqa: E402
from database import Base, SessionLocal, engine  # noqa: E402
from sqlalchemy import select  # noqa: E402

SEED_PASSWORD = "Test@12345"
PROBLEMS_DIR = Path(_ROOT_DIR) / "problems"

# The whole bank is imported, but a contest only gets this many problems so the
# seeded contests stay small as the bank grows.
PROBLEMS_PER_CONTEST = 3

SEED_USERS = [
    ("Seed Admin", "seed.admin@local.dev", "admin"),
    ("Aarav Sharma", "aarav@local.dev", "user"),
    ("Priya Nair", "priya@local.dev", "user"),
    ("Rahul Verma", "rahul@local.dev", "user"),
    ("Sneha Iyer", "sneha@local.dev", "user"),
]

# name -> (starts_in_hours, ends_in_hours) relative to now
SEED_CONTESTS = {
    "Seed Live Contest": (-1, 3),
    "Seed Upcoming Contest": (48, 72),
    "Seed Past Contest": (-72, -48),
}

# Per-contest, per-user fraction of each problem's max score.
SEED_RESULTS = {
    "Seed Past Contest": {
        "aarav@local.dev": [1.0, 1.0, 0.5],
        "priya@local.dev": [1.0, 0.4, 0.0],
        "rahul@local.dev": [0.6, 0.0, 0.0],
        "sneha@local.dev": [1.0, 1.0, 1.0],
    },
    "Seed Live Contest": {
        "aarav@local.dev": [1.0, 0.0, 0.0],
        "priya@local.dev": [0.5, 0.0, 0.0],
    },
}

SOURCE_STUB = "# seeded submission\nprint('seed')\n"


def now() -> datetime:
    return datetime.now(timezone.utc)


def zip_problems_dir() -> bytes:
    """Pack problems/ in memory so the real ZIP importer can validate it."""
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        for path in sorted(PROBLEMS_DIR.rglob("*")):
            if path.is_file():
                zf.write(path, path.relative_to(PROBLEMS_DIR).as_posix())
    return buffer.getvalue()


def seed_users(db) -> dict[str, models.User]:
    users: dict[str, models.User] = {}
    for name, email, role in SEED_USERS:
        user = db.scalar(select(models.User).where(models.User.email == email))
        if user is None:
            user = models.User(name=name, email=email, role=role,
                               password_hash=security.hash_password(SEED_PASSWORD))
            db.add(user)
        else:
            user.name, user.role = name, role
        users[email] = user
    db.flush()
    return users


def seed_problems(db, admin: models.User) -> list[models.Problem]:
    if not PROBLEMS_DIR.is_dir():
        print(f"  ! {PROBLEMS_DIR} not found - skipping problems")
        return []

    parsed = problem_import.parse_archive(zip_problems_dir())
    out = []
    for item in parsed:
        if not item["valid"]:
            print(f"  ! {item['slug']} invalid: {'; '.join(item['errors'])}")
            continue

        problem = db.scalar(select(models.Problem).where(models.Problem.slug == item["slug"]))
        if problem is None:
            problem = models.Problem(slug=item["slug"], created_by=admin.id)

        problem.title = item["title"]
        problem.difficulty = item["difficulty"]
        problem.description = item["description"]
        problem.input_format = item["inputFormat"]
        problem.output_format = item["outputFormat"]
        problem.constraints = item["constraints"]
        problem.examples = item["examples"]
        problem.tags = item["tags"]
        problem.languages = item["languages"]
        problem.boilerplates = item["boilerplates"]
        problem.time_limit = item["timeLimit"]
        problem.memory_limit = item["memoryLimit"]
        problem.max_score = item["maxScore"]
        problem.status = "active"

        # Flush only once every NOT NULL column is populated, so the id exists for the test cases.
        db.add(problem)
        db.flush()

        db.query(models.TestCase).filter(models.TestCase.problem_id == problem.id).delete()
        for order, tc in enumerate(item["testCases"]):
            db.add(models.TestCase(
                problem_id=problem.id, name=tc["name"], input=tc["input"],
                expected_output=tc["expectedOutput"], hidden=tc["hidden"],
                marks=tc["marks"], order=order,
            ))
        out.append(problem)

    db.flush()
    return out


def seed_contests(db, admin: models.User, problems: list[models.Problem]) -> dict[str, models.Contest]:
    contests: dict[str, models.Contest] = {}
    base = now()

    for name, (start_h, end_h) in SEED_CONTESTS.items():
        slug = name.lower().replace(" ", "-")
        contest = db.scalar(select(models.Contest).where(models.Contest.slug == slug))
        if contest is None:
            contest = models.Contest(slug=slug, created_by=admin.id)

        contest.name = name
        contest.description = f"Seeded contest for local testing ({name})."
        contest.instructions = (
            "This contest was generated by api/seed.py for testing.\n"
            "Solve as many problems as you can before the timer runs out."
        )
        contest.start_time = base + timedelta(hours=start_h)
        contest.end_time = base + timedelta(hours=end_h)
        contest.duration = 120
        contest.scoring_mode = "partial"
        contest.leaderboard_visible = True
        contest.status = "scheduled"

        # Flush only once every NOT NULL column is populated, so the id exists for the child rows.
        db.add(contest)
        db.flush()

        db.query(models.ContestProblem).filter(models.ContestProblem.contest_id == contest.id).delete()
        for order, problem in enumerate(problems[:PROBLEMS_PER_CONTEST]):
            db.add(models.ContestProblem(
                contest_id=contest.id, problem_id=problem.id, order=order, max_score=problem.max_score,
            ))

        db.query(models.ContestModerator).filter(models.ContestModerator.contest_id == contest.id).delete()
        db.add(models.ContestModerator(contest_id=contest.id, user_id=admin.id))

        contests[name] = contest

    db.flush()
    return contests


def seed_participation(db, contests, users, problems, with_submissions: bool) -> int:
    submissions_made = 0

    for contest_name, per_user in SEED_RESULTS.items():
        contest = contests.get(contest_name)
        if contest is None:
            continue
        finished = contest.end_time < now()

        for email, fractions in per_user.items():
            user = users[email]
            participant = db.scalar(select(models.ContestParticipant).where(
                models.ContestParticipant.contest_id == contest.id,
                models.ContestParticipant.user_id == user.id,
            ))
            if participant is None:
                participant = models.ContestParticipant(contest_id=contest.id, user_id=user.id)
                db.add(participant)
                db.flush()

            started = contest.start_time + timedelta(minutes=5)
            participant.joined_at = started
            participant.started_at = started
            participant.expires_at = min(started + timedelta(minutes=contest.duration), contest.end_time)
            participant.completed_at = started + timedelta(minutes=45) if finished else None
            participant.status = "completed" if finished else "in_progress"

            # Rebuild this participant's submissions so re-runs stay consistent.
            db.query(models.Submission).filter(
                models.Submission.contest_id == contest.id,
                models.Submission.user_id == user.id,
            ).delete()

            total_score = 0
            solved = 0
            for index, problem in enumerate(problems[:PROBLEMS_PER_CONTEST]):
                fraction = fractions[index] if index < len(fractions) else 0.0
                if fraction <= 0 or not with_submissions:
                    continue

                score = int(round(problem.max_score * fraction))
                passed = max(1, int(round(len(problem.test_cases) * fraction)))
                status = "ACCEPTED" if fraction >= 1.0 else "WRONG_ANSWER"

                db.add(models.Submission(
                    contest_id=contest.id, problem_id=problem.id, user_id=user.id,
                    language="python", source_code=SOURCE_STUB, status=status,
                    passed_tests=passed, total_tests=len(problem.test_cases),
                    score=score, execution_time=0.42, is_late=False,
                    submitted_at=started + timedelta(minutes=10 * (index + 1)),
                ))
                submissions_made += 1
                total_score += score
                if fraction >= 1.0:
                    solved += 1

            participant.score = total_score
            participant.problems_solved = solved
            participant.total_submissions = sum(1 for f in fractions if f > 0) if with_submissions else 0

    db.flush()
    return submissions_made


def reset(db) -> None:
    """Remove only rows this script created."""
    slugs = [name.lower().replace(" ", "-") for name in SEED_CONTESTS]
    contest_ids = list(db.scalars(select(models.Contest.id).where(models.Contest.slug.in_(slugs))).all())
    if contest_ids:
        for model in (models.Submission, models.ContestActivityLog, models.CodeDraft,
                      models.ContestParticipant, models.ContestProblem, models.ContestModerator):
            db.query(model).filter(model.contest_id.in_(contest_ids)).delete(synchronize_session=False)
        db.query(models.Contest).filter(models.Contest.id.in_(contest_ids)).delete(synchronize_session=False)

    emails = [email for _, email, _ in SEED_USERS]
    user_ids = list(db.scalars(select(models.User.id).where(models.User.email.in_(emails))).all())
    if user_ids:
        for model in (models.Submission, models.ExecutionLog, models.ContestActivityLog,
                      models.CodeDraft, models.ContestParticipant):
            db.query(model).filter(model.user_id.in_(user_ids)).delete(synchronize_session=False)
        db.query(models.User).filter(models.User.id.in_(user_ids)).delete(synchronize_session=False)

    db.commit()
    print(f"reset: removed {len(contest_ids)} contest(s) and {len(user_ids)} user(s)")


def main() -> int:
    parser = argparse.ArgumentParser(description="Seed the CodeArena database with test data.")
    parser.add_argument("--reset", action="store_true", help="delete previously seeded rows first")
    parser.add_argument("--no-submissions", action="store_true", help="skip generating fake submissions")
    args = parser.parse_args()

    if engine is None or SessionLocal is None:
        print("DATABASE_URL is not configured - set it in .env")
        return 1

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if args.reset:
            reset(db)

        users = seed_users(db)
        admin = users["seed.admin@local.dev"]
        problems = seed_problems(db, admin)
        contests = seed_contests(db, admin, problems)
        submissions = seed_participation(db, contests, users, problems, not args.no_submissions)
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

    print(f"users     : {len(users)} (password: {SEED_PASSWORD})")
    print(f"problems  : {len(problems)} imported ({min(len(problems), PROBLEMS_PER_CONTEST)} attached per contest)")
    print(f"contests  : {len(contests)} -> {', '.join(contests)}")
    print(f"submissions: {submissions}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
