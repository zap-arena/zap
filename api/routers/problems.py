import re
import time

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

import models
import problem_import
import schemas
from database import get_db
from deps import require_admin
from serializers import serialize_problem

router = APIRouter(tags=["problems"])


def slugify(title: str) -> str:
    base = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-") or "problem"
    return f"{base}-{int(time.time() * 1000) % 100000}"


# Problems are only reachable inside a contest, so there are no public problem routes.
# Participants read them via /api/contests/{id}/problems once their attempt has started.


# ---------- Admin CRUD ----------
@router.get("/api/admin/problems/search")
def admin_search_problems(
    q: str = "",
    difficulty: str | None = None,
    status: str = "active",
    limit: int = 20,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin),
):
    stmt = select(models.Problem)
    if status != "all":
        stmt = stmt.where(models.Problem.status == status)
    if difficulty:
        stmt = stmt.where(models.Problem.difficulty == difficulty)
    term = q.strip()
    if term:
        # Escape LIKE wildcards so user input cannot broaden the match.
        escaped = term.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
        pattern = f"%{escaped}%"
        stmt = stmt.where(or_(
            models.Problem.title.ilike(pattern, escape="\\"),
            models.Problem.slug.ilike(pattern, escape="\\"),
        ))
    stmt = stmt.order_by(models.Problem.title).limit(max(1, min(limit, 100)))

    return [
        {
            "id": p.id, "title": p.title, "slug": p.slug, "difficulty": p.difficulty,
            "tags": p.tags, "maxScore": p.max_score, "status": p.status,
            "testCasesCount": len(p.test_cases),
        }
        for p in db.scalars(stmt).all()
    ]


@router.get("/api/admin/problems")
def admin_list_problems(db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    problems = db.scalars(select(models.Problem)).all()
    return [serialize_problem(p, include_hidden=True) for p in problems]


@router.get("/api/admin/problems/{problem_id}")
def admin_get_problem(problem_id: str, db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    problem = db.get(models.Problem, problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    return serialize_problem(problem, include_hidden=True)


def _apply_problem_fields(problem: models.Problem, payload: schemas.ProblemIn, db: Session):
    problem.title = payload.title.strip()
    problem.difficulty = payload.difficulty
    problem.description = payload.description
    problem.input_format = payload.inputFormat
    problem.output_format = payload.outputFormat
    problem.constraints = payload.constraints
    problem.examples = [e.model_dump() for e in payload.examples]
    problem.tags = payload.tags
    problem.languages = payload.languages
    problem.boilerplates = payload.boilerplates
    problem.time_limit = payload.timeLimit
    problem.memory_limit = payload.memoryLimit
    problem.max_score = payload.maxScore
    problem.status = payload.status

    db.add(problem)
    db.flush()  # assigns problem.id before the test case rows reference it

    db.query(models.TestCase).filter(models.TestCase.problem_id == problem.id).delete()
    for i, tc in enumerate(payload.testCases):
        db.add(models.TestCase(
            problem_id=problem.id, name=tc.name, input=tc.input, expected_output=tc.expectedOutput,
            hidden=tc.hidden, marks=tc.marks, order=i,
        ))


@router.post("/api/admin/problems", status_code=201)
def create_problem(payload: schemas.ProblemIn, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    problem = models.Problem(slug=slugify(payload.title), created_by=admin.id)
    _apply_problem_fields(problem, payload, db)
    db.commit()
    db.refresh(problem)
    return serialize_problem(problem, include_hidden=True)


@router.put("/api/admin/problems/{problem_id}")
def update_problem(problem_id: str, payload: schemas.ProblemIn, db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    problem = db.get(models.Problem, problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    _apply_problem_fields(problem, payload, db)
    db.commit()
    db.refresh(problem)
    return serialize_problem(problem, include_hidden=True)


@router.delete("/api/admin/problems/{problem_id}", status_code=204)
def delete_problem(problem_id: str, db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    problem = db.get(models.Problem, problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    problem.status = "archived"
    db.commit()
    return None


@router.post("/api/admin/problems/import", status_code=201)
def import_problem(payload: schemas.ProblemIn, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    return create_problem(payload, db, admin)


def _summary(parsed: dict, extra_errors: list[str] | None = None) -> dict:
    errors = parsed["errors"] + (extra_errors or [])
    return {
        "slug": parsed["slug"],
        "title": parsed["title"],
        "difficulty": parsed["difficulty"],
        "timeLimit": parsed["timeLimit"],
        "memoryLimit": parsed["memoryLimit"],
        "languages": parsed["languages"],
        "tags": parsed["tags"],
        "testCasesCount": parsed["testCasesCount"],
        "boilerplatesCount": parsed["boilerplatesCount"],
        "valid": not errors,
        "errors": errors,
    }


@router.post("/api/admin/problems/import-zip")
async def import_problems_zip(
    file: UploadFile = File(...),
    slugs: str = Form(""),
    dry_run: bool = Form(False),
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    data = await file.read()
    try:
        parsed_problems = problem_import.parse_archive(data)
    except problem_import.ImportError_ as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    wanted = {s.strip() for s in slugs.split(",") if s.strip()}
    existing = {
        s for s in db.scalars(
            select(models.Problem.slug).where(models.Problem.slug.in_([p["slug"] for p in parsed_problems]))
        ).all()
    }

    results: list[dict] = []
    imported = 0
    for parsed in parsed_problems:
        conflict = ["A problem with this slug already exists"] if parsed["slug"] in existing else []
        summary = _summary(parsed, conflict)
        selected = not wanted or parsed["slug"] in wanted

        if not dry_run and selected and summary["valid"]:
            problem = models.Problem(
                slug=parsed["slug"],
                title=parsed["title"],
                difficulty=parsed["difficulty"],
                description=parsed["description"],
                input_format=parsed["inputFormat"],
                output_format=parsed["outputFormat"],
                constraints=parsed["constraints"],
                examples=parsed["examples"],
                tags=parsed["tags"],
                languages=parsed["languages"],
                boilerplates=parsed["boilerplates"],
                time_limit=parsed["timeLimit"],
                memory_limit=parsed["memoryLimit"],
                max_score=parsed["maxScore"],
                status=parsed["status"],
                created_by=admin.id,
            )
            db.add(problem)
            db.flush()
            for order, tc in enumerate(parsed["testCases"]):
                db.add(models.TestCase(
                    problem_id=problem.id, name=tc["name"], input=tc["input"],
                    expected_output=tc["expectedOutput"], hidden=tc["hidden"],
                    marks=tc["marks"], order=order,
                ))
            imported += 1
            summary["imported"] = True

        results.append(summary)

    if dry_run:
        db.rollback()
    else:
        db.commit()

    return {"problems": results, "imported": imported, "dryRun": dry_run}
