"""
app/database.py
───────────────
Async SQLAlchemy engine + session factory.
Uses the DATABASE_URL from centralised Settings.
"""

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

# ── engine ────────────────────────────────────────
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,                  # set True for SQL logging during dev
    pool_pre_ping=True,          # reconnect stale connections automatically
    pool_size=10,
    max_overflow=20,
)

# ── session factory ──────────────────────────────
async_session: sessionmaker[AsyncSession] = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

# ── ORM base ─────────────────────────────────────
Base = declarative_base()


# ── FastAPI dependency ────────────────────────────
async def get_db() -> AsyncSession:
    """Yield a single session per request, guaranteed to close."""
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
