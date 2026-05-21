import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.models.user import User


async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    result = await db.execute(
        select(User).where(User.email == email, User.deleted_at.is_(None))
    )
    return result.scalar_one_or_none()


async def get_user_by_id(db: AsyncSession, user_id: uuid.UUID) -> User | None:
    result = await db.execute(
        select(User).where(User.id == user_id, User.deleted_at.is_(None))
    )
    return result.scalar_one_or_none()


async def create_user(db: AsyncSession, email: str, hashed_password: str, full_name: str | None = None) -> User:
    user = User(
        email=email,
        hashed_password=hashed_password,
        full_name=full_name,
        role="free",
    )
    db.add(user)
    await db.flush()
    await db.refresh(user)
    return user
