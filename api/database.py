import os

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "")


def _normalize(url: str) -> str:
    # Neon/Vercel Postgres URLs commonly use postgres:// or postgresql://
    if url.startswith("postgres://"):
        url = "postgresql://" + url[len("postgres://"):]
    if url.startswith("postgresql://") and "+psycopg" not in url:
        url = url.replace("postgresql://", "postgresql+psycopg://", 1)
    return url


def _make_engine():
    if not DATABASE_URL:
        return None
    url = _normalize(DATABASE_URL)
    is_sqlite = url.startswith("sqlite")
    kwargs = dict(pool_pre_ping=True)
    if is_sqlite:
        # SQLite needs check_same_thread=False for FastAPI threading
        kwargs["connect_args"] = {"check_same_thread": False}
    else:
        kwargs.update(pool_size=1, max_overflow=2, pool_recycle=280,
                      connect_args={"connect_timeout": 5})
    return create_engine(url, **kwargs)


engine = _make_engine()
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False) if engine else None


class Base(DeclarativeBase):
    pass


def get_db():
    if SessionLocal is None:
        raise RuntimeError("DATABASE_URL is not configured")
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
