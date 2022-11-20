import uuid
from abc import ABC
from typing import AsyncIterator, NamedTuple, Optional

from fastapi import Cookie, Depends, HTTPException, Query, status
from fastapi.security import OAuth2PasswordBearer
from fastapi_plugins import depends_redis
from jose.exceptions import JWTError
from redis.asyncio.client import PubSub, Redis
from tortoise.exceptions import DoesNotExist

from app.core import Settings, get_settings
from app.models import Recipe, User
from app.utils import jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")
optional_oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login", auto_error=False)


class CurrentUser(ABC):
    @classmethod
    async def decode_jwt_token_and_get_user(cls, token: str, secret: str) -> User:
        """
        Decode authentication token and return user object.
        :raises HTTPException: If token is invalid or user does not exist.
        """
        try:
            payload = jwt.decode_jwt_token(token, secret)
            return await User.get(id=payload.sub)
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        except jwt.TokenExpiredException:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
        except DoesNotExist:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )


class GetUser(CurrentUser):
    async def __call__(
        self,
        access_token: str = Depends(oauth2_scheme),
        settings: Settings = Depends(get_settings),
    ) -> User:
        return await self.decode_jwt_token_and_get_user(
            access_token, settings.ACCESS_TOKEN_SECRET
        )


class GetUserOptional(CurrentUser):
    async def __call__(
        self,
        access_token: Optional[str] = Depends(optional_oauth2_scheme),
        settings: Settings = Depends(get_settings),
    ) -> Optional[User]:
        if not access_token:
            return None
        return await self.decode_jwt_token_and_get_user(
            access_token, settings.ACCESS_TOKEN_SECRET
        )


class GetUserCookie(CurrentUser):
    async def __call__(
        self,
        refresh_token: str = Cookie(),
        settings: Settings = Depends(get_settings),
    ) -> User:
        return await self.decode_jwt_token_and_get_user(
            refresh_token, settings.REFRESH_TOKEN_SECRET
        )


get_current_user = GetUser()
get_user_optional = GetUserOptional()
get_current_user_cookie = GetUserCookie()


class Pagination:
    page: int
    limit: int
    offset: int

    def __init__(
        self,
        page: int = Query(1, ge=1, description="Page number"),
        limit: int = Query(20, ge=1, le=100, description="Number of items per page"),
    ) -> None:
        self.page = page
        self.limit = limit
        self.offset = (page - 1) * limit

    def get_previous_and_next_pages(
        self,
        limit_plus_one_count: int,
    ) -> "CursorPages":
        previous_page = self.page - 1 if self.page > 1 else None
        next_page = self.page + 1 if limit_plus_one_count > self.limit else None
        return self.CursorPages(previous_page, next_page)

    class CursorPages(NamedTuple):
        previous_page: Optional[int]
        next_page: Optional[int]


async def recipe_viewers_stream(
    recipe_id: uuid.UUID, redis: Redis = Depends(depends_redis)
) -> AsyncIterator[tuple[str, PubSub]]:
    if not Recipe.exists(id=recipe_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found",
        )

    key = f"recipe:{recipe_id}"
    pubsub = redis.pubsub()
    try:
        viewers = await redis.incr(key)
        await redis.publish(key, str(viewers))
        await pubsub.subscribe(key)
        yield (key, pubsub)
    finally:
        await pubsub.unsubscribe(key)
        viewers = await redis.decr(key)
        await redis.publish(key, str(viewers))
        if viewers < 1:
            await redis.delete(key)
