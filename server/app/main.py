from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_plugins import redis_plugin
from tortoise.contrib.fastapi import register_tortoise

from app.api.router import api_router
from app.core import get_settings
from app.redis import config


def get_application() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title=settings.APPLICATION_NAME)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    register_tortoise(
        app,
        db_url=settings.DATABASE_URL,
        modules={"models": ["app.models"]},
        generate_schemas=True,
    )

    app.include_router(api_router)
    return app


app = get_application()


@app.on_event("startup")
async def on_startup() -> None:
    await redis_plugin.init_app(app, config=config)
    await redis_plugin.init()


@app.on_event("shutdown")
async def on_shutdown() -> None:
    await redis_plugin.terminate()
