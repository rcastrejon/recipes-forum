from typing import Optional

from tortoise.expressions import RawSQL
from tortoise.functions import Count
from tortoise.queryset import QuerySet

from app.models import Recipe, User


def build_recipe_query(user: Optional[User] = None) -> QuerySet[Recipe]:
    if user:
        query = Recipe.annotate(
            likes_count=Count("likes__id"),
            liked=RawSQL(f"(SELECT `has_user_liked_recipe`('{user.id}', recipe.id))"),
        )
    else:
        query = Recipe.annotate(likes_count=Count("likes__id"))
    return query
