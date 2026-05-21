import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.dependencies import get_db, require_admin
from backend.core.limiter import limiter
from backend.models.user import User
from backend.repositories.admin_repository import (
    ban_user,
    change_user_plan,
    get_all_feature_flags,
    get_all_users,
    get_platform_stats,
    get_user_by_id_admin,
    unban_user,
    update_feature_flag,
)
from backend.schemas.admin import (
    FeatureFlagResponse,
    FeatureFlagUpdate,
    PlatformStatsResponse,
    UserActionEnum,
    UserActionRequest,
    UserListResponse,
)
from backend.schemas.auth import APIResponse

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/users", response_model=APIResponse)
@limiter.limit("60/minute")
async def list_users(
    request: Request,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=200),
    search: str | None = Query(default=None, max_length=255),
    _admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    users, total = await get_all_users(db, skip=skip, limit=limit, search=search)
    data = {
        "users": [UserListResponse.model_validate(u) for u in users],
        "total": total,
        "skip": skip,
        "limit": limit,
    }
    return APIResponse(success=True, data=data, error=None)


@router.get("/users/{user_id}", response_model=APIResponse)
@limiter.limit("60/minute")
async def get_user(
    request: Request,
    user_id: uuid.UUID,
    _admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    user = await get_user_by_id_admin(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return APIResponse(success=True, data=UserListResponse.model_validate(user), error=None)


@router.post("/users/{user_id}/action", response_model=APIResponse)
@limiter.limit("60/minute")
async def user_action(
    request: Request,
    user_id: uuid.UUID,
    body: UserActionRequest,
    _admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    if body.action == UserActionEnum.ban:
        user = await ban_user(db, user_id)
    elif body.action == UserActionEnum.unban:
        user = await unban_user(db, user_id)
    elif body.action == UserActionEnum.change_plan:
        if body.plan not in ("free", "paid"):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="plan must be 'free' or 'paid'",
            )
        user = await change_user_plan(db, user_id, body.plan)
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid action")

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return APIResponse(success=True, data=UserListResponse.model_validate(user), error=None)


@router.get("/stats", response_model=APIResponse)
@limiter.limit("60/minute")
async def platform_stats(
    request: Request,
    _admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    stats = await get_platform_stats(db)
    return APIResponse(success=True, data=PlatformStatsResponse(**stats), error=None)


@router.get("/flags", response_model=APIResponse)
@limiter.limit("60/minute")
async def list_flags(
    request: Request,
    _admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    flags = await get_all_feature_flags(db)
    return APIResponse(
        success=True,
        data=[FeatureFlagResponse.model_validate(f) for f in flags],
        error=None,
    )


@router.put("/flags/{name}", response_model=APIResponse)
@limiter.limit("60/minute")
async def toggle_flag(
    request: Request,
    name: str,
    body: FeatureFlagUpdate,
    _admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    flag = await update_feature_flag(db, name, body.enabled)
    if not flag:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Feature flag not found")
    return APIResponse(success=True, data=FeatureFlagResponse.model_validate(flag), error=None)
