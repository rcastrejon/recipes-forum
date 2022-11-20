import asyncio
from operator import attrgetter
from typing import Any, AsyncIterator

from fastapi import APIRouter, Depends
from sse_starlette import EventSourceResponse

import app.utils.orm_extras as extras
from app.api.deps import (
    PubSub,
    Redis,
    depends_redis,
    get_user_optional,
    recipe_viewers_stream,
)
from app.models import RecipeList_Pydantic, User

router = APIRouter()


@router.get("/{recipe_id}")
async def get_recipe_viewers(
    viewers_stream: tuple[str, PubSub] = Depends(recipe_viewers_stream),
    redis: Redis = Depends(depends_redis),
) -> EventSourceResponse:
    async def event_stream() -> AsyncIterator[dict]:
        key, pubsub = viewers_stream
        yield {"event": "update", "data": await redis.get(key)}
        while True:
            if await pubsub.get_message(ignore_subscribe_messages=True, timeout=10):
                viewers = await redis.get(key)
                yield {"event": "update", "data": viewers}
            await asyncio.sleep(1)

    return EventSourceResponse(event_stream())


@router.get("", response_model=RecipeList_Pydantic)
async def list_recipes_viewer_score(
    redis: Redis = Depends(depends_redis),
    user: User = Depends(get_user_optional),
) -> Any:
    recipe_keys: list[str] = await redis.keys("recipe:*")
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
