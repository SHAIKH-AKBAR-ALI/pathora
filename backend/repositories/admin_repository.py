import uuid
from datetime import datetime, timezone

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.models.feature_flag import FeatureFlag
from backend.models.roadmap import Roadmap
from backend.models.subscription import Subscription
from backend.models.user import User

PRO_PLAN_PRICE_INR = 999


async def get_all_users(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 50,
    search: str | None = None,
) -> tuple[list[User], int]:
    query = select(User)
    count_query = select(func.count(User.id))

    if search:
        like = f"%{search}%"
        query = query.where(User.email.ilike(like))
        count_query = count_query.where(User.email.ilike(like))

    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    query = query.order_by(User.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    users = list(result.scalars().all())

    return users, total


async def get_user_by_id_admin(db: AsyncSession, user_id: uuid.UUID) -> User | None:
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()


async def ban_user(db: AsyncSession, user_id: uuid.UUID) -> User | None:
    user = await get_user_by_id_admin(db, user_id)
    if not user:
        return None
    user.deleted_at = datetime.now(timezone.utc)
    await db.flush()
    await db.refresh(user)
    return user


async def unban_user(db: AsyncSession, user_id: uuid.UUID) -> User | None:
    user = await get_user_by_id_admin(db, user_id)
    if not user:
        return None
    user.deleted_at = None
    await db.flush()
    await db.refresh(user)
    return user


async def change_user_plan(db: AsyncSession, user_id: uuid.UUID, plan: str) -> User | None:
    user = await get_user_by_id_admin(db, user_id)
    if not user:
        return None
    user.role = plan
    await db.flush()
    await db.refresh(user)
    return user


async def get_platform_stats(db: AsyncSession) -> dict:
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)

    total_users_result = await db.execute(select(func.count(User.id)))
    total_users = total_users_result.scalar_one()

    active_users_result = await db.execute(
        select(func.count(User.id)).where(User.deleted_at.is_(None))
    )
    active_users = active_users_result.scalar_one()

    total_roadmaps_result = await db.execute(
        select(func.count(Roadmap.id)).where(Roadmap.deleted_at.is_(None))
    )
    total_roadmaps = total_roadmaps_result.scalar_one()

    paid_users_result = await db.execute(
        select(func.count(User.id)).where(User.role == "paid", User.deleted_at.is_(None))
    )
    paid_users = paid_users_result.scalar_one()

    new_users_result = await db.execute(
        select(func.count(User.id)).where(User.created_at >= today_start)
    )
    new_users_today = new_users_result.scalar_one()

    return {
        "total_users": total_users,
        "active_users": active_users,
        "total_roadmaps": total_roadmaps,
        "total_revenue_inr": paid_users * PRO_PLAN_PRICE_INR,
        "new_users_today": new_users_today,
    }


async def get_all_feature_flags(db: AsyncSession) -> list[FeatureFlag]:
    result = await db.execute(select(FeatureFlag).order_by(FeatureFlag.name))
    return list(result.scalars().all())


async def update_feature_flag(db: AsyncSession, name: str, enabled: bool) -> FeatureFlag | None:
    result = await db.execute(select(FeatureFlag).where(FeatureFlag.name == name))
    flag = result.scalar_one_or_none()
    if not flag:
        return None
    flag.enabled = enabled
    await db.flush()
    await db.refresh(flag)
    return flag
