"""Add college_id to users

Revision ID: af211b1f1de8
Revises: 
Create Date: 2026-09-08 01:59:22.900234

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'af211b1f1de8'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('users', sa.Column('college_id', sa.String(length=50), nullable=True))
    op.create_index(op.f('ix_users_college_id'), 'users', ['college_id'], unique=True)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_users_college_id'), table_name='users')
    op.drop_column('users', 'college_id')
