from typing import Generic, Optional, TypeVar

from pydantic.generics import BaseModel, GenericModel

from app.models import RecipeList_Pydantic

T = TypeVar("T")


class Cursor(BaseModel):
    previous_page: Optional[int] = None
    next_page: Optional[int] = None


class Page(GenericModel, Generic[T]):
    data: T
    cursor: Cursor


RecipePage = Page[RecipeList_Pydantic]  # type: ignore
