from typing import Any
from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    Response,
    UploadFile,
    status,
)
from tortoise.functions import Count

import app.schemas.recipe as schemas
from app.api.deps import get_current_user
from app.models import Recipe, Recipe_Pydantic, RecipeList_Pydantic, User

router = APIRouter()


@router.post("")
async def create_recipe(
    recipe_data: schemas.CreateRecipe = Depends(schemas.CreateRecipe.as_form),
    thumbnail: UploadFile = File(),
    user: User = Depends(get_current_user),
) -> Any:
    if "image/" not in thumbnail.content_type:
        return {
            "ok": False,
            "message": "Thumbnail must be an image",
        }
    b_thumbnail = await thumbnail.read()
    # TODO: Accept any image and then reduce its size using PIL
    if len(b_thumbnail) > 2097152:
        return {
            "ok": False,
            "message": "Thumbnail must be less than 2MB",
        }
    new_recipe = Recipe.new(
        title=recipe_data.title,
        content_md=recipe_data.content_md,
        thumbnail=b_thumbnail,
        thumbnail_media_type=thumbnail.content_type,
        created_by=user,
    )
    await new_recipe.save()
    return {
        "ok": True,
        "message": "Recipe created successfully",
    }


@router.get("", response_model=RecipeList_Pydantic)
async def list_recipes() -> Any:
    recipes = Recipe.all().annotate(likes_count=Count("likes__id"))
    print(recipes.as_query())
    return await RecipeList_Pydantic.from_queryset(recipes)


@router.get("/{recipe_id}", response_model=Recipe_Pydantic)
async def get_recipe(recipe_id: UUID) -> Any:
    recipe = await Recipe.get_or_none(id=recipe_id).annotate(
        likes_count=Count("likes__id")
    )
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found",
        )
    return await Recipe_Pydantic.from_tortoise_orm(recipe)


@router.get("/{recipe_id}/thumbnail")
async def get_recipe_thumbnail(
    recipe_id: UUID,
) -> Any:
    recipe = await Recipe.get_or_none(id=recipe_id)
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found",
        )
    return Response(content=recipe.thumbnail, media_type=recipe.thumbnail_media_type)
