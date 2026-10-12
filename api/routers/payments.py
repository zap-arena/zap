import hashlib
import hmac
import os
import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
import httpx
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import get_db
from deps import get_current_user
import models
import schemas

router = APIRouter(prefix="/api/payments", tags=["payments"])

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "rzp_test_zap_platform")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "")

PLANS = {
    "pro_monthly": {
        "id": "pro_monthly",
        "name": "ZAP Pro Monthly",
        "price_inr": 499,
        "amount": 49900,  # 49900 paise = ₹499
        "currency": "INR",
        "duration_days": 30,
        "badge": "Popular",
        "description": "Unlimited Course Modules, Pattern Guides, & Premium Problems",
        "features": [
            "Full Access to all 13+ DSA Course Tracks",
            "Solve All Premium & Hard Coding Problems",
            "In-Browser WASM Compilation & Full Testcases",
            "Algorithmic Pattern Walkthroughs & Templates",
        ],
    },
    "pro_annual": {
        "id": "pro_annual",
        "name": "ZAP Pro Annual",
        "price_inr": 1999,
        "amount": 199900,  # 199900 paise = ₹1,999
        "currency": "INR",
        "duration_days": 365,
        "badge": "Best Value (Save 67%)",
        "description": "1 Year All-Inclusive Pass for Interview & Course Excellence",
        "features": [
            "Everything in Monthly Plan",
            "1 Year Full Course & Homework Access",
            "Priority WASM Runtime Resources",
            "Certificate of Completion for Tracks",
            "Future Modules Included Free",
        ],
    },
    "pro_lifetime": {
        "id": "pro_lifetime",
        "name": "ZAP Pro Lifetime",
        "price_inr": 3999,
        "amount": 399900,  # 399900 paise = ₹3,999
        "currency": "INR",
        "duration_days": 3650,
        "badge": "One-Time",
        "description": "Lifetime Unlimited Access to ZAP Platform",
        "features": [
            "Permanent Pro Access to all Courses & Problems",
            "All upcoming DSA, CS & AI Tracks included",
            "VIP Pro Badge on Leaderboards",
        ],
    },
}


COUPONS = {
    "ZAP50": {
        "code": "ZAP50",
        "discountPercent": 50,
        "description": "Flat 50% Off on all Pro membership passes",
        "badge": "Popular 🔥",
        "validUntil": "End of Month",
    },
    "EARLYBIRD30": {
        "code": "EARLYBIRD30",
        "discountPercent": 30,
        "description": "30% Off on Annual & Lifetime passes",
        "badge": "Early Access",
        "validUntil": "Limited Time",
    },
    "SUPERSTUDENT": {
        "code": "SUPERSTUDENT",
        "discountPercent": 40,
        "description": "College Student Special: 40% Off on all plans",
        "badge": "Student 🎓",
        "validUntil": "Academic Year",
    },
    "DEVZAP": {
        "code": "DEVZAP",
        "discountPercent": 90,
        "description": "Developer Test Pass: 90% Off for rapid testing",
        "badge": "Dev Pass ⚡",
        "validUntil": "Sandbox Active",
    },
}


@router.get("/coupons")
def get_available_coupons():
    """Return active promotional coupons."""
    return list(COUPONS.values())


@router.get("/config")
def get_payment_config():
    """Return public Razorpay configuration and available plans."""
    is_live_configured = bool(
        RAZORPAY_KEY_SECRET
        and RAZORPAY_KEY_ID
        and not RAZORPAY_KEY_ID.startswith("rzp_test_zap_platform")
    )
    return {
        "keyId": RAZORPAY_KEY_ID,
        "isLiveConfigured": is_live_configured,
        "currency": "INR",
        "plans": list(PLANS.values()),
        "coupons": list(COUPONS.values()),
    }


@router.get("/status")
def get_payment_status(user: models.User = Depends(get_current_user)):
    """Return current user's premium subscription status."""
    now = datetime.now(timezone.utc)
    is_active = False
    if user.is_premium:
        if not user.premium_expires_at or user.premium_expires_at > now:
            is_active = True

    return {
        "isPremium": is_active,
        "premiumPlan": user.premium_plan if is_active else None,
        "premiumExpiresAt": user.premium_expires_at.isoformat() if user.premium_expires_at else None,
    }


