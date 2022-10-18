from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from tortoise.exceptions import IntegrityError

import app.schemas.auth as schemas
import app.schemas.responses as r
from app.api.deps import get_current_user
from app.core import Settings, get_settings
from app.models import User

router = APIRouter()


@router.post("/register", response_model=r.OkMessage)
async def register_user(register_data: schemas.RegisterUser) -> Any:
    new_user = User.ctor(
        username=register_data.username,
        plain_password=register_data.password.get_secret_value(),
        display_name=register_data.display_name,
    )
    try:
        await new_user.save()
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists"
        )
    return {
        "ok": True,
        "message": "User created successfully",
    }


@router.post("/login", response_model=schemas.AccessTokenOut)
async def get_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    settings: Settings = Depends(get_settings),
) -> Any:
    user = await User.get_or_none(username=form_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Incorrect username or password",
        )
    if not user.verify_plain_password(form_data.password):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Incorrect username or password",
        )
    return {
        "token_type": "bearer",
        "access_token": user.generate_jwt_token(settings.ACCESS_TOKEN_SECRET),
    }


@router.get("/is_authenticated", response_model=r.OkMessage)
async def is_authenticated(_: User = Depends(get_current_user)) -> Any:
    return {
        "ok": True,
        "message": "User is authenticated",
    }
