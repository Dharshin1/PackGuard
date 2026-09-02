import os
import uuid
import logging
from config import UPLOAD_DIR, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

logger = logging.getLogger(__name__)

# Check Cloudinary Availability
HAS_CLOUDINARY = False
if CLOUDINARY_CLOUD_NAME and CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET:
    try:
        import cloudinary
        import cloudinary.uploader
        cloudinary.config(
            cloud_name=CLOUDINARY_CLOUD_NAME,
            api_key=CLOUDINARY_API_KEY,
            api_secret=CLOUDINARY_API_SECRET
        )
        HAS_CLOUDINARY = True
        logger.info("Cloudinary storage initialized.")
    except Exception as e:
        logger.warning(f"Failed to configure Cloudinary: {e}")

async def save_image_file(file_bytes: bytes, filename: str, base_url: str = "http://localhost:8000") -> str:
    """
    Uploads file to Cloudinary if credentials are configured;
    otherwise saves locally to backend/uploads and returns local static URL.
    """
    if HAS_CLOUDINARY:
        try:
            import cloudinary.uploader
            res = cloudinary.uploader.upload(file_bytes, folder="packguard_inspections")
            return res.get("secure_url")
        except Exception as err:
            logger.warning(f"Cloudinary upload failed: {err}. Falling back to local storage.")

    # Local storage fallback
    ext = os.path.splitext(filename)[1] or ".jpg"
    unique_filename = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    with open(file_path, "wb") as f:
        f.write(file_bytes)

    return f"{base_url.rstrip('/')}/uploads/{unique_filename}"
