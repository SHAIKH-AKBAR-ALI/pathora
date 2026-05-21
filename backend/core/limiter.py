from slowapi import Limiter

from backend.core.config import settings
from backend.core.middleware import get_user_key

limiter = Limiter(
    key_func=get_user_key,
    storage_uri=settings.upstash_redis_url if settings.upstash_redis_url else None,
)
