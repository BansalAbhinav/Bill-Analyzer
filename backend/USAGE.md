# 🚀 Single Endpoint - Complete Document Processing

## One Endpoint Does Everything!

**POST** `/api/v1/data/process`

### What It Does:

1. ✅ Accepts PDF or Image upload
2. ✅ Extracts text automatically
3. ✅ Analyzes with Gemini AI
4. ✅ Saves both extracted text and analysis
5. ✅ Returns everything in one response

---

## 📤 How to Use

### Basic Usage (with default prompt):

```bash
curl -X POST http://localhost:3000/api/v1/data/process \
  -F "file=@invoice.pdf"
```

### With Custom Prompt:

```bash
curl -X POST http://localhost:3000/api/v1/data/process \
  -F "file=@receipt.jpg" \
  -F "customPrompt=Extract only: vendor name, date, total amount, and items list"
```

### Supported File Types:

- 📄 PDF files
- 🖼️ Images: JPG, JPEG, PNG

---

## 📥 Response Format

```json
{
  "success": true,
  "data": {
    "extraction": {
      "fileName": "invoice.pdf",
      "totalPages": 2,
      "extractedVia": "text",
      "extractedTextFile": "extracted-1766732556294.txt"
    },
    "analysis": {
      "result": "Document Type: Invoice\nVendor: ABC Company\nDate: 2024-01-15\nTotal: $1,234.56\n...",
      "savedFile": "analysis-1766732600000.txt",
      "promptUsed": "bill_analysis_prompt.txt"
    },
    "extractedText": "Full clean text from document..."
  }
}
```

---

## 🎯 Use Cases

### 1. Invoice Processing

```javascript
const formData = new FormData();
formData.append("file", invoiceFile);

const response = await fetch("/api/v1/data/process", {
  method: "POST",
  body: formData,
});

const data = await response.json();
console.log(data.data.analysis.result); // Get AI analysis
```

### 2. Receipt Scanning

```javascript
// From mobile camera or scanner
formData.append("file", receiptImage);
formData.append("customPrompt", "Extract: store name, date, items, and total");
```

### 3. Bill Analysis

```javascript
// PDF bill upload
formData.append("file", billPDF);
// Uses default prompt for comprehensive analysis
```

---

## 📂 Saved Files

All files saved in `backend/server/uploads/`:

1. **Extracted Text**: `extracted-[timestamp].txt`
   - Clean text extracted from document
   - Ready for further processing

2. **AI Analysis**: `analysis-[timestamp].txt`
   - Complete AI analysis report
   - Includes both analysis and original text
   - Formatted for easy reading

---

## ⚡ Why This Approach?

✅ **Simple**: One API call does everything  
✅ **Fast**: Python extraction + Gemini in 3-5 seconds  
✅ **Clean**: Original file deleted immediately  
✅ **Flexible**: Custom prompts supported  
✅ **Production Ready**: Error handling included

---

## 🔧 Customization

Edit the default analysis prompt:

```
backend/server/prompts/bill_analysis_prompt.txt
```

Or send custom prompt in request:

```javascript
formData.append("customPrompt", "Your custom instructions here");
```

---

## 💡 Example: Frontend Integration

```html
<input type="file" id="fileInput" accept=".pdf,.jpg,.jpeg,.png" />
<button onclick="processDocument()">Process</button>

<script>
  async function processDocument() {
    const file = document.getElementById("fileInput").files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/v1/data/process", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        console.log("Analysis:", result.data.analysis.result);
        console.log("Extracted Text:", result.data.extractedText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
</script>
```

---

## 🎉 That's It!

One endpoint. One call. Everything done.
