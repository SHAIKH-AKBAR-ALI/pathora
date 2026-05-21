import uuid
from datetime import date, datetime, timezone

from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from backend.models.usage_limit import UsageLimit


async def get_or_create_usage(db: AsyncSession, user_id: uuid.UUID) -> UsageLimit:
    result = await db.execute(
        select(UsageLimit).where(UsageLimit.user_id == user_id, UsageLimit.deleted_at.is_(None))
    )
    usage = result.scalar_one_or_none()
    if not usage:
        usage = UsageLimit(user_id=user_id)
        db.add(usage)
        await db.flush()
        await db.refresh(usage)
    return usage


async def increment_roadmap_count(db: AsyncSession, user_id: uuid.UUID) -> None:
    await get_or_create_usage(db, user_id)  # ensure row exists
    await db.execute(
        update(UsageLimit)
        .where(UsageLimit.user_id == user_id, UsageLimit.deleted_at.is_(None))
        .values(
            roadmaps_used_this_month=UsageLimit.roadmaps_used_this_month + 1,
            updated_at=datetime.now(timezone.utc),
        )
    )
    await db.flush()


async def decrement_roadmap_count(db: AsyncSession, user_id: uuid.UUID) -> None:
    await db.execute(
        update(UsageLimit)
        .where(UsageLimit.user_id == user_id, UsageLimit.deleted_at.is_(None))
        .values(
            roadmaps_used_this_month=func.greatest(0, UsageLimit.roadmaps_used_this_month - 1),
            updated_at=datetime.now(timezone.utc),
        )
    )
    await db.flush()


async def increment_ai_explanation_count(db: AsyncSession, user_id: uuid.UUID) -> None:
    await get_or_create_usage(db, user_id)  # ensure row exists
    await db.execute(
        update(UsageLimit)
        .where(UsageLimit.user_id == user_id, UsageLimit.deleted_at.is_(None))
        .values(
            ai_explanations_used_today=UsageLimit.ai_explanations_used_today + 1,
            updated_at=datetime.now(timezone.utc),
        )
    )
    await db.flush()


async def reset_monthly_counts(db: AsyncSession) -> None:
    await db.execute(
        update(UsageLimit)
        .where(UsageLimit.deleted_at.is_(None))
        .values(
            roadmaps_used_this_month=0,
            resume_analyses_used_this_month=0,
            reset_date=date.today(),
            updated_at=datetime.now(timezone.utc),
        )
    )
    await db.flush()


async def reset_daily_counts(db: AsyncSession) -> None:
    await db.execute(
        update(UsageLimit)
        .where(UsageLimit.deleted_at.is_(None))
        .values(
            ai_explanations_used_today=0,
            updated_at=datetime.now(timezone.utc),
        )
    )
    await db.flush()
