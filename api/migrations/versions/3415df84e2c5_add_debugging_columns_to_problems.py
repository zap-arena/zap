"""add_debugging_columns_to_problems

Revision ID: 3415df84e2c5
Revises: 
Create Date: 2026-09-05 13:17:09.927431

Adds two columns to the `problems` table that enable "Liar's Log"
debugging-type problems:
  - type         VARCHAR(20) NOT NULL DEFAULT 'coding'
  - debugging_data  JSON (nullable)
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.engine.reflection import Inspector


# revision identifiers, used by Alembic.
revision: str = "3415df84e2c5"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _column_exists(table: str, column: str) -> bool:
    """Check whether a column already exists (safe to run on already-migrated DBs)."""
    bind = op.get_bind()
    inspector = Inspector.from_engine(bind)
    cols = [c["name"] for c in inspector.get_columns(table)]
    return column in cols


def upgrade() -> None:
    """Add type and debugging_data columns if they don't already exist."""
    if not _column_exists("problems", "type"):
        op.add_column(
            "problems",
            sa.Column(
                "type",
                sa.String(length=20),
                nullable=False,
                server_default="coding",
            ),
        )
    else:
        # Column exists (manual migration already ran); just enforce NOT NULL
        op.alter_column(
            "problems",
            "type",
            existing_type=sa.VARCHAR(length=20),
            nullable=False,
            existing_server_default=sa.text("'coding'::character varying"),
        )

    if not _column_exists("problems", "debugging_data"):
        op.add_column(
            "problems",
            sa.Column("debugging_data", sa.JSON(), nullable=True),
        )


def downgrade() -> None:
    """Remove the debugging columns."""
    if _column_exists("problems", "debugging_data"):
        op.drop_column("problems", "debugging_data")

    if _column_exists("problems", "type"):
        op.drop_column("problems", "type")
