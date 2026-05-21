from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.dependencies import get_current_user, get_db
from backend.core.limiter import limiter
from backend.models.user import User
from backend.schemas.auth import APIResponse
from backend.schemas.payment import OrderResponse, PaymentVerifyRequest, SubscriptionStatusResponse
from backend.services.payment_service import create_order, get_subscription_status, verify_payment

router = APIRouter(prefix="/billing", tags=["billing"])


@router.post("/order", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("10/minute")
async def create_payment_order(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    data = await create_order(db, current_user.id)
    return APIResponse(success=True, data=OrderResponse(**data), error=None)


@router.post("/verify", response_model=APIResponse)
@limiter.limit("10/minute")
async def verify_payment_endpoint(
    request: Request,
    body: PaymentVerifyRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await verify_payment(
        db,
        user_id=current_user.id,
        razorpay_order_id=body.razorpay_order_id,
        razorpay_payment_id=body.razorpay_payment_id,
        razorpay_signature=body.razorpay_signature,
    )
    return APIResponse(success=True, data={"message": "Payment verified. Pro plan activated."}, error=None)


@router.get("/status", response_model=APIResponse)
@limiter.limit("30/minute")
async def subscription_status(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    data = await get_subscription_status(db, current_user.id)
    return APIResponse(success=True, data=SubscriptionStatusResponse(**data), error=None)
