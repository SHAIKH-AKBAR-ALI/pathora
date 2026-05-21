import logging

from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from jose import JWTError, jwt
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from starlette.exceptions import HTTPException as StarletteHTTPException

from backend.core.config import settings

logger = logging.getLogger(__name__)


def get_user_key(request: Request) -> str:
    """Rate limit key: JWT user_id from cookie, fallback to client IP."""
    token = request.cookies.get("access_token")
    if token:
        try:
            payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
            user_id = payload.get("sub")
            if user_id:
                return f"user:{user_id}"
        except (JWTError, Exception):
            pass
    return get_remote_address(request)


def get_ip_key(request: Request) -> str:
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


async def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded) -> JSONResponse:
    return JSONResponse(
        status_code=429,
        content={"success": False, "data": None, "error": "Rate limit exceeded"},
    )


async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled exception on %s %s: %s", request.method, request.url.path, exc)
    return JSONResponse(
        status_code=500,
        content={"success": False, "data": None, "error": "Internal server error"},
    )


async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "data": None, "error": exc.detail},
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    messages = []
    for error in exc.errors():
        loc = " → ".join(str(part) for part in error["loc"] if part != "body")
        messages.append(f"{loc}: {error['msg']}" if loc else error["msg"])
    return JSONResponse(
        status_code=422,
        content={"success": False, "data": None, "error": "; ".join(messages)},
    )
