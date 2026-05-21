import uuid
from datetime import datetime

from sqlalchemy import Date, DateTime, ForeignKey, Index, Integer, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from backend.models.base import Base


class UsageLimit(Base):
    __tablename__ = "usage_limits"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, unique=True)
    roadmaps_used_this_month: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    ai_explanations_used_today: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    resume_analyses_used_this_month: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    reset_date: Mapped[datetime | None] = mapped_column(Date, nullable=True)
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    __table_args__ = (Index("ix_usage_limits_user_id", "user_id"),)
