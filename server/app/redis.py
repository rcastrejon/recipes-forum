import fastapi_plugins

from app.core.config import get_settings


@fastapi_plugins.registered_configuration
class AppSettings(fastapi_plugins.RedisSettings):
    redis_url: str = get_settings().REDIS_URL


config = fastapi_plugins.get_config()
