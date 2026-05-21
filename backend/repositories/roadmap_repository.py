import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.models.roadmap import Roadmap


async def create_roadmap(
    db: AsyncSession,
    user_id: uuid.UUID,
    topic: str,
    difficulty: str,
    goal: str,
    content: dict,
) -> Roadmap:
    roadmap = Roadmap(
        user_id=user_id,
        topic=topic,
        difficulty=difficulty,
        goal=goal,
        content=content,
    )
    db.add(roadmap)
    await db.flush()
    await db.refresh(roadmap)
    return roadmap


async def get_roadmap_by_id(db: AsyncSession, roadmap_id: uuid.UUID) -> Roadmap | None:
    result = await db.execute(
        select(Roadmap).where(Roadmap.id == roadmap_id, Roadmap.deleted_at.is_(None))
    )
    return result.scalar_one_or_none()


async def get_user_roadmaps(db: AsyncSession, user_id: uuid.UUID) -> list[Roadmap]:
    result = await db.execute(
        select(Roadmap)
        .where(Roadmap.user_id == user_id, Roadmap.deleted_at.is_(None))
        .order_by(Roadmap.created_at.desc())
    )
    return list(result.scalars().all())


async def update_roadmap_rating(db: AsyncSession, roadmap_id: uuid.UUID, rating: int) -> Roadmap | None:
    roadmap = await get_roadmap_by_id(db, roadmap_id)
    if not roadmap:
        return None
    roadmap.rating = rating
    await db.flush()
    await db.refresh(roadmap)
    return roadmap
