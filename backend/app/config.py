"""
app/config.py
─────────────
Centralised settings loaded from .env via Pydantic-Settings.
Every piece of configuration lives here; no os.getenv() anywhere else.
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # ── Database ──────────────────────────────────
    DATABASE_URL: str = "postgresql+asyncpg://postgres:123@localhost:5432/tasks"

    # ── JWT ───────────────────────────────────────
    JWT_SECRET_KEY: str = "change-me-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # ── CORS ──────────────────────────────────────
    CORS_ORIGINS: str = "http://localhost:3000"

    model_config = {"env_file": ".env"}


# singleton – import this everywhere
settings = Settings()
