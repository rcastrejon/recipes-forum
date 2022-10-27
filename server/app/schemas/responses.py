from pydantic import BaseModel


class OkMessage(BaseModel):
    ok: bool
    message: str

    class Config:
        schema_extra = {
            "example": {
                "ok": True,
                "message": "This is a success message",
            }
        }


class AccessToken(BaseModel):
    token_type: str
    access_token: str

    class Config:
        schema_extra = {
            "example": {
                "token_type": "bearer",
                "access_token": "example_access_token",
            }
        }
