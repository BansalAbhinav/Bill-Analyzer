import pytesseract
from PIL import Image

# HARD SET tesseract path (Windows)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def ocr_image(image: Image.Image) -> str:
    return pytesseract.image_to_string(image, lang="eng")
