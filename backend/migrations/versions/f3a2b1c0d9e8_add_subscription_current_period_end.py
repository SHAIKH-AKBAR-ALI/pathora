"""add_subscription_current_period_end

Revision ID: f3a2b1c0d9e8
Revises: 4521c59e6364
Create Date: 2026-05-22 00:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "f3a2b1c0d9e8"
down_revision: Union[str, None] = "4521c59e6364"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "subscriptions",
        sa.Column("current_period_end", sa.DateTime(timezone=True), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("subscriptions", "current_period_end")
