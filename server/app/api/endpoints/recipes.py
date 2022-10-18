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

import app.schemas.pagination as p
import app.schemas.recipe as schemas
from app.api.deps import Pagination, get_current_user
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


@router.get("", response_model=p.RecipePage)
async def list_recipes(
    sorting: schemas.RecipeSorting = "created_at", pagination: Pagination = Depends()
) -> Any:
    query = Recipe.all().annotate(likes_count=Count("likes__id"))
    if sorting == "created_at":
        query = query.order_by("-created_at")
    else:
        query = query.order_by("-likes_count", "-created_at")
    query = query.offset(pagination.get_offset()).limit(pagination.get_limit())
    results_count = await query.limit(pagination.get_limit() + 1).count()
    recipes = await RecipeList_Pydantic.from_queryset(query)
    previous_page, next_page = pagination.get_previous_and_next_pages(results_count)
    return p.RecipePage(
        data=recipes,
        cursor={
            "previous_page": previous_page,
            "next_page": next_page,
        },
    )


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


@router.patch("/{recipe_id}")
async def update_recipe(
    recipe_id: UUID,
    recipe_data: schemas.UpdateRecipe,
    user: User = Depends(get_current_user),
) -> Any:
    recipe = await Recipe.get_or_none(id=recipe_id).prefetch_related("created_by")
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found"
        )
    if recipe.created_by != user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to edit this recipe",
        )
    if recipe_data.title:
        recipe.title = recipe_data.title
    if recipe_data.content_md:
        recipe.content = recipe_data.content_md
    await recipe.save()
    return {
        "ok": True,
        "message": "Recipe updated successfully",
    }


@router.delete("/{recipe_id}")
async def delete_recipe(
    recipe_id: UUID,
    user: User = Depends(get_current_user),
) -> Any:
    recipe = await Recipe.get_or_none(id=recipe_id).prefetch_related("created_by")
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found",
        )
    if recipe.created_by != user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to delete this recipe",
        )
    await recipe.delete()
    return {
        "ok": True,
        "message": "Recipe deleted successfully",
    }
