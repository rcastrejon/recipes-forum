from io import BytesIO
from typing import BinaryIO, NamedTuple

# import pyheif
from PIL import Image, ImageEnhance, ImageFilter


class Size(NamedTuple):
    width: int
    height: int


def create_thumbnail(input_image: BinaryIO, media_type: str) -> bytes:
    """
    Function that takes a file-like image of any format and creates a 1280x720 thumbnail
    with a blurred version of the original image as the background, and the original
    image in the foreground. The thumbnail is returned as a bytes object.

    :raises PIL.UnidentifiedImageError: If the input image is not a valid image.
    """
    if "heic" in media_type or "heif" in media_type:
        # heif_file = pyheif.read_heif(input_image)
        # img = Image.frombytes(
        #     heif_file.mode,
        #     heif_file.size,
        #     heif_file.data,
        #     "raw",
        #     heif_file.mode,
        #     heif_file.stride,
        # )
        raise NotImplementedError
    else:
        img = Image.open(input_image)
    width, height = img.size
    size_map = {
        "x_axis": Size(1280, int(1280 * height / width)),
        "y_axis": Size(int(720 * width / height), 720),
    }
    if width / height > 1280 / 720:
        new_size = size_map["x_axis"]
        other_size = size_map["y_axis"]
        box = (other_size.width // 2 - 640, 0, other_size.width // 2 + 640, 720)
    else:
        new_size = size_map["y_axis"]
        other_size = size_map["x_axis"]
        box = (0, other_size.height // 2 - 360, 1280, other_size.height // 2 + 360)
    img = img.convert("RGB")
    resized_img = img.resize(new_size, Image.Resampling.LANCZOS)
    background = (
        img.resize(other_size, Image.Resampling.NEAREST)
        .filter(ImageFilter.GaussianBlur(radius=20))
        .crop(box)
    )
    enhancer = ImageEnhance.Brightness(background)
    background = enhancer.enhance(0.90)
    background.paste(
        resized_img,
        (int((1280 - new_size.width) / 2), int((720 - new_size.height) / 2)),
    )

    img_io = BytesIO()
    background.save(img_io, format="JPEG")
    return img_io.getvalue()
