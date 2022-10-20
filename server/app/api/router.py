from fastapi import APIRouter

from app.api.endpoints import auth, likes, me, recipes

api_router = APIRouter()

api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(recipes.router, tags=["recipes"], prefix="/recipes")
api_router.include_router(likes.router, tags=["likes"])
api_router.include_router(me.router, tags=["me"], prefix="/me")
