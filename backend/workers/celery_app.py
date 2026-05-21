from celery import Celery
from kombu import Queue

from backend.core.config import settings

celery_app = Celery(
    "pathora",
    broker=settings.upstash_redis_url,
    backend=settings.upstash_redis_url,
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    enable_utc=True,
    broker_use_ssl={"ssl_cert_reqs": "required"} if settings.upstash_redis_url.startswith("rediss://") else {},
    redis_backend_use_ssl={"ssl_cert_reqs": "required"} if settings.upstash_redis_url.startswith("rediss://") else {},
    task_queues=(
        Queue("high_priority"),
        Queue("low_priority"),
    ),
    task_default_queue="low_priority",
    task_track_started=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    task_reject_on_worker_lost=True,
    broker_connection_retry_on_startup=True,
)
