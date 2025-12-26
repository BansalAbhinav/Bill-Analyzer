# Bill Analyzer - Setup Guide

## Environment Variables

Add your Gemini API key to `.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**Get your Gemini API key:**

1. Go to https://makersuite.google.com/app/apikey
2. Create/sign in to your Google account
3. Click "Get API Key"
4. Copy and paste into `.env`

## API Endpoints

### 1. Extract Text from PDF

```bash
POST /data/extract
Content-Type: multipart/form-data
Body: file=<your_pdf_file>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "fileName": "invoice.pdf",
    "totalPages": 2,
    "extractedVia": "text",
    "textFile": "extracted-1766732556294.txt",
    "formattedText": "Clean extracted text..."
  }
}
```

### 2. Analyze Extracted Text with Gemini

```bash
POST /data/analyze
Content-Type: application/json
Body: {
  "textFile": "extracted-1766732556294.txt"
}
```

OR send text directly:

```json
{
  "extractedText": "Your text here..."
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "analysis": "Detailed bill analysis...",
    "savedFile": "analysis-1766732600000.txt",
    "promptUsed": "bill_analysis_prompt.txt"
  }
}
```

### 3. Use Custom Prompt

```bash
POST /data/analyze
Content-Type: application/json
Body: {
  "extractedText": "Your text...",
  "customPrompt": "Extract only vendor name and total amount"
}
```

## Workflow

**Option A: Two-step (Recommended for production)**

1. Extract text: `POST /data/extract` → Get `formattedText`
2. Analyze: `POST /data/analyze` with `extractedText`

**Option B: Direct analysis**
Send `formattedText` directly to `POST /data/analyze`

## Prompt Customization

Edit `backend/server/prompts/bill_analysis_prompt.txt` to customize the analysis format.

## Production Deployment

✅ **Why Direct Gemini API (not LangChain)?**

- Lighter weight (1 package vs 10+)
- Faster response times
- Simpler to debug
- Lower memory footprint
- Easier to deploy
- No version conflicts

✅ **Production Ready:**

- Error handling included
- Response caching via saved files
- API key from environment variables
- Works on any Node.js hosting (Vercel, Railway, Render, etc.)

## Cost Optimization

Using `gemini-1.5-flash`:

- ✅ FREE up to 15 requests/minute
- ✅ Fast responses (2-3 seconds)
- ✅ Perfect for bill/invoice analysis

Upgrade to `gemini-1.5-pro` for complex documents if needed.
