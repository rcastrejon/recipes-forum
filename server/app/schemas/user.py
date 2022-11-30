from pydantic import BaseModel


class User(BaseModel):
    username: str
    display_name: str
    recipe_count: int
    likes_count: int

    class Config:
        schema_extra = {
            "example": {
                "username": "john_doe",
                "display_name": "John Doe",
                "recipe_count": "1",
                "likes_count": "1",
            }
        }
