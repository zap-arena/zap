import os
from logging.config import fileConfig

from dotenv import load_dotenv
from sqlalchemy import engine_from_config, pool

from alembic import context

# Load .env so DATABASE_URL is available when running locally
# .env lives at the project root (two levels above migrations/)
load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

config = context.config

# Wire Alembic logging to the config file
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# ── Import every model so autogenerate can detect schema changes ──────────────
import models  # noqa: E402  (must come after sys.path is set by alembic)
target_metadata = models.Base.metadata


def _get_url() -> str:
    """Return a psycopg3-compatible DATABASE_URL from the environment."""
    url = os.environ.get("DATABASE_URL", config.get_main_option("sqlalchemy.url", ""))
    if url.startswith("postgres://"):
        url = "postgresql://" + url[len("postgres://"):]
    if url.startswith("postgresql://") and "+psycopg" not in url:
        url = url.replace("postgresql://", "postgresql+psycopg://", 1)
    return url


def run_migrations_offline() -> None:
    """Run migrations without a live DB connection (generates SQL script)."""
    context.configure(
        url=_get_url(),
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations against a live database."""
    cfg = config.get_section(config.config_ini_section, {})
    cfg["sqlalchemy.url"] = _get_url()

    connectable = engine_from_config(
        cfg,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
