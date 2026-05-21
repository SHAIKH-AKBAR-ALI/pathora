import asyncio
import logging

from celery.schedules import crontab

from backend.workers.celery_app import celery_app

logger = logging.getLogger(__name__)


async def _reset_daily():
    from backend.core.database import get_session_factory
    from backend.repositories.usage_repository import reset_daily_counts

    async with get_session_factory()() as session:
        try:
            await reset_daily_counts(session)
            await session.commit()
        except Exception:
            await session.rollback()
            raise


async def _reset_monthly():
    from backend.core.database import get_session_factory
    from backend.repositories.usage_repository import reset_monthly_counts

    async with get_session_factory()() as session:
        try:
            await reset_monthly_counts(session)
            await session.commit()
        except Exception:
            await session.rollback()
            raise


async def _check_expired_subscriptions():
    from datetime import datetime, timezone

    from sqlalchemy import select, update

    from backend.core.database import get_session_factory
    from backend.models.subscription import Subscription
    from backend.models.user import User

    async with get_session_factory()() as session:
        try:
            now = datetime.now(timezone.utc)
            result = await session.execute(
                select(Subscription).where(
                    Subscription.current_period_end < now,
                    Subscription.status != "canceled",
                    Subscription.deleted_at.is_(None),
                )
            )
            expired_subs = result.scalars().all()

            for sub in expired_subs:
                sub.status = "expired"
                user_result = await session.execute(
                    select(User).where(User.id == sub.user_id, User.deleted_at.is_(None))
                )
                user = user_result.scalar_one_or_none()
                if user and user.role not in ("admin", "free"):
                    user.role = "free"

            await session.commit()
            logger.info("check_expired_subscriptions: expired %d subscriptions", len(expired_subs))
        except Exception:
            await session.rollback()
            raise


@celery_app.task(
    name="tasks.reset_daily_counts",
    bind=True,
    max_retries=3,
    default_retry_delay=60,
)
def reset_daily_counts(self):
    logger.info("reset_daily_counts PROCESSING task_id=%s", self.request.id)
    try:
        asyncio.run(_reset_daily())
        logger.info("reset_daily_counts SUCCESS task_id=%s", self.request.id)
    except Exception as exc:
        logger.error("reset_daily_counts FAILED task_id=%s error=%s", self.request.id, exc)
        raise self.retry(exc=exc)


@celery_app.task(
    name="tasks.reset_monthly_counts",
    bind=True,
    max_retries=3,
    default_retry_delay=60,
)
def reset_monthly_counts(self):
    logger.info("reset_monthly_counts PROCESSING task_id=%s", self.request.id)
    try:
        asyncio.run(_reset_monthly())
        logger.info("reset_monthly_counts SUCCESS task_id=%s", self.request.id)
    except Exception as exc:
        logger.error("reset_monthly_counts FAILED task_id=%s error=%s", self.request.id, exc)
        raise self.retry(exc=exc)


@celery_app.task(
    name="tasks.check_expired_subscriptions",
    bind=True,
    max_retries=3,
    default_retry_delay=60,
)
def check_expired_subscriptions(self):
    logger.info("check_expired_subscriptions PROCESSING task_id=%s", self.request.id)
    try:
        asyncio.run(_check_expired_subscriptions())
        logger.info("check_expired_subscriptions SUCCESS task_id=%s", self.request.id)
    except Exception as exc:
        logger.error("check_expired_subscriptions FAILED task_id=%s error=%s", self.request.id, exc)
        raise self.retry(exc=exc)


celery_app.conf.beat_schedule = {
    "reset-daily-counts": {
        "task": "tasks.reset_daily_counts",
        "schedule": crontab(hour=0, minute=0),
        "options": {"queue": "low_priority"},
    },
    "reset-monthly-counts": {
        "task": "tasks.reset_monthly_counts",
        "schedule": crontab(day_of_month=1, hour=0, minute=0),
        "options": {"queue": "low_priority"},
    },
    "check-expired-subscriptions": {
        "task": "tasks.check_expired_subscriptions",
        "schedule": crontab(hour=0, minute=0),
        "options": {"queue": "low_priority"},
    },
}
