from datetime import datetime, timedelta

from jose import jwt
from passlib.context import CryptContext

import app.schemas.auth as schemas

ALGORITHM = "HS256"
password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class TokenExpiredException(RuntimeError):
    """Raised when a jwt token is expired and cannot be decoded anymore"""


def generate_hash_from_plain_password(plain_password: str) -> str:
    return password_context.hash(plain_password)


def verify_plain_password_against_hash(plain_password: str, password_hash: str) -> bool:
    return password_context.verify(plain_password, password_hash)


def generate_jwt_token(subject: str, secret_key: str, time_delta: int = 15) -> str:
    expires_delta = datetime.utcnow() + timedelta(minutes=time_delta)
    payload_to_encode = schemas.AccessTokenPayload(
        sub=subject, exp=expires_delta.timestamp()
    )
    encoded_jwt = jwt.encode(payload_to_encode.dict(), secret_key, ALGORITHM)
    return encoded_jwt


def decode_jwt_token(token: str, secret_key: str) -> schemas.AccessTokenPayload:
    """
    Decode a jwt token and return the payload
    :raises TokenExpiredException: If the token is expired
    :raises jwt.JWTError: If the token is invalid
    """
    decoded_token = jwt.decode(token, secret_key, algorithms=[ALGORITHM])
    if datetime.fromtimestamp(decoded_token["exp"]) < datetime.utcnow():
        raise TokenExpiredException
    return schemas.AccessTokenPayload(**decoded_token)
