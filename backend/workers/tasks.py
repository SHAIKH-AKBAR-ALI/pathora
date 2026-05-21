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


# Celery beat schedule — attach to celery_app after tasks defined
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
}
