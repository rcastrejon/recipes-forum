from typing import Any
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import get_current_user
from app.models import Like, Recipe, User

router = APIRouter()


@router.post("/recipes/{recipe_id}/likes")
async def user_liked_recipe(
    recipe_id: UUID, user: User = Depends(get_current_user)
) -> Any:
    recipe = await Recipe.get_or_none(id=recipe_id)
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found"
        )
    if await user.likes.filter(recipe=recipe).exists():  # type: ignore
        return {
            "ok": False,
            "message": "You already liked this recipe",
        }
    await Like.create(user=user, recipe=recipe)
    return {
        "ok": True,
        "message": "Recipe liked successfully",
    }


@router.delete("/recipes/{recipe_id}/likes")
async def user_removed_like(
    recipe_id: UUID, user: User = Depends(get_current_user)
) -> Any:
    recipe = await Recipe.get_or_none(id=recipe_id)
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found"
        )
    like: Like = await user.likes.filter(recipe=recipe).first()  # type: ignore
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
