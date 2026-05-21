from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from starlette.exceptions import HTTPException as StarletteHTTPException

from backend.api.admin import router as admin_router
from backend.api.auth import router as auth_router
from backend.api.payment import router as payment_router
from backend.api.progress import router as progress_router
from backend.api.roadmap import router as roadmap_router
from backend.core.limiter import limiter
from backend.core.middleware import (
    global_exception_handler,
    http_exception_handler,
    rate_limit_exceeded_handler,
    validation_exception_handler,
)

# Production: run uvicorn with --proxy-headers --forwarded-allow-ips="*" behind NGINX
app = FastAPI(title="Nexpath API", version="1.0.0")
app.state.limiter = limiter

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)
app.add_exception_handler(Exception, global_exception_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)

app.include_router(auth_router)
app.include_router(roadmap_router)
app.include_router(progress_router)
app.include_router(payment_router)
app.include_router(admin_router)


@app.get("/health")
async def health_check():
    return {"success": True, "data": "Nexpath API running", "error": None}
