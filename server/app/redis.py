from typing import AsyncIterator

import redis.asyncio as redis
from redis.asyncio.client import Redis

from app.core.config import get_settings


async def get_redis() -> AsyncIterator[Redis]:
    client: Redis = redis.from_url(get_settings().REDIS_URL)
    try:
        yield client
    finally:
        await client.connection_pool.disconnect()
