from pydantic import BaseModel


class User(BaseModel):
    username: str
    display_name: str
    recipe_count: int
    likes_count: int

    class Config:
        orm_mode = True
