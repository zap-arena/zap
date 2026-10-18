---
name: fastapi-backend
description: >-
  Use this skill when developing, testing, or updating FastAPI backend routes,
  SQLAlchemy models, database migrations, or Piston execution judging in api/.
---

# FastAPI Backend & Judge Workflow Guide

Use this skill when writing Python backend code in `api/`.

## Architecture & Conventions

- **Entrypoint**: `api/index.py`
- **Route Modules**: `api/routers/*.py` (e.g. `auth.py`, `contests.py`, `problems.py`, `submissions.py`, `execute.py`).
- **ORM Models**: `api/models.py` (SQLAlchemy declarative models).
- **Schemas**: `api/schemas.py` (Pydantic validation models).
- **Serializers**: `api/serializers.py` (translates Python `snake_case` models into frontend `camelCase` JSON).
- **Execution Judge**: `api/piston_service.py` (outbound HTTP to Piston remote code executor).

## Critical Rules:

1. **Full API Paths**:
   FastAPI routes must be declared with their **full** `/api/...` path:
   ```python
   @router.get("/api/contests", response_model=List[ContestSummary])
   def list_contests(...):
   ```
   Do not rely on router prefix stripping, as Vercel production rewrites and Next.js dev rewrites (`next.config.ts`) expect `/api/...` verbatim.

2. **Naming Convention Boundary**:
   - Python & Postgres: `snake_case` (e.g. `start_time`, `contest_id`).
   - JSON payloads to/from frontend: `camelCase` (e.g. `startTime`, `contestId`).
   - Use `schemas.py` and `serializers.py` to handle the conversion.

3. **Database Relationships & Flushes**:
   When creating parent/child records (e.g. `Contest` and its `ContestProblem` entries), always `db.add(parent)` and `db.flush()` first to materialize the primary key before attaching children.

4. **Running Locally**:
   ```bash
   cd api
   source .venv/bin/activate
   uvicorn index:app --reload --port 8000
   ```
