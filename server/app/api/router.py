from typing import Any

from fastapi import APIRouter

api_router = APIRouter()


@api_router.get("/hello")
async def hello_world(world: str = "World") -> Any:
    return {"message": f"Hello, {world}!"}
