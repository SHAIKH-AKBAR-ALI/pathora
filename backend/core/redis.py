import logging

from redis.asyncio import Redis

from backend.core.config import settings

logger = logging.getLogger(__name__)

_client: Redis | None = None


def get_redis() -> Redis | None:
    global _client
    if _client is None and settings.upstash_redis_url:
        _client = Redis.from_url(settings.upstash_redis_url, decode_responses=True)
    return _client
