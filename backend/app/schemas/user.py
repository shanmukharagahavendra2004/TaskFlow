"""
app/schemas/user.py
───────────────────
Pydantic v2 schemas for the /auth endpoints.
Validation rules live here; models stay clean.
"""

from pydantic import BaseModel, EmailStr, field_validator
import re


# ── Register ──────────────────────────────────────
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain an uppercase letter")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain a lowercase letter")
        if not re.search(r"[0-9]", v):
            raise ValueError("Password must contain a digit")
        return v

    @field_validator("full_name")
    @classmethod
    def sanitise_name(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2:
            raise ValueError("Full name must be at least 2 characters")
        if len(v) > 100:
            raise ValueError("Full name must be under 100 characters")
        # only letters, spaces, hyphens, apostrophes
        if not re.match(r"^[A-Za-z\s'\-]+$", v):
            raise ValueError("Full name contains invalid characters")
        return v


# ── Login ─────────────────────────────────────────
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# ── Response payloads ─────────────────────────────
class UserOut(BaseModel):
    id: str
    email: str
    full_name: str
    role: str

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
