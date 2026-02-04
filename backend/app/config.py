from pydantic_settings import BaseSettings


class Settings(BaseSettings):
  
    DATABASE_URL: str = ""

   
    JWT_SECRET_KEY: str = ""
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

  
    CORS_ORIGINS: str = "http://localhost:3000"

    model_config = {"env_file": ".env"}


# singleton – import this everywhere
settings = Settings()
