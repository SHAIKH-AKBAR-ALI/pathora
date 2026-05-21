import uuid

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.config import settings
from backend.core.database import get_db
from backend.core.dependencies import get_current_user
from backend.core.limiter import limiter
from backend.core.middleware import get_ip_key
from backend.core.security import create_access_token, create_refresh_token, decode_token, hash_password, verify_password
from backend.repositories.user_repository import create_user, get_user_by_email, get_user_by_id
from backend.schemas.auth import APIResponse, LoginRequest, SignupRequest, UserResponse

router = APIRouter(prefix="/auth", tags=["auth"])

_COOKIE_OPTS = dict(
    httponly=True,
    secure=True,
    samesite="lax",
    path="/",
)


@router.post("/signup", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("10/minute", key_func=get_ip_key)
async def signup(request: Request, body: SignupRequest, response: Response, db: AsyncSession = Depends(get_db)):
    existing = await get_user_by_email(db, body.email)
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    hashed = hash_password(body.password)
    try:
        user = await create_user(db, email=body.email, hashed_password=hashed, full_name=body.full_name)
    except IntegrityError:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    access_token = create_access_token(str(user.id), user.role)
    refresh_token = create_refresh_token(str(user.id))

    response.set_cookie(
        key="access_token",
        value=access_token,
        max_age=settings.jwt_access_token_expire_minutes * 60,
        **_COOKIE_OPTS,
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        max_age=settings.jwt_refresh_token_expire_days * 86400,
        **_COOKIE_OPTS,
    )

    return APIResponse(
        success=True,
        data=UserResponse(
            id=str(user.id),
            email=user.email,
            full_name=user.full_name,
            role=user.role,
        ),
        error=None,
    )


@router.post("/login", response_model=APIResponse)
@limiter.limit("10/minute", key_func=get_ip_key)
async def login(request: Request, body: LoginRequest, response: Response, db: AsyncSession = Depends(get_db)):
    user = await get_user_by_email(db, body.email)
    if not user or not user.hashed_password or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    access_token = create_access_token(str(user.id), user.role)
    refresh_token = create_refresh_token(str(user.id))

    response.set_cookie(
        key="access_token",
        value=access_token,
        max_age=settings.jwt_access_token_expire_minutes * 60,
        **_COOKIE_OPTS,
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        max_age=settings.jwt_refresh_token_expire_days * 86400,
        **_COOKIE_OPTS,
    )

    return APIResponse(
        success=True,
        data=UserResponse(
            id=str(user.id),
            email=user.email,
            full_name=user.full_name,
            role=user.role,
        ),
        error=None,
    )


@router.post("/logout", response_model=APIResponse)
@limiter.limit("60/minute")
async def logout(request: Request, response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return APIResponse(success=True, data="Logged out", error=None)


@router.post("/refresh", response_model=APIResponse)
@limiter.limit("60/minute")
async def refresh(request: Request, response: Response, db: AsyncSession = Depends(get_db)):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing refresh token")

    payload = decode_token(token)
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = await get_user_by_id(db, uuid.UUID(user_id))
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    access_token = create_access_token(str(user.id), user.role)
    response.set_cookie(
        key="access_token",
        value=access_token,
        max_age=settings.jwt_access_token_expire_minutes * 60,
        **_COOKIE_OPTS,
    )

    return APIResponse(success=True, data="Token refreshed", error=None)


@router.get("/me", response_model=APIResponse)
@limiter.limit("60/minute")
async def me(request: Request, current_user=Depends(get_current_user)):
    return APIResponse(
        success=True,
        data=UserResponse(
            id=str(current_user.id),
            email=current_user.email,
            full_name=current_user.full_name,
            role=current_user.role,
        ),
        error=None,
    )
