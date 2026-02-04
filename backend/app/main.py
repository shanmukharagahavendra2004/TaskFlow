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



@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator:
    """Create tables on startup if they don't exist (dev only)."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # optional: drop tables on shutdown for testing
    # async with engine.begin() as conn:
    #     await conn.run_sync(Base.metadata.drop_all)



def create_app() -> FastAPI:
    app = FastAPI(
        title="Task Manager API",
        description="Scalable REST API with JWT auth and role-based access.",
        version="1.0.0",
        lifespan=lifespan,
    )

   
    origins = [o.strip() for o in settings.CORS_ORIGINS.split(",")]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    
    app.include_router(auth.router, prefix="/api/v1")
    app.include_router(tasks.router, prefix="/api/v1")

   
    @app.get("/health", status_code=status.HTTP_200_OK)
    async def health():
        return {"status": "ok"}

  
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
