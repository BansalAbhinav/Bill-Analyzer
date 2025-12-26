from pydantic import BaseModel
from typing import List

class PageContent(BaseModel):
    page_number: int
    text: str

class PDFExtractResponse(BaseModel):
    file_name: str
    total_pages: int
    extracted_via: str  # "text" | "ocr"
    pages: List[PageContent]
