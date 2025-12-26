# 🚀 Quick Start Guide - Bill Analyzer

## Complete Setup (First Time)

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Install Node dependencies
npm install

# Setup Python virtual environment
cd python
python -m venv venv
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# Install Python packages
pip install -r requirements.txt

cd ..
```

### 2. Environment Variables

Create `backend/.env`:
```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install
```

## Running the App

### Terminal 1 - Backend
```bash
cd backend
node server/server.js
```
✅ Backend runs on: `http://localhost:8000`

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
✅ Frontend runs on: `http://localhost:5173`

## First Time Usage

### 1. Register an Account
- Go to `http://localhost:5173`
- Click "Get Started" or "Register"
- Fill in: Username, Email, Password
- Click "Register"

### 2. Upload Your First Bill
- You'll be redirected to `/upload` after registration
- Click "Choose a file"
- Select a PDF or image (JPG/PNG) of a hospital bill
- Click "Analyze Bill"
- Wait 5-10 seconds for AI analysis

### 3. View Results
- Results appear on the same page:
  - ✅ Positive points
  - ⚠️ Potential issues
  - 🏥 Insurance coverage notes
  - 💡 Recommendations

### 4. View History
- Click "History" in the nav bar
- See all your past analyses
- Click "View Details" for full analysis
- Delete analyses you don't need

## Testing the Flow

### Without Login (Public Pages)
```
✅ Home page (/)
✅ Login page (/login)
✅ Register page (/register)
❌ Upload page (/upload) → Redirects to /login
❌ History page (/history) → Redirects to /login
```

### After Login (All Pages)
```
✅ All pages accessible
✅ Bearer token automatically added to API calls
✅ Nav bar shows "Logout" button
```

## Common Issues

### Backend Won't Start
```bash
# Check MongoDB is running
# Check .env file exists with correct values
# Check port 8000 is not in use
```

### Python Extraction Fails
```bash
# Make sure virtual environment is activated
# Install missing packages:
cd backend/python
.\venv\Scripts\activate
pip install pdfplumber pytesseract pillow pydantic
```

### Frontend Can't Connect to Backend
```javascript
// Check baseURL in frontend/src/services/api.js
// Should be: http://localhost:8000
```

### "Unauthorized" Errors
```javascript
// Token might be invalid or expired
// Solution: Logout and login again
```

## Folder Structure Overview

```
bill anlyzer/
├── backend/
│   ├── server/
│   │   ├── server.js              # Main server file
│   │   ├── controllers/           # Request handlers
│   │   ├── routes/                # API routes
│   │   ├── models/                # MongoDB schemas
│   │   ├── services/              # Business logic (Gemini AI)
│   │   └── middlewares/           # Auth, error handling
│   │
│   ├── python/
│   │   ├── cli_extract.py         # PDF/image extraction script
│   │   ├── extractor/             # Extraction logic
│   │   ├── venv/                  # Python virtual environment
│   │   └── requirements.txt       # Python dependencies
│   │
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/            # Reusable UI
    │   ├── pages/                 # Main views
    │   ├── context/               # Global state
    │   ├── services/              # API calls
    │   └── App.jsx                # Main app with routes
    │
    └── package.json
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Create account
- `POST /api/v1/auth/login` - Get Bearer token

### Bill Analysis
- `POST /api/v1/data/process` - Upload & analyze (🔒 Protected)
- `GET /api/v1/data/analyses` - Get all analyses (🔒 Protected)
- `GET /api/v1/data/analysis/:id` - Get one analysis (🔒 Protected)
- `DELETE /api/v1/data/analysis/:id` - Delete analysis (🔒 Protected)

## What Happens When You Upload

```
1. User selects PDF/image
   ↓
2. Frontend sends to /api/v1/data/process
   ↓
3. Backend saves file temporarily
   ↓
4. Python script extracts text (pdfplumber or OCR)
   ↓
5. Extracted text sent to Gemini AI
   ↓
6. AI analyzes bill and returns structured JSON
   ↓
7. Backend saves analysis to MongoDB
   ↓
8. Backend deletes temporary file
   ↓
9. Frontend displays results
```

## Technologies Used

### Backend
- **Node.js** + **Express** - Server
- **MongoDB** + **Mongoose** - Database
- **Python** - PDF/image extraction
- **Gemini AI** - Bill analysis
- **JWT** - Authentication

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - API calls
- **Context API** - Auth state

## Next Steps

Once everything works:
1. ✅ **Add shadcn/ui** for better components
2. ✅ **Improve styling** with Tailwind CSS
3. ✅ **Add pagination** to history page
4. ✅ **Export analysis** as PDF
5. ✅ **Add loading animations**
6. ✅ **Deploy to production** (Vercel + Railway/Render)

## Need Help?

- Check `frontend/STRUCTURE.md` for detailed frontend explanation
- Check `frontend/README.md` for frontend-specific docs
- All code has inline comments explaining each part
- Each function is named clearly to show what it does

---

**Remember**: Backend must be running on port 8000 before starting frontend!
