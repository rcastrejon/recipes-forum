import asyncio
import uuid
from operator import attrgetter
from typing import Any, AsyncIterator

from fastapi import APIRouter, Depends, HTTPException, status
from redis.asyncio.client import PubSub
from sse_starlette import EventSourceResponse

import app.utils.orm_extras as extras
from app.api.deps import get_user_optional
from app.models import Recipe, RecipeList_Pydantic, User
from app.redis import Redis, get_redis

router = APIRouter()


async def viewers_stream_connection(
    recipe_id: uuid.UUID,
    redis: Redis = Depends(get_redis),
) -> Any:
    does_recipe_exist = await Recipe.exists(id=recipe_id)
    if not does_recipe_exist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found"
        )

    key = f"recipe:{recipe_id}"
    pubsub = redis.pubsub()
    try:
        viewers = await redis.incr(key)
        await redis.publish(key, str(viewers))
        await pubsub.subscribe(key)
        yield (viewers, pubsub)
    finally:
        await pubsub.unsubscribe(key)
        viewers = await redis.decr(key)
        await redis.publish(key, str(viewers))
        if viewers < 1:
            await redis.delete(key)
        await pubsub.close()


@router.get("/{recipe_id}")
async def recipe_viewers_sse(
    stream_conn: tuple[int, PubSub] = Depends(viewers_stream_connection),
) -> EventSourceResponse:
    async def event_stream() -> AsyncIterator[dict]:
        initial_viewers, pubsub = stream_conn
        yield {"event": "update", "data": initial_viewers}
        while True:
            latest_message = None
            while msg := await pubsub.get_message(ignore_subscribe_messages=True):
                latest_message = msg
            if latest_message:
                viewers = latest_message["data"].decode("utf-8")
                yield {"event": "update", "data": viewers}
            await asyncio.sleep(10)

    return EventSourceResponse(event_stream())


@router.get("", response_model=RecipeList_Pydantic)
async def list_recipes_viewer_score(
    redis: Redis = Depends(get_redis),
    user: User = Depends(get_user_optional),
) -> Any:
    recipe_keys: list[str] = [
        key.decode("utf-8") for key in await redis.keys("recipe:*")
    ]
    ids_scores = {
        recipe_key.split(":", 1)[1]: await redis.get(recipe_key)
        for recipe_key in recipe_keys
    }
    recipe_query = extras.build_recipe_query(user).filter(id__in=ids_scores.keys())
    recipes = await RecipeList_Pydantic.from_queryset(recipe_query)
    recipe_list: list[Any] = recipes.__root__  # type: ignore
    for recipe in recipe_list:
        recipe.viewers = int(ids_scores[str(recipe.id)])  # type: ignore
    recipes.__root__ = sorted(  # type: ignore
        recipe_list, key=attrgetter("viewers"), reverse=True
    )
    return recipes
