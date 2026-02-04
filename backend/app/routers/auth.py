"""
app/routers/auth.py
───────────────────
/api/v1/auth   – public registration & login
/api/v1/auth/me – protected "who am I?" endpoint
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.user import User
from app.schemas.user import UserRegister, UserLogin, TokenResponse, UserOut
from app.services.auth_service import AuthService
from app.utils.response import success_response, error_response

router = APIRouter(prefix="/auth", tags=["Authentication"])


# ── POST /api/v1/auth/register ────────────────────
@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(
    payload: UserRegister,
    db: AsyncSession = Depends(get_db),
):
    """Create a new user account and return a signed JWT."""
    try:
        token_data = await AuthService(db).register(payload)
        return success_response(
            message="Registration successful",
            data=token_data.model_dump(),
            status_code=status.HTTP_201_CREATED,
        )
    except ValueError as exc:
        return error_response(message=str(exc), status_code=status.HTTP_409_CONFLICT)


# ── POST /api/v1/auth/login ───────────────────────
@router.post("/login", status_code=status.HTTP_200_OK)
async def login(
    payload: UserLogin,
    db: AsyncSession = Depends(get_db),
):
    """Authenticate with email + password; return a signed JWT."""
    try:
        token_data = await AuthService(db).login(payload)
        return success_response(
            message="Login successful",
            data=token_data.model_dump(),
        )
    except PermissionError as exc:
        return error_response(message=str(exc), status_code=status.HTTP_401_UNAUTHORIZED)


# ── GET  /api/v1/auth/me ──────────────────────────
@router.get("/me", status_code=status.HTTP_200_OK)
async def get_me(
    current_user: User = Depends(get_current_user),
):
    """Return the authenticated user's profile (no password)."""
    return success_response(data=UserOut.model_validate(current_user).model_dump())
