import os

from sqlalchemy import create_engine, event
from sqlalchemy.orm import DeclarativeBase, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "")

# Set DB_PROVIDER=aws to route through IAM-authenticated RDS instead of DATABASE_URL.
DB_PROVIDER = os.getenv("DB_PROVIDER", "").strip().lower()
AWS_RDS_HOST = os.getenv("AWS_RDS_HOST", "")
AWS_RDS_PORT = int(os.getenv("AWS_RDS_PORT", "5432"))
AWS_RDS_DB = os.getenv("AWS_RDS_DB", "postgres")
AWS_RDS_USER = os.getenv("AWS_RDS_USER", "postgres")
AWS_RDS_REGION = os.getenv("AWS_RDS_REGION", "ap-south-1")


def _normalize(url: str) -> str:
    # Neon/Vercel Postgres URLs commonly use postgres:// or postgresql://
    if url.startswith("postgres://"):
        url = "postgresql://" + url[len("postgres://"):]
    if url.startswith("postgresql://") and "+psycopg" not in url:
        url = url.replace("postgresql://", "postgresql+psycopg://", 1)
    return url


def _build_aws_engine():
    if not AWS_RDS_HOST:
        raise RuntimeError("AWS_RDS_HOST is not configured")

    import boto3

    rds_client = boto3.client("rds", region_name=AWS_RDS_REGION)

    aws_engine = create_engine(
        f"postgresql+psycopg2://{AWS_RDS_USER}@{AWS_RDS_HOST}:{AWS_RDS_PORT}/{AWS_RDS_DB}",
        pool_pre_ping=True,
        pool_size=1,
        max_overflow=2,
        pool_recycle=280,
        connect_args={"sslmode": "require"},
    )

    # IAM auth tokens expire (~15 min), so mint one fresh on every new DBAPI connection.
    @event.listens_for(aws_engine, "do_connect")
    def _inject_iam_token(dialect, conn_rec, cargs, cparams):
        cparams["password"] = rds_client.generate_db_auth_token(
            DBHostname=AWS_RDS_HOST,
            Port=AWS_RDS_PORT,
            DBUsername=AWS_RDS_USER,
            Region=AWS_RDS_REGION,
        )

    return aws_engine


def _build_engine():
    if DB_PROVIDER == "aws":
        return _build_aws_engine()
    if not DATABASE_URL:
        return None
    return create_engine(
        _normalize(DATABASE_URL),
        pool_pre_ping=True,
        pool_size=1,
        max_overflow=2,
        pool_recycle=280,
    )


engine = _build_engine()

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
