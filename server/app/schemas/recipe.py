from types import MappingProxyType
from typing import Any, Literal, Mapping

from fastapi import Form
from pydantic import BaseModel, ConstrainedStr

RecipeSorting = Literal["created_at", "likes_count"]

TITLE_FIELD: Mapping[str, Any] = MappingProxyType(
    {
        "min_length": 3,
        "max_length": 75,
    }
)

CONTENT_FIELD: Mapping[str, Any] = MappingProxyType(
    {
        "min_length": 1,
    }
)


class TitleField(ConstrainedStr):
    min_length = TITLE_FIELD["min_length"]
    max_length = TITLE_FIELD["max_length"]


class ContentField(ConstrainedStr):
    min_length = CONTENT_FIELD["min_length"]


class CreateRecipe(BaseModel):
    title: TitleField
    content_md: ContentField

    @classmethod
    def as_form(
        cls,
        title: str = Form(**TITLE_FIELD),
        content_md: str = Form(**CONTENT_FIELD),
    ) -> Any:
        return cls(title=title, content_md=content_md)
