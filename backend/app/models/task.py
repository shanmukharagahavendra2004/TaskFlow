import uuid
from datetime import datetime, timezone
from typing import Optional

import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Task(Base):
    __tablename__ = "tasks"

  
    id: Mapped[str] = mapped_column(
        sa.String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )


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


    owner_id: Mapped[str] = mapped_column(
        sa.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )


    created_at: Mapped[datetime] = mapped_column(
        sa.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    updated_at: Mapped[datetime] = mapped_column(
        sa.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


    owner = relationship(
        "User",
        back_populates="tasks",
    )

    def __repr__(self) -> str:
        return f"<Task id={self.id} title={self.title} status={self.status}>"
