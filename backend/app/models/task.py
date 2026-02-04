"""
app/models/task.py
──────────────────
SQLAlchemy ORM – tasks table.
Each task belongs to exactly one user (FK → users.id).
"""

import uuid
from datetime import datetime, timezone
from typing import Optional

import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Task(Base):
    __tablename__ = "tasks"

    # ── primary key ───────────────────────────────
    id: Mapped[str] = mapped_column(
        sa.String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )

    # ── content ───────────────────────────────────
    title: Mapped[str] = mapped_column(
        sa.String(200),
        nullable=False,
    )

    description: Mapped[Optional[str]] = mapped_column(
        sa.Text,
        nullable=True,
    )

    priority: Mapped[str] = mapped_column(
        sa.String(10),
        nullable=False,
        default="medium",
    )

    status: Mapped[str] = mapped_column(
        sa.String(15),
        nullable=False,
        default="todo",
    )

    # ── ownership ─────────────────────────────────
    owner_id: Mapped[str] = mapped_column(
        sa.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # ── timestamps ────────────────────────────────
    created_at: Mapped[datetime] = mapped_column(
        sa.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    updated_at: Mapped[datetime] = mapped_column(
        sa.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # ── relationship ──────────────────────────────
    owner = relationship(
        "User",
        back_populates="tasks",
    )

    def __repr__(self) -> str:
        return f"<Task id={self.id} title={self.title} status={self.status}>"
