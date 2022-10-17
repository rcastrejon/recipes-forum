import re
from typing import Optional

from pydantic import BaseModel, ConstrainedStr, SecretStr, validator


class Username(ConstrainedStr):
    min_length = 3
    max_length = 15
    to_lower = True
    regex = re.compile("^[a-zA-Z0-9_]*$")


class DisplayName(ConstrainedStr):
    min_length = 1
    max_length = 50
    strip_whitespace = True


class RegisterUser(BaseModel):
    username: Username
    display_name: Optional[DisplayName] = None
    password: SecretStr

    @validator("password")
    def password_length(cls, value: SecretStr) -> SecretStr:
        if len(value.get_secret_value()) < 6:
            raise ValueError("Password must be at least 6 characters long")
        return value

    class Config:
        schema_extra = {
            "example": {
                "username": "john_doe",
                "display_name": "John Doe",
                "password": "secret_password",
            }
        }


class AccessTokenPayload(BaseModel):
    exp: float
    sub: str
