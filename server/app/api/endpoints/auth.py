from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from tortoise.exceptions import DoesNotExist, IntegrityError

import app.schemas.auth as schemas
from app.api.deps import get_current_user
from app.core import Settings, get_settings
from app.models import User

router = APIRouter()


@router.post("/register")
async def register_user(register_data: schemas.RegisterUser) -> Any:
    new_user = User(**register_data.dict(exclude_unset=True, exclude={"password"}))
    new_user.password = register_data.password.get_secret_value()
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


@router.post("/login")
async def get_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    settings: Settings = Depends(get_settings),
) -> Any:
    try:
        user = await User.get()
    except DoesNotExist:
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


@router.get("/is_authenticated")
async def is_authenticated(_: User = Depends(get_current_user)) -> Any:
    return {
        "ok": True,
        "message": "User is authenticated",
    }
