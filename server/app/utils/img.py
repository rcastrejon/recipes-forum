from io import BytesIO
from typing import BinaryIO

from PIL import Image, ImageFilter


# Function that takes a file-like image of any format and creates a 1280x720 thumbnail
# with a blurred version of the original image as the background, and the original
# image in the foreground. The thumbnail is returned as a bytes object.
def create_thumbnail(input_image: BinaryIO) -> bytes:
    with Image.open(input_image) as img:
        width, height = img.size
        if width > height:
            new_width = 1280
            new_height = int(1280 * height / width)
        else:
            new_height = 720
            new_width = int(720 * width / height)
        img = img.convert("RGB")
        resized_img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        background = img.resize((1280, 720), Image.Resampling.NEAREST).filter(
            ImageFilter.GaussianBlur(radius=20)
        )
        background.paste(
            resized_img, (int((1280 - new_width) / 2), int((720 - new_height) / 2))
        )

        img_io = BytesIO()
        background.save(img_io, format="JPEG")
        return img_io.getvalue()
