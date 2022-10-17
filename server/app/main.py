from fastapi import FastAPI

from app.api.router import api_router
from app.core import get_settings


def get_application() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title=settings.APPLICATION_NAME)

    app.include_router(api_router)

    return app


app = get_application()
