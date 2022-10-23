from typing import Any, Optional
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
from PIL import UnidentifiedImageError

import app.schemas.pagination as p
import app.schemas.recipe as schemas
import app.schemas.responses as r
import app.utils.img as img
import app.utils.sql_helpers as sql
from app.api.deps import Pagination, get_current_user, get_user_optional
from app.models import Recipe, Recipe_Pydantic, RecipeList_Pydantic, User

router = APIRouter()


@router.post("", response_model=r.OkMessage)
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
    try:
        b_thumbnail = img.create_thumbnail(thumbnail.file)
    except UnidentifiedImageError:
        return {
            "ok": False,
            "message": "Thumbnail image type not supported",
        }
    new_recipe = Recipe.ctor(
        title=recipe_data.title,
        content_md=recipe_data.content_md,
        thumbnail=b_thumbnail,
        thumbnail_media_type="image/jpeg",
        created_by=user,
    )
    await new_recipe.save()
    return {
        "ok": True,
        "message": "Recipe created successfully",
    }


@router.get("", response_model=p.RecipePage)
async def list_recipes(
    sorting: schemas.RecipeSorting = "created_at",
    pagination: Pagination = Depends(),
    user: Optional[User] = Depends(get_user_optional),
) -> Any:
    query = sql.build_recipe_query(user)
    if sorting == "created_at":
        query = query.order_by("-created_at")
    else:
        query = query.order_by("-likes_count", "-created_at")
    query = query.offset(pagination.offset)
    p1_count = await query.limit(pagination.limit + 1).count()
    recipes = await RecipeList_Pydantic.from_queryset(query.limit(pagination.limit))
    previous_page, next_page = pagination.get_previous_and_next_pages(p1_count)
    return p.RecipePage(
        data=recipes,
        cursor={
            "previous_page": previous_page,
            "next_page": next_page,
        },
    )


@router.get("/{recipe_id}", response_model=Recipe_Pydantic)
async def get_recipe(
    recipe_id: UUID, user: Optional[User] = Depends(get_user_optional)
) -> Any:
    recipe = await sql.build_recipe_query(user).get_or_none(id=recipe_id)
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
    recipe = await Recipe.get_or_none(id=recipe_id).values(
        "thumbnail", "thumbnail_media_type"
    )
    if not recipe or isinstance(recipe, list):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found",
        )
    return Response(
        content=recipe["thumbnail"], media_type=recipe["thumbnail_media_type"]
    )


@router.patch("/{recipe_id}", response_model=r.OkMessage)
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


@router.delete("/{recipe_id}", response_model=r.OkMessage)
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
