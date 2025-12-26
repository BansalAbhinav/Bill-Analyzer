import pdfplumber
from PIL import Image
from schema import PDFExtractResponse, PageContent
from ocr import ocr_image
from utils import clean_text

def extract_pdf(file_path: str) -> PDFExtractResponse:
    pages_content = []
    extracted_via = "text"

    with pdfplumber.open(file_path) as pdf:
        for i, page in enumerate(pdf.pages):
            text = page.extract_text()

            if not text or text.strip() == "":
                extracted_via = "ocr"
                image = page.to_image(resolution=300).original
                text = ocr_image(image)

            pages_content.append(
                PageContent(
                    page_number=i + 1,
                    text=clean_text(text or "")
                )
            )

    return PDFExtractResponse(
        file_name=file_path.split("/")[-1],
        total_pages=len(pages_content),
        extracted_via=extracted_via,
        pages=pages_content
    )
