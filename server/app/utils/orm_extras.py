from typing import Any, Optional

from tortoise.expressions import RawSQL
from tortoise.functions import Count
from tortoise.queryset import QuerySet

from app.models import Recipe, User


def build_recipe_query(
    user: Optional[User] = None,
    **filters: Any,
) -> QuerySet[Recipe]:
    if user:
        query = Recipe.annotate(
            likes_count=Count("likes__id"),
            liked=RawSQL(
                f'(SELECT true FROM "like" WHERE "like".recipe_id = recipe.id AND "like".user_id = \'{user.id}\')'  # noqa: E501
            ),
        )
    else:
        query = Recipe.annotate(likes_count=Count("likes__id"))
    if filters:
        query.filter(**filters)
    return query
