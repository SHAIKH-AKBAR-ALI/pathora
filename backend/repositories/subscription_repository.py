import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.models.subscription import Subscription


async def get_subscription_by_user_id(db: AsyncSession, user_id: uuid.UUID) -> Optional[Subscription]:
    result = await db.execute(
        select(Subscription).where(
            Subscription.user_id == user_id,
            Subscription.deleted_at.is_(None),
        )
    )
    return result.scalar_one_or_none()


async def get_subscription_by_order_id(
    db: AsyncSession, order_id: str
) -> Optional[Subscription]:
    result = await db.execute(
        select(Subscription).where(
            Subscription.stripe_customer_id == order_id,
            Subscription.deleted_at.is_(None),
        )
    )
    return result.scalar_one_or_none()


async def upsert_subscription(
    db: AsyncSession,
    user_id: uuid.UUID,
    payment_ref: str,        # stored in stripe_customer_id column
    payment_sub_ref: str,    # stored in stripe_subscription_id column
    status: str,
    plan: str,
    current_period_end: Optional[datetime] = None,
) -> Subscription:
    sub = await get_subscription_by_user_id(db, user_id)
    if sub:
        sub.stripe_customer_id = payment_ref
        sub.stripe_subscription_id = payment_sub_ref
        sub.status = status
        sub.plan = plan
        if current_period_end is not None:
            sub.current_period_end = current_period_end
    else:
        sub = Subscription(
            user_id=user_id,
            stripe_customer_id=payment_ref,
            stripe_subscription_id=payment_sub_ref,
            status=status,
            plan=plan,
            current_period_end=current_period_end,
        )
        db.add(sub)
    await db.flush()
    await db.refresh(sub)
    return sub
