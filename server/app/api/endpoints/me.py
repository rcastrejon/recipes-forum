from typing import Any

from fastapi import APIRouter, Depends
from tortoise.functions import Count

import app.schemas.pagination as p
from app.api.deps import Pagination, get_current_user
from app.models import Like, Recipe, RecipeList_Pydantic, User, User_Pydantic

router = APIRouter()


@router.get("", response_model=User_Pydantic)
async def get_logged_user(user: User = Depends(get_current_user)) -> Any:
    return await User_Pydantic.from_tortoise_orm(user)


@router.get("/recipes", response_model=p.RecipePage)
async def get_created_recipes(
    pagination: Pagination = Depends(), user: User = Depends(get_current_user)
) -> Any:
    query = user.recipes.all().offset(pagination.offset)  # type: ignore
    p1_count: int = await query.limit(pagination.limit + 1).count()
    recipes = await RecipeList_Pydantic.from_queryset(
        query.limit(pagination.limit).annotate(likes_count=Count("likes__id"))
    )
    previous_page, next_page = pagination.get_previous_and_next_pages(p1_count)
    return p.RecipePage(
        data=recipes,
        cursor={
            "previous_page": previous_page,
            "next_page": next_page,
        },
    )


@router.get("/likes", response_model=p.RecipePage)
async def get_liked_recipes(
    pagination: Pagination = Depends(),
    user: User = Depends(get_current_user),
) -> Any:
    liked_recipes = (
        await Like.filter(user=user)
        .order_by("-created_at")
        .offset(pagination.offset)
        .limit(pagination.limit + 1)
        .values_list("recipe_id", flat=True)
    )
    p1_count = len(liked_recipes)
    previous_page, next_page = pagination.get_previous_and_next_pages(p1_count)
    if next_page and isinstance(liked_recipes, list):
        liked_recipes.pop()

    recipe_query = Recipe.filter(id__in=liked_recipes).annotate(
        likes_count=Count("likes__id")
    )
    recipes = await RecipeList_Pydantic.from_queryset(recipe_query)
    index_map = {recipe_id: i for i, recipe_id in enumerate(liked_recipes)}
    recipes_list = recipes.__root__  # type: ignore
    recipes.__root__ = sorted(  # type: ignore
        recipes_list, key=lambda x: index_map[x.id]
    )
    return {
        "data": recipes,
        "cursor": {
            "previous_page": previous_page,
            "next_page": next_page,
        },
    }
