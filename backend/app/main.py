"""
app/main.py
───────────
FastAPI application factory.

Responsibilities
────────────────
1. CORS middleware (origins from Settings)
2. Mount versioned routers under /api/v1/
3. Global exception handlers for clean JSON errors
4. Async lifespan that creates tables on first start (dev convenience)
"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from app.config import settings
from app.database import engine, Base
from app.routers import auth, tasks

# ── import models so Base.metadata knows about them ─
from app.models import user as _user_model, task as _task_model  # noqa: F401


# ── lifespan (replaces on_event) ──────────────────
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator:
    """Create tables on startup if they don't exist (dev only)."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # optional: drop tables on shutdown for testing
    # async with engine.begin() as conn:
    #     await conn.run_sync(Base.metadata.drop_all)


# ── app factory ───────────────────────────────────
def create_app() -> FastAPI:
    app = FastAPI(
        title="Task Manager API",
        description="Scalable REST API with JWT auth and role-based access.",
        version="1.0.0",
        lifespan=lifespan,
    )

    # ── CORS ──────────────────────────────────────
    origins = [o.strip() for o in settings.CORS_ORIGINS.split(",")]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── versioned routers ─────────────────────────
    app.include_router(auth.router, prefix="/api/v1")
    app.include_router(tasks.router, prefix="/api/v1")

    # ── health check ──────────────────────────────
    @app.get("/health", status_code=status.HTTP_200_OK)
    async def health():
        return {"status": "ok"}

    # ── global exception handlers ─────────────────
    @app.exception_handler(ValidationError)
    async def validation_exception_handler(request: Request, exc: ValidationError):
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "success": False,
                "message": "Validation error",
                "errors": exc.errors(),
            },
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception):
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"success": False, "message": "Internal server error"},
        )

    return app
