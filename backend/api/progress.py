import uuid

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.dependencies import get_current_user, get_db
from backend.core.limiter import limiter
from backend.models.user import User
from backend.repositories.progress_repository import get_or_create_progress
from backend.repositories.roadmap_repository import get_roadmap_by_id
from backend.schemas.auth import APIResponse
from backend.schemas.progress import ProgressResponse, ProgressUpdate
from backend.services.progress_service import get_user_streak, update_user_progress

router = APIRouter(tags=["progress"])


def _to_response(progress) -> ProgressResponse:
    return ProgressResponse(
        id=str(progress.id),
        user_id=str(progress.user_id),
        roadmap_id=str(progress.roadmap_id),
        completed_topics=progress.completed_topics or [],
        streak=progress.streak,
        last_activity=progress.last_activity,
        created_at=progress.created_at,
    )


@router.get("/roadmaps/{roadmap_id}/progress", response_model=APIResponse)
@limiter.limit("60/minute")
async def get_progress(
    request: Request,
    roadmap_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    roadmap = await get_roadmap_by_id(db, roadmap_id)
    if not roadmap or roadmap.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Roadmap not found")

    progress = await get_or_create_progress(db, current_user.id, roadmap_id)
    total_topics = sum(len(phase.get("topics", [])) for phase in roadmap.content.get("phases", []))
    completed = len(progress.completed_topics or [])
    completion_percentage = round(completed / total_topics * 100, 1) if total_topics > 0 else 0.0

    return APIResponse(
        success=True,
        data={
            "progress": _to_response(progress),
            "completion_percentage": completion_percentage,
        },
        error=None,
    )


@router.put("/roadmaps/{roadmap_id}/progress", response_model=APIResponse)
@limiter.limit("60/minute")
async def update_progress_endpoint(
    request: Request,
    roadmap_id: uuid.UUID,
    body: ProgressUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    roadmap = await get_roadmap_by_id(db, roadmap_id)
    if not roadmap or roadmap.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Roadmap not found")

    result = await update_user_progress(db, current_user.id, roadmap_id, body.completed_topics)
    return APIResponse(
        success=True,
        data={
            "progress": _to_response(result["progress"]),
            "completion_percentage": result["completion_percentage"],
        },
        error=None,
    )


@router.get("/progress/streak", response_model=APIResponse)
@limiter.limit("60/minute")
async def get_streak(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    streak_data = await get_user_streak(db, current_user.id)
    return APIResponse(success=True, data=streak_data, error=None)
