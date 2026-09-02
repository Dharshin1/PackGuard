import cv2
import numpy as np
import logging
from typing import Dict, Tuple, List

logger = logging.getLogger(__name__)

def enhance_and_sharpen_image(img_gray: np.ndarray) -> np.ndarray:
    """
    Applies 2x Super-Resolution interpolation and unsharp kernel sharpening
    to boost contrast and clarity on tiny Rule 7 fonts.
    """
    try:
        h, w = img_gray.shape[:2]

        # 1. 2x Bicubic Upscaling if resolution is low
        if w < 1600 or h < 1200:
            scale_factor = 2.0
            new_w = int(w * scale_factor)
            new_h = int(h * scale_factor)
            upscaled = cv2.resize(img_gray, (new_w, new_h), interpolation=cv2.INTER_CUBIC)
        else:
            upscaled = img_gray

        # 2. CLAHE Contrast Enhancement
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
        enhanced = clahe.apply(upscaled)

        # 3. Unsharp Masking (Sharpening Kernel)
        sharpen_kernel = np.array([
            [0, -1, 0],
            [-1, 5, -1],
            [0, -1, 0]
        ], dtype=np.float32)
        sharpened = cv2.filter2D(enhanced, -1, sharpen_kernel)

        return sharpened
    except Exception as e:
        logger.warning(f"Sharpening failed: {e}")
        return img_gray

def extract_roi_crops(img_gray: np.ndarray) -> List[np.ndarray]:
    """
    Uses OpenCV contour detection to locate and crop high-density text clusters
    (PDP Label area, price stamp, net qty block) for targeted multi-pass OCR.
    """
    crops = []
    try:
        h, w = img_gray.shape[:2]

        # Morphological dilation to connect adjacent text characters into blocks
        blur = cv2.GaussianBlur(img_gray, (5, 5), 0)
        _, thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (15, 5))
        dilated = cv2.dilate(thresh, kernel, iterations=2)

        contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        min_area = (w * h) * 0.01  # Ignore tiny noise artifacts
        max_area = (w * h) * 0.85  # Ignore whole image bounding box

        for cnt in contours:
            area = cv2.contourArea(cnt)
            if min_area < area < max_area:
                x, y, bw, bh = cv2.boundingRect(cnt)
                # Add padding
                pad_x = int(bw * 0.05)
                pad_y = int(bh * 0.05)
                x1 = max(0, x - pad_x)
                y1 = max(0, y - pad_y)
                x2 = min(w, x + bw + pad_x)
                y2 = min(h, y + bh + pad_y)

                crop = img_gray[y1:y2, x1:x2]
                if crop.shape[0] > 20 and crop.shape[1] > 40:
                    crops.append(crop)

        # Limit to top 5 most prominent ROI crops
        crops = sorted(crops, key=lambda c: c.shape[0] * c.shape[1], reverse=True)[:5]
    except Exception as err:
        logger.warning(f"ROI crop extraction error: {err}")

    return crops

def preprocess_image_opencv(image_bytes: bytes) -> Tuple[np.ndarray, List[np.ndarray], Dict[str, str]]:
    """
    OpenCV computer vision preprocessing pipeline:
    1. Decode bytes into BGR image array
    2. Convert to grayscale & 2x Super-Resolution Sharpening
    3. Adaptive thresholding & ROI contour bounding-box cropping
    """
    try:
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            raise ValueError("Failed to decode image bytes with OpenCV.")

        h, w = img.shape[:2]
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Apply 2x Super-Resolution & Sharpening
        sharpened_gray = enhance_and_sharpen_image(gray)

        # Extract text ROI crops
        roi_crops = extract_roi_crops(sharpened_gray)

        metadata = {
            "width": w,
            "height": h,
            "enhancedWidth": sharpened_gray.shape[1],
            "enhancedHeight": sharpened_gray.shape[0],
            "status": "CV Preprocessed & Super-Resolved Successfully",
            "roiCropsDetected": len(roi_crops)
        }

        return sharpened_gray, roi_crops, metadata
    except Exception as e:
        logger.error(f"OpenCV preprocessing error: {e}")
        dummy = np.zeros((600, 800), dtype=np.uint8)
        return dummy, [], {"width": 800, "height": 600, "status": "CV Fallback Activated", "roiCropsDetected": 0}
