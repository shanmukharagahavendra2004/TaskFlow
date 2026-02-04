from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.schemas.user import UserRegister, UserLogin, TokenResponse, UserOut
from app.utils.hashing import hash_password, verify_password, create_access_token


class AuthService:
    """Stateless helper – instantiate once per request or use class-methods."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def register(self, payload: UserRegister) -> TokenResponse:
        # 1. duplicate-email check
        result = await self.db.execute(
            select(User).where(User.email == payload.email)
        )
        if result.scalar_one_or_none() is not None:
            raise ValueError("An account with this email already exists")

        # 2. persist
        user = User(
            email=payload.email,
            hashed_password=hash_password(payload.password),
            full_name=payload.full_name,
            role="user",                          # new users are always 'user'
        )
        self.db.add(user)
        await self.db.flush()                     # get the generated id

        # 3. sign token
        token = create_access_token({"sub": user.id, "role": user.role})

        return TokenResponse(
            access_token=token,
            user=UserOut.model_validate(user),
        )


    async def login(self, payload: UserLogin) -> TokenResponse:
        result = await self.db.execute(
            select(User).where(User.email == payload.email)
        )
        user = result.scalar_one_or_none()

        if user is None or not verify_password(payload.password, user.hashed_password):
            raise PermissionError("Invalid email or password")

        token = create_access_token({"sub": user.id, "role": user.role})

        return TokenResponse(
            access_token=token,
            user=UserOut.model_validate(user),
        )
