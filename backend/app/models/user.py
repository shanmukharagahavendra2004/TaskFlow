import uuid
from datetime import datetime, timezone

import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class User(Base):
    __tablename__ = "users"

  
    id: Mapped[str] = mapped_column(
        sa.String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )

  
    email: Mapped[str] = mapped_column(
        sa.String(255), unique=True, nullable=False, index=True
    )
    hashed_password: Mapped[str] = mapped_column(
        sa.String(255), nullable=False
    )

  
    full_name: Mapped[str] = mapped_column(
        sa.String(100), nullable=False
    )
    role: Mapped[str] = mapped_column(
        sa.String(10), nullable=False, default="user"
    )

    # /api/v1/auth/register HTTP/1.1"
    created_at: Mapped[datetime] = mapped_column(
        sa.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at: Mapped[datetime] = mapped_column(
        sa.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    tasks = sa.orm.relationship(
        "Task", back_populates="owner", lazy="selectin"
    )

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email} role={self.role}>"
