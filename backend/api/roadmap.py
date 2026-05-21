import uuid

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.dependencies import get_current_user, get_db
from backend.core.limiter import limiter
from backend.models.user import User
from backend.repositories.roadmap_repository import (
    get_roadmap_by_id,
    get_user_roadmaps,
    update_roadmap_rating,
)
from backend.schemas.auth import APIResponse
from backend.schemas.roadmap import ExplainRequest, RateRequest, RoadmapRequest, RoadmapResponse, WhyRequest
from backend.services.roadmap_service import explain_topic, generate_roadmap, why_topic

router = APIRouter(prefix="/roadmaps", tags=["roadmaps"])


def _to_response(roadmap) -> RoadmapResponse:
    return RoadmapResponse(
        id=str(roadmap.id),
        user_id=str(roadmap.user_id),
        topic=roadmap.topic,
        difficulty=roadmap.difficulty,
        goal=roadmap.goal,
        content=roadmap.content,
        rating=roadmap.rating,
        created_at=roadmap.created_at,
    )


@router.post("", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("60/minute")
async def create_roadmap_endpoint(
    request: Request,
    body: RoadmapRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    roadmap = await generate_roadmap(
        db=db,
        user_id=current_user.id,
        topic=body.topic,
        difficulty=body.difficulty.value,
        goal=body.goal,
        user_role=current_user.role,
    )
    return APIResponse(success=True, data=_to_response(roadmap), error=None)


@router.get("", response_model=APIResponse)
@limiter.limit("60/minute")
async def list_roadmaps(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    roadmaps = await get_user_roadmaps(db, current_user.id)
    return APIResponse(success=True, data=[_to_response(r) for r in roadmaps], error=None)


@router.get("/{roadmap_id}", response_model=APIResponse)
@limiter.limit("60/minute")
async def get_roadmap(
    request: Request,
    roadmap_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    roadmap = await get_roadmap_by_id(db, roadmap_id)
    if not roadmap or roadmap.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Roadmap not found")
    return APIResponse(success=True, data=_to_response(roadmap), error=None)


@router.post("/{roadmap_id}/rate", response_model=APIResponse)
@limiter.limit("60/minute")
async def rate_roadmap(
    request: Request,
    roadmap_id: uuid.UUID,
    body: RateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    roadmap = await get_roadmap_by_id(db, roadmap_id)
    if not roadmap or roadmap.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Roadmap not found")
    updated = await update_roadmap_rating(db, roadmap_id, body.rating)
    return APIResponse(success=True, data={"rating": updated.rating}, error=None)


@router.post("/{roadmap_id}/explain", response_model=APIResponse)
@limiter.limit("60/minute")
async def explain_topic_endpoint(
    request: Request,
    roadmap_id: uuid.UUID,
    body: ExplainRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    roadmap = await get_roadmap_by_id(db, roadmap_id)
    if not roadmap or roadmap.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Roadmap not found")
    explanation = await explain_topic(
        db=db, user_id=current_user.id, user_role=current_user.role, topic=body.topic,
    )
    return APIResponse(success=True, data={"explanation": explanation}, error=None)


@router.post("/{roadmap_id}/why", response_model=APIResponse)
@limiter.limit("60/minute")
async def why_topic_endpoint(
    request: Request,
    roadmap_id: uuid.UUID,
    body: WhyRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    roadmap = await get_roadmap_by_id(db, roadmap_id)
    if not roadmap or roadmap.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Roadmap not found")
    answer = await why_topic(
        db=db, user_id=current_user.id, user_role=current_user.role, topic=body.topic,
    )
    return APIResponse(success=True, data={"answer": answer}, error=None)
