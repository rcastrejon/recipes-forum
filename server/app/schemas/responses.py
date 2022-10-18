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
