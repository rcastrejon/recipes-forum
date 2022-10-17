from functools import lru_cache

from pydantic import AnyHttpUrl, BaseSettings, PostgresDsn


class Settings(BaseSettings):
    APPLICATION_NAME: str = "FastAPI"
    API_URL: AnyHttpUrl = "http://localhost:8000"  # type: ignore

    DATABASE_URL: PostgresDsn

    ACCESS_TOKEN_SECRET: str

    class Config:
        case_sensitive = True
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()
