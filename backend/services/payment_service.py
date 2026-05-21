import logging
import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional

import razorpay
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.config import settings
from backend.repositories.subscription_repository import (
    get_subscription_by_order_id,
    get_subscription_by_user_id,
    upsert_subscription,
)
from backend.repositories.user_repository import get_user_by_id

logger = logging.getLogger(__name__)

_PRO_AMOUNT_PAISE = 99900  # ₹999/month in paise
_CURRENCY = "INR"


def _razorpay_client() -> razorpay.Client:
    return razorpay.Client(auth=(settings.razorpay_key_id, settings.razorpay_key_secret))


async def create_order(db: AsyncSession, user_id: uuid.UUID) -> dict:
    client = _razorpay_client()
    try:
        order = client.order.create({
            "amount": _PRO_AMOUNT_PAISE,
            "currency": _CURRENCY,
            "receipt": f"order_{str(user_id)[:8]}",
            "notes": {"user_id": str(user_id)},
        })
    except Exception as exc:
        logger.error("Razorpay order creation failed for user %s: %s", user_id, exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to create payment order. Please try again.",
        ) from exc

    return {
        "order_id": order["id"],
        "amount": order["amount"],
        "currency": order["currency"],
        "razorpay_key_id": settings.razorpay_key_id,
    }


async def verify_payment(
    db: AsyncSession,
    user_id: uuid.UUID,
    razorpay_order_id: str,
    razorpay_payment_id: str,
    razorpay_signature: str,
) -> None:
    # Idempotency — order already processed, skip re-activation
    existing = await get_subscription_by_order_id(db, razorpay_order_id)
    if existing:
        logger.info("Order %s already processed for user %s, skipping", razorpay_order_id, user_id)
        return

    client = _razorpay_client()
    try:
        client.utility.verify_payment_signature({
            "razorpay_order_id": razorpay_order_id,
            "razorpay_payment_id": razorpay_payment_id,
            "razorpay_signature": razorpay_signature,
        })
    except razorpay.errors.SignatureVerificationError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid payment signature.",
        ) from exc

    current_period_end = datetime.now(timezone.utc) + timedelta(days=30)

    await upsert_subscription(
        db,
        user_id=user_id,
        payment_ref=razorpay_order_id,
        payment_sub_ref=razorpay_payment_id,
        status="active",
        plan="pro",
        current_period_end=current_period_end,
    )

    user = await get_user_by_id(db, user_id)
    if user and user.role != "admin":
        user.role = "paid"
        await db.flush()


async def get_subscription_status(db: AsyncSession, user_id: uuid.UUID) -> dict:
    sub = await get_subscription_by_user_id(db, user_id)
    if not sub:
        return {"plan": "free", "status": "active", "current_period_end": None}

    now = datetime.now(timezone.utc)
    if (
        sub.current_period_end
        and sub.current_period_end < now
        and sub.status != "canceled"
    ):
        return {"plan": "free", "status": "expired", "current_period_end": sub.current_period_end}

    return {
        "plan": sub.plan,
        "status": sub.status,
        "current_period_end": sub.current_period_end,
    }
