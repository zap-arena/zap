import os
import sys

from dotenv import load_dotenv

_API_DIR = os.path.dirname(os.path.abspath(__file__))

# Vercel loads this file with the project root as cwd, so api/ is not on sys.path there.
sys.path.insert(0, _API_DIR)

# Must run before importing modules that read env vars at import time (e.g. database, security).
# Real deployments supply these via the platform; load_dotenv never overrides existing vars.
load_dotenv(os.path.join(_API_DIR, ".env"))
load_dotenv(os.path.join(os.path.dirname(_API_DIR), ".env"))

from fastapi import FastAPI, Request  # noqa: E402
from fastapi.middleware.cors import CORSMiddleware  # noqa: E402
from fastapi.responses import JSONResponse  # noqa: E402
from starlette.concurrency import run_in_threadpool  # noqa: E402

from database import Base, SessionLocal, engine  # noqa: E402
import models  # noqa: E402,F401 - ensures models are registered with Base metadata
import piston_service  # noqa: E402
import rate_limit as rate_limit_store  # noqa: E402
import security  # noqa: E402
from routers import admin, auth, contests, problems, profile, public, submissions  # noqa: E402

app = FastAPI(title="CodeArena API")

cors_origins = [o.strip() for o in os.getenv("CORS_ORIGINS", "*").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

# Endpoints that hand work to the judge; everything else is cheap enough to leave open.
_RATE_LIMITED_PREFIXES = ("/api/code/run", "/api/submissions")


def _rate_limit_identity(request: Request) -> str:
    """Prefer the authenticated user so a limit cannot be dodged by re-logging in."""
    header = request.headers.get("authorization", "")
    if header.startswith("Bearer "):
        try:
            payload = security.decode_access_token(header[7:])
            if payload.get("sub"):
                return f"user:{payload['sub']}"
        except Exception:  # noqa: BLE001 - unauthenticated requests fall back to the client address
            pass
    return f"ip:{request.client.host if request.client else 'anon'}"


@app.middleware("http")
async def rate_limit(request: Request, call_next):
    if request.url.path.startswith(_RATE_LIMITED_PREFIXES) and request.method == "POST":
        identity = _rate_limit_identity(request)
        # The limiter store is synchronous, so keep it off the event loop.
        result = await run_in_threadpool(rate_limit_store.check, identity, "execute")
        if not result.allowed:
            return JSONResponse(
                status_code=429,
                content={"detail": "Too many requests, please slow down"},
                headers={"Retry-After": str(result.retry_after)},
            )
    return await call_next(request)


@app.on_event("startup")
def on_startup():
    if engine is not None:
        Base.metadata.create_all(bind=engine)
        _auto_migrate_schema(engine)
        _ensure_bootstrap_admin()


def _auto_migrate_schema(engine):
    """Automatically adds missing columns to existing tables so we don't have to use alembic or drop tables."""
    from sqlalchemy import inspect, text
    inspector = inspect(engine)
    
    with engine.begin() as conn:
        # Check 'problems' table
        if inspector.has_table("problems"):
            columns = [col["name"] for col in inspector.get_columns("problems")]
            if "type" not in columns:
                conn.execute(text("ALTER TABLE problems ADD COLUMN type VARCHAR(20) NOT NULL DEFAULT 'coding'"))
            if "debugging_data" not in columns:
                conn.execute(text("ALTER TABLE problems ADD COLUMN debugging_data JSON"))
            if "is_progressive" not in columns:
                conn.execute(text("ALTER TABLE problems ADD COLUMN is_progressive BOOLEAN NOT NULL DEFAULT FALSE"))
                
        # Check 'contests' table
        if inspector.has_table("contests"):
            columns = [col["name"] for col in inspector.get_columns("contests")]
            if "mode" not in columns:
                conn.execute(text('ALTER TABLE contests ADD COLUMN "mode" VARCHAR(20) NOT NULL DEFAULT \'standard\''))
                
        # Check 'test_cases' table
        if inspector.has_table("test_cases"):
            columns = [col["name"] for col in inspector.get_columns("test_cases")]
            if "stage_id" not in columns:
                # problem_stages will already be created by create_all()
                conn.execute(text("ALTER TABLE test_cases ADD COLUMN stage_id VARCHAR(32) REFERENCES problem_stages(id) ON DELETE CASCADE"))

def _ensure_bootstrap_admin():
    admin_email = os.getenv("ADMIN_EMAIL")
    admin_password = os.getenv("ADMIN_PASSWORD")
    if not admin_email or not admin_password or SessionLocal is None:
        return
    db = SessionLocal()
    try:
        existing = db.query(models.User).filter(models.User.email == admin_email.lower()).first()
        if existing is None:
            db.add(models.User(
                name="Administrator", email=admin_email.lower(),
                password_hash=security.hash_password(admin_password), role="admin",
            ))
            db.commit()
    finally:
        db.close()


app.include_router(auth.router)
app.include_router(problems.router)
app.include_router(contests.router)
app.include_router(submissions.router)
app.include_router(admin.router)
app.include_router(profile.router)
app.include_router(public.router)


@app.get("/api/health")
async def health():
    return await piston_service.health()


@app.get("/api")
def root():
    return {"ok": True, "service": "CodeArena API"}
