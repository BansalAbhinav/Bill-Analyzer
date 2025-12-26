#!/usr/bin/env python3
"""
CLI script to extract text from PDF or image files.
Can be called from Node.js backend.
"""
import sys
import json
from pathlib import Path

# Add extractor to path
sys.path.insert(0, str(Path(__file__).parent / "extractor"))

from extractor.extract_text import extract_pdf
from extractor.ocr_extractor import ocr_image
from PIL import Image

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No file path provided"}))
        sys.exit(1)
    
    file_path = sys.argv[1]
    
    if not Path(file_path).exists():
        print(json.dumps({"error": f"File not found: {file_path}"}))
        sys.exit(1)
    
    try:
        file_ext = Path(file_path).suffix.lower()
        
        # Handle images
        if file_ext in ['.jpg', '.jpeg', '.png', '.bmp', '.tiff']:
            image = Image.open(file_path)
            text = ocr_image(image)
            result = {
                "file_name": Path(file_path).name,
                "total_pages": 1,
                "extracted_via": "ocr",
                "pages": [{"page_number": 1, "text": text}]
            }
            print(json.dumps(result))
        # Handle PDFs
        elif file_ext == '.pdf':
            result = extract_pdf(file_path)
            print(json.dumps(result.model_dump()))
        else:
            print(json.dumps({"error": f"Unsupported file type: {file_ext}"}))
            sys.exit(1)
            
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
