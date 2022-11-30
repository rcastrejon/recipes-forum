from typing import Any
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status

import app.schemas.responses as r
from app.api.deps import get_current_user
from app.models import Like, Recipe, User

router = APIRouter()


@router.post("/recipes/{recipe_id}/likes", response_model=r.OkMessage)
async def user_liked_recipe(
    recipe_id: UUID, user: User = Depends(get_current_user)
) -> Any:
    recipe = await Recipe.get_or_none(id=recipe_id)
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found"
        )
    _, was_created = await Like.get_or_create(user=user, recipe=recipe)
    if not was_created:
        return {
            "ok": False,
            "message": "You already liked this recipe",
        }
    return {
        "ok": True,
        "message": "Recipe liked successfully",
    }


@router.delete("/recipes/{recipe_id}/likes", response_model=r.OkMessage)
async def user_removed_like(
    recipe_id: UUID, user: User = Depends(get_current_user)
) -> Any:
    recipe = await Recipe.get_or_none(id=recipe_id)
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found"
        )
    like = await Like.get_or_none(user=user, recipe=recipe)
    if not like:
        return {
            "ok": False,
            "message": "You haven't liked this recipe",
        }
    await like.delete()
    return {
        "ok": True,
        "message": "Like removed successfully",
    }
