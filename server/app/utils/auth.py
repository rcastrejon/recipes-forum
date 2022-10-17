from datetime import datetime, timedelta

from jose import jwt
from passlib.context import CryptContext

import app.schemas.auth as schemas

ALGORITHM = "HS256"
password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def generate_hash_from_plain_password(plain_password: str) -> str:
    return password_context.hash(plain_password)


def verify_plain_password_against_hash(plain_password: str, password_hash: str) -> bool:
    return password_context.verify(plain_password, password_hash)


def create_access_token(subject: str, secret_key: str, time_delta: int = 15) -> str:
    expires_delta = datetime.utcnow() + timedelta(time_delta)
    payload_to_encode = schemas.AccessTokenPayload(
        sub=subject, exp=expires_delta.timestamp()
    )
    encoded_jwt = jwt.encode(payload_to_encode.dict(), secret_key, ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str, secret_key: str) -> schemas.AccessTokenPayload:
    decoded_token = jwt.decode(token, secret_key, algorithms=[ALGORITHM])
    return schemas.AccessTokenPayload(**decoded_token)
