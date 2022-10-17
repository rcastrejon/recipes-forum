from typing import Optional

import markdown as md
from tortoise import fields
from tortoise.models import Model

from app.utils import auth


class TimestampMixin:
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)


class CreatedAtMixin:
    created_at = fields.DatetimeField(auto_now_add=True)


class AbstractBase(TimestampMixin, Model):
    id = fields.UUIDField(pk=True)

    class Meta:
        abstract = True


class Like(CreatedAtMixin, Model):
    user: fields.ForeignKeyRelation["User"] = fields.ForeignKeyField(
        "models.User", related_name="likes"
    )
    post: fields.ForeignKeyRelation["Post"] = fields.ForeignKeyField(
        "models.Post", related_name="likes"
    )

    class Meta:
        unique_together = ("user", "post")


class User(AbstractBase):
    username = fields.CharField(max_length=15, unique=True)
    display_name: Optional[str] = fields.CharField(max_length=50, null=True)
    password_hash = fields.CharField(max_length=60)

    @property
    def password(self) -> str:
        raise AttributeError("password is not a readable attribute")

    @password.setter
    def password(self, plain_password: str) -> None:
        self.password_hash = auth.generate_hash_from_plain_password(plain_password)

    def verify_plain_password(self, plain_password: str) -> bool:
        return auth.verify_plain_password_against_hash(
            plain_password, self.password_hash
        )

    def generate_jwt_token(self, secret_key: str) -> str:
        return auth.create_access_token(str(self.id), secret_key)


class Post(AbstractBase):
    title = fields.CharField(max_length=75)
    content_md = fields.TextField()
    content_html = fields.TextField()

    thumbnail = fields.BinaryField()
    thumbnail_media_type = fields.CharField(max_length=50)

    def __init__(
        self, title: str, content_md: str, thumbnail: bytes, thumbnail_media_type: str
    ) -> None:
        self.title = title
        self.content = content_md
        self.thumbnail = thumbnail
        self.thumbnail_media_type = thumbnail_media_type

    @property
    def content(self) -> str:
        return self.content_html

    @content.setter
    def content(self, content_md: str) -> None:
        self.content_md = content_md
        self.content_html = md.markdown(content_md)
