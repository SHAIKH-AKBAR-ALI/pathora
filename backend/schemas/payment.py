from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class OrderResponse(BaseModel):
    order_id: str
    amount: int
    currency: str
    razorpay_key_id: str


class PaymentVerifyRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class SubscriptionStatusResponse(BaseModel):
    plan: str
    status: str
    current_period_end: Optional[datetime]
