"""initial_schema

Revision ID: b69d4c08c73c
Revises:
Create Date: 2026-05-21 05:03:30.558523

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "b69d4c08c73c"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("email", sa.String(255), nullable=False, unique=True),
        sa.Column("hashed_password", sa.String(255), nullable=True),
        sa.Column("role", sa.Enum("free", "paid", "admin", name="user_role", create_type=False), nullable=False, server_default="free"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_users_email", "users", ["email"])
    op.create_index("ix_users_role", "users", ["role"])
    op.create_index("ix_users_created_at", "users", ["created_at"])
    op.create_index("ix_users_deleted_at", "users", ["deleted_at"])

    op.create_table(
        "roadmaps",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("topic", sa.String(500), nullable=False),
        sa.Column("difficulty", sa.String(50), nullable=False),
        sa.Column("goal", sa.String(1000), nullable=False),
        sa.Column("content", postgresql.JSON, nullable=False),
        sa.Column("rating", sa.Integer, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_roadmaps_user_id", "roadmaps", ["user_id"])
    op.create_index("ix_roadmaps_created_at", "roadmaps", ["created_at"])
    op.create_index("ix_roadmaps_deleted_at", "roadmaps", ["deleted_at"])

    op.create_table(
        "progress",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("roadmap_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("roadmaps.id"), nullable=False),
        sa.Column("completed_topics", postgresql.JSON, nullable=False, server_default="[]"),
        sa.Column("streak", sa.Integer, nullable=False, server_default="0"),
        sa.Column("last_activity", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_progress_user_id", "progress", ["user_id"])
    op.create_index("ix_progress_roadmap_id", "progress", ["roadmap_id"])
    op.create_index("ix_progress_created_at", "progress", ["created_at"])

    op.create_table(
        "subscriptions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("stripe_customer_id", sa.String(255), nullable=True),
        sa.Column("stripe_subscription_id", sa.String(255), nullable=True),
        sa.Column(
            "status",
            sa.Enum("active", "canceled", "past_due", "trialing", "incomplete", name="subscription_status", create_type=False),
            nullable=False,
            server_default="active",
        ),
        sa.Column(
            "plan",
            sa.Enum("free", "pro", name="subscription_plan", create_type=False),
            nullable=False,
            server_default="free",
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_subscriptions_user_id", "subscriptions", ["user_id"])
    op.create_index("ix_subscriptions_status", "subscriptions", ["status"])
    op.create_index("ix_subscriptions_stripe_customer_id", "subscriptions", ["stripe_customer_id"])
    op.create_index("ix_subscriptions_created_at", "subscriptions", ["created_at"])

    op.create_table(
        "usage_limits",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False, unique=True),
        sa.Column("roadmaps_used_this_month", sa.Integer, nullable=False, server_default="0"),
        sa.Column("ai_explanations_used_today", sa.Integer, nullable=False, server_default="0"),
        sa.Column("resume_analyses_used_this_month", sa.Integer, nullable=False, server_default="0"),
        sa.Column("reset_date", sa.Date, nullable=True),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_usage_limits_user_id", "usage_limits", ["user_id"])

    op.create_table(
        "feature_flags",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False, unique=True),
        sa.Column("enabled", sa.Boolean, nullable=False, server_default="false"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    op.create_table(
        "ai_logs",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("topic", sa.String(500), nullable=True),
        sa.Column("model_used", sa.String(100), nullable=False),
        sa.Column("tokens_input", sa.Integer, nullable=False, server_default="0"),
        sa.Column("tokens_output", sa.Integer, nullable=False, server_default="0"),
        sa.Column("latency_ms", sa.Integer, nullable=False, server_default="0"),
        sa.Column("rating", sa.Integer, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_ai_logs_user_id", "ai_logs", ["user_id"])
    op.create_index("ix_ai_logs_created_at", "ai_logs", ["created_at"])

    op.create_table(
        "celery_jobs",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("job_type", sa.String(100), nullable=False),
        sa.Column(
            "status",
            sa.Enum("PENDING", "PROCESSING", "SUCCESS", "FAILED", "RETRYING", name="job_status", create_type=False),
            nullable=False,
            server_default="PENDING",
        ),
        sa.Column("result", postgresql.JSON, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_celery_jobs_user_id", "celery_jobs", ["user_id"])
    op.create_index("ix_celery_jobs_status", "celery_jobs", ["status"])
    op.create_index("ix_celery_jobs_created_at", "celery_jobs", ["created_at"])

    op.create_table(
        "stripe_events",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("stripe_event_id", sa.String(255), nullable=False, unique=True),
        sa.Column("processed_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_stripe_events_stripe_event_id", "stripe_events", ["stripe_event_id"])


def downgrade() -> None:
    op.drop_table("stripe_events")
    op.drop_table("celery_jobs")
    op.drop_table("ai_logs")
    op.drop_table("feature_flags")
    op.drop_table("usage_limits")
    op.drop_table("subscriptions")
    op.drop_table("progress")
    op.drop_table("roadmaps")
    op.drop_table("users")

    op.execute("DROP TYPE IF EXISTS job_status")
    op.execute("DROP TYPE IF EXISTS subscription_plan")
    op.execute("DROP TYPE IF EXISTS subscription_status")
    op.execute("DROP TYPE IF EXISTS user_role")
