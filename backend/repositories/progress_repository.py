import uuid
from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.models.progress import Progress


async def get_or_create_progress(db: AsyncSession, user_id: uuid.UUID, roadmap_id: uuid.UUID) -> Progress:
    result = await db.execute(
        select(Progress).where(
            Progress.user_id == user_id,
            Progress.roadmap_id == roadmap_id,
            Progress.deleted_at.is_(None),
        )
    )
    progress = result.scalar_one_or_none()
    if not progress:
        progress = Progress(user_id=user_id, roadmap_id=roadmap_id, completed_topics=[])
        db.add(progress)
        await db.flush()
        await db.refresh(progress)
    return progress


async def update_progress(
    db: AsyncSession,
    user_id: uuid.UUID,
    roadmap_id: uuid.UUID,
    completed_topics: list[str],
) -> Progress:
    progress = await get_or_create_progress(db, user_id, roadmap_id)
    progress.completed_topics = completed_topics
    await db.flush()
    await db.refresh(progress)
    return progress


async def update_streak(db: AsyncSession, user_id: uuid.UUID, roadmap_id: uuid.UUID) -> Progress:
    result = await db.execute(
        select(Progress)
        .where(
            Progress.user_id == user_id,
            Progress.roadmap_id == roadmap_id,
            Progress.deleted_at.is_(None),
        )
        .with_for_update()
    )
    progress = result.scalar_one_or_none()
    if not progress:
        progress = Progress(user_id=user_id, roadmap_id=roadmap_id, completed_topics=[])
        db.add(progress)
        await db.flush()
        await db.refresh(progress)
    now = datetime.now(timezone.utc)
    today = now.date()

    if progress.last_activity is None:
        progress.streak = 1
    else:
        last_date = progress.last_activity.date()
        if last_date == today:
            pass  # already active today, streak unchanged
        elif last_date == today - timedelta(days=1):
            progress.streak += 1
        else:
            progress.streak = 1

    progress.last_activity = now
    await db.flush()
    await db.refresh(progress)
    return progress


async def get_all_user_progress(db: AsyncSession, user_id: uuid.UUID) -> list[Progress]:
    result = await db.execute(
        select(Progress).where(
            Progress.user_id == user_id,
            Progress.deleted_at.is_(None),
        )
    )
    return list(result.scalars().all())
