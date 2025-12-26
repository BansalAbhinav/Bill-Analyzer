# Python Setup for Bill Analyzer

## Prerequisites

- Python 3.8+ installed on your system
- Tesseract OCR installed (for OCR functionality)
  - Windows: Download from https://github.com/UB-Mannheim/tesseract/wiki
  - Install to `C:\Program Files\Tesseract-OCR\` or update path in `ocr_extractor.py`

## Setup Virtual Environment

1. **Create virtual environment:**

   ```bash
   cd backend/python
   python -m venv venv
   ```

2. **Activate virtual environment:**
   - Windows PowerShell:
     ```bash
     .\venv\Scripts\Activate.ps1
     ```
   - Windows CMD:
     ```bash
     venv\Scripts\activate.bat
     ```
   - Linux/Mac:
     ```bash
     source venv/bin/activate
     ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

## Why Virtual Environment?

✅ **Isolated dependencies** - Won't conflict with system Python or other projects
✅ **Reproducible** - Same versions across development and production
✅ **Clean** - Easy to reset by deleting venv folder
✅ **Professional** - Industry standard best practice

## Project Structure

```
backend/
├── python/
│   ├── venv/              # Virtual environment (git ignored)
│   ├── cli_extract.py     # CLI script called by Node.js
│   ├── requirements.txt   # Python dependencies
│   └── extractor/
│       ├── extract_text.py
│       ├── ocr_extractor.py
│       └── ...
└── server/                # Express backend
```

## How It Works

1. Express receives PDF upload
2. Saves file to `uploads/` directory
3. Spawns Python process from virtual environment
4. Python extracts text and returns JSON
5. Express sends response to client