@router.post("/create-order", response_model=schemas.CreateOrderResponse)
async def create_order(
    payload: schemas.CreateOrderRequest,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a Razorpay order for the selected subscription plan."""
    plan = PLANS.get(payload.planId)
    if not plan:
        raise HTTPException(status_code=400, detail="Invalid plan selected")

    original_amount = plan["amount"]
    amount = original_amount
    discount_amount = 0
    coupon_applied = None

    if payload.couponCode:
        code_upper = payload.couponCode.strip().upper()
        coupon = COUPONS.get(code_upper)
        if coupon:
            discount_pct = coupon["discountPercent"]
            discount_amount = int(round(original_amount * (discount_pct / 100.0)))
            amount = max(100, original_amount - discount_amount)
            coupon_applied = code_upper

    currency = plan["currency"]

    order_id = ""
    is_live = bool(
        RAZORPAY_KEY_SECRET
        and RAZORPAY_KEY_ID
        and not RAZORPAY_KEY_ID.startswith("rzp_test_zap_platform")
    )

    # If live/real Razorpay keys are configured, call the Razorpay API
    if is_live:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(
                    "https://api.razorpay.com/v1/orders",
                    auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET),
                    json={
                        "amount": amount,
                        "currency": currency,
                        "receipt": f"rcpt_{uuid.uuid4().hex[:12]}",
                        "notes": {
                            "userId": user.id,
                            "userEmail": user.email,
                            "planId": plan["id"],
                            "couponApplied": coupon_applied or "",
                        },
                    },
                )
                if res.status_code == 200:
                    order_data = res.json()
                    order_id = order_data["id"]
                else:
                    raise HTTPException(
                        status_code=502,
                        detail=f"Razorpay order creation failed: {res.text}",
                    )
        except Exception as e:
            if isinstance(e, HTTPException):
                raise
            raise HTTPException(status_code=502, detail=f"Payment gateway error: {str(e)}")
    else:
        # Development / Sandbox mock order
        order_id = f"order_zap_{uuid.uuid4().hex[:14]}"

    # Record the pending payment in the database
    payment = models.Payment(
        user_id=user.id,
        razorpay_order_id=order_id,
        amount=amount,
        currency=currency,
        plan_id=plan["id"],
        status="created",
    )
    db.add(payment)
    db.commit()

    return {
        "orderId": order_id,
        "amount": amount,
        "originalAmount": original_amount,
        "discountAmount": discount_amount,
        "couponApplied": coupon_applied,
        "currency": currency,
        "keyId": RAZORPAY_KEY_ID,
        "planId": plan["id"],
        "planName": plan["name"],
        "isLiveConfigured": is_live,
    }


@router.post("/verify-payment", response_model=schemas.VerifyPaymentResponse)
def verify_payment(
    payload: schemas.VerifyPaymentRequest,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Verify Razorpay payment signature and activate user premium access."""
    plan = PLANS.get(payload.planId)
    if not plan:
        raise HTTPException(status_code=400, detail="Invalid plan")

    is_live = bool(
        RAZORPAY_KEY_SECRET
        and RAZORPAY_KEY_ID
        and not RAZORPAY_KEY_ID.startswith("rzp_test_zap_platform")
    )

    if is_live:
        # Cryptographic HMAC-SHA256 signature verification
        body = f"{payload.razorpayOrderId}|{payload.razorpayPaymentId}"
        expected_sig = hmac.new(
            RAZORPAY_KEY_SECRET.encode("utf-8"),
            body.encode("utf-8"),
            hashlib.sha256,
        ).hexdigest()

        if not hmac.compare_digest(expected_sig, payload.razorpaySignature):
            raise HTTPException(status_code=400, detail="Invalid payment signature")

    # Locate existing payment record or create one
    payment = db.scalar(
        select(models.Payment).where(
            models.Payment.razorpay_order_id == payload.razorpayOrderId
        )
    )
    if not payment:
        payment = models.Payment(
            user_id=user.id,
            razorpay_order_id=payload.razorpayOrderId,
            amount=plan["amount"],
            currency=plan["currency"],
            plan_id=plan["id"],
        )
        db.add(payment)

    payment.razorpay_payment_id = payload.razorpayPaymentId
    payment.razorpay_signature = payload.razorpaySignature
    payment.status = "paid"

    # Unlock user premium access
    duration_days = plan["duration_days"]
    now = datetime.now(timezone.utc)
    new_expires_at = now + timedelta(days=duration_days)

    user.is_premium = True
    user.premium_plan = plan["id"]
    user.premium_expires_at = new_expires_at

    db.commit()
    db.refresh(user)

    return {
        "success": True,
        "message": f"Payment successful! You now have full access to {plan['name']}.",
        "user": user,
    }
