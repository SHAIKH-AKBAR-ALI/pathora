import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from backend.repositories.progress_repository import (
    get_all_user_progress,
    get_or_create_progress,
    update_progress,
    update_streak,
)
from backend.repositories.roadmap_repository import get_roadmap_by_id


async def update_user_progress(
    db: AsyncSession,
    user_id: uuid.UUID,
    roadmap_id: uuid.UUID,
    completed_topics: list[str],
) -> dict:
    from fastapi import HTTPException, status

    roadmap = await get_roadmap_by_id(db, roadmap_id)
    completion_percentage = 0.0

    if roadmap and roadmap.content:
        phases = roadmap.content.get("phases", [])
        valid_topics: set[str] = {t for phase in phases for t in phase.get("topics", [])}
        invalid = [t for t in completed_topics if t not in valid_topics]
        if invalid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid topics: {invalid}",
            )
        total_topics = sum(len(phase.get("topics", [])) for phase in phases)
        if total_topics > 0:
            completion_percentage = len(completed_topics) / total_topics * 100

    await update_progress(db, user_id, roadmap_id, completed_topics)
    progress = await update_streak(db, user_id, roadmap_id)

    return {"progress": progress, "completion_percentage": round(completion_percentage, 1)}


async def get_user_streak(db: AsyncSession, user_id: uuid.UUID) -> dict:
    all_progress = await get_all_user_progress(db, user_id)
    if not all_progress:
        return {"streak": 0, "last_activity": None}

    # Return streak from most recently active roadmap
    active = max(all_progress, key=lambda p: p.last_activity or p.created_at)
    return {"streak": active.streak, "last_activity": active.last_activity}
