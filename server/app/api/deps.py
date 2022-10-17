from datetime import datetime

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose.exceptions import JWTError
from tortoise.exceptions import DoesNotExist

import app.utils.auth as auth
from app.core import Settings, get_settings
from app.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


async def get_current_user(
    access_token: str = Depends(oauth2_scheme),
    settings: Settings = Depends(get_settings),
) -> User:
    try:
        payload = auth.decode_access_token(access_token, settings.ACCESS_TOKEN_SECRET)

        if datetime.fromtimestamp(payload.exp) < datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
        user = await User.get(id=payload.sub)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except DoesNotExist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user
