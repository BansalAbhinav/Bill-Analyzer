# 📊 Bill Analyzer - Complete Architecture

## System Flow Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                         USER INTERACTS                                │
└───────────────────────────┬──────────────────────────────────────────┘
                            │
                            ▼
    ┌───────────────────────────────────────────────────────┐
    │           FRONTEND (React + Vite)                      │
    │           http://localhost:5173                        │
    │                                                        │
    │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐│
    │  │  Public      │  │  Protected   │  │  Auth       ││
    │  │  - Home      │  │  - Upload    │  │  - Login    ││
    │  │              │  │  - History   │  │  - Register ││
    │  │              │  │  - Details   │  │             ││
    │  └──────────────┘  └──────────────┘  └─────────────┘│
    │                                                        │
    │  ┌────────────────────────────────────────────────┐  │
    │  │  AuthContext: Manages user, token, login()     │  │
    │  │  - Stores JWT in localStorage                  │  │
    │  │  - Auto-injects Bearer token in API calls      │  │
    │  └────────────────────────────────────────────────┘  │
    │                                                        │
    │  ┌────────────────────────────────────────────────┐  │
    │  │  API Service (Axios)                           │  │
    │  │  - POST /auth/login                            │  │
    │  │  - POST /auth/register                         │  │
    │  │  - POST /data/process (Upload + Analyze)       │  │
    │  │  - GET /data/analyses (History)                │  │
    │  │  - GET /data/analysis/:id (Details)            │  │
    │  │  - DELETE /data/analysis/:id                   │  │
    │  └────────────────────────────────────────────────┘  │
    └──────────────────────┬────────────────────────────────┘
                           │ HTTP Requests
                           │ Bearer Token in Headers
                           ▼
    ┌───────────────────────────────────────────────────────┐
    │           BACKEND (Express + Node.js)                 │
    │           http://localhost:8000                       │
    │                                                       │
    │  ┌─────────────────────────────────────────────────┐ │
    │  │  Routes (/api/v1/...)                          │ │
    │  │  - auth.routes.js → /auth/login, /register     │ │
    │  │  - process.routes.js → /data/process           │ │
    │  │  - analyze.routes.js → /data/analyses          │ │
    │  └─────────────────────────────────────────────────┘ │
    │                     │                                 │
    │                     ▼                                 │
    │  ┌─────────────────────────────────────────────────┐ │
    │  │  Middlewares                                    │ │
    │  │  - auth.middleware.js: Verify JWT token        │ │
    │  │  - multer: Handle file uploads                 │ │
    │  └─────────────────────────────────────────────────┘ │
    │                     │                                 │
    │                     ▼                                 │
    │  ┌─────────────────────────────────────────────────┐ │
    │  │  Controllers                                    │ │
    │  │  - auth.controller.js: Login, Register         │ │
    │  │  - unified.controller.js: Process (Upload+AI)  │ │
    │  │  - billAnalysis.controller.js: CRUD            │ │
    │  └─────────────────────────────────────────────────┘ │
    │                     │                                 │
    │          ┌──────────┴──────────┐                     │
    │          ▼                     ▼                     │
    │  ┌──────────────┐      ┌──────────────────────┐     │
    │  │   Python     │      │  Gemini AI Service   │     │
    │  │   Extractor  │      │  (Google GenAI)      │     │
    │  └──────────────┘      └──────────────────────┘     │
    │          │                     │                     │
    └──────────┼─────────────────────┼─────────────────────┘
               │                     │
               ▼                     ▼
    ┌─────────────────┐    ┌──────────────────┐
    │  PDF/Image      │    │  AI Analysis     │
    │  Processing     │    │  - JSON Response │
    │  - pdfplumber   │    │  - Structured    │
    │  - pytesseract  │    │                  │
    │  - Pillow       │    │                  │
    └─────────────────┘    └──────────────────┘
               │                     │
               └──────────┬──────────┘
                          ▼
              ┌────────────────────────┐
              │  MongoDB (Database)    │
              │                        │
              │  Collections:          │
              │  - users               │
              │  - billanalyses        │
              └────────────────────────┘
```

## Data Flow: Upload Bill

```
1. USER UPLOADS PDF
   └─► Frontend: UploadPage.jsx
       └─► Creates FormData with file
           └─► POST /api/v1/data/process
               │ + Bearer Token in header
               │
               ▼
2. BACKEND RECEIVES
   └─► Multer saves to uploads/
       └─► unified.controllers.js
           └─► Spawns Python process
               │
               ▼
3. PYTHON EXTRACTS TEXT
   └─► cli_extract.py
       ├─► PDF? → pdfplumber
       └─► Image? → pytesseract (OCR)
           └─► Returns JSON: { text, pages }
               │
               ▼
4. BACKEND PROCESSES
   └─► Gets extracted text
       └─► Deletes uploaded file
           └─► Sends to Gemini AI
               │
               ▼
5. GEMINI ANALYZES
   └─► gemini.service.js
       └─► Prompts AI with structured template
           └─► Returns JSON analysis
               │
               ▼
6. SAVE TO MONGODB
   └─► BillAnalysis.create()
       └─► Saves:
           - filename
           - extracted text
           - AI analysis (JSON)
           - user ID
           - timestamps
           │
           ▼
7. RETURN TO FRONTEND
   └─► Response: { analysis, extractedText, ... }
       └─► UploadPage displays results
           - Positive points
           - Issues
           - Insurance notes
           - Recommendations
```

## Authentication Flow

```
REGISTER
────────
User fills form
   │
   ▼
POST /api/v1/auth/register
{ username, email, password }
   │
   ▼
Backend:
- Hash password
- Create user in MongoDB
- Generate JWT token
   │
   ▼
Return: { user, token }
   │
   ▼
Frontend:
- Save token to localStorage
- Set user in AuthContext
- Redirect to /upload


LOGIN
─────
User enters credentials
   │
   ▼
POST /api/v1/auth/login
{ email, password }
   │
   ▼
Backend:
- Find user by email
- Compare password hash
- Generate JWT token
   │
   ▼
Return: { user, token }
   │
   ▼
Frontend:
- Save token to localStorage
- Set user in AuthContext
- Redirect to /upload


PROTECTED REQUEST
─────────────────
User visits /upload
   │
   ▼
ProtectedRoute checks isAuthenticated()
   │
   ├─► ❌ No token → Redirect to /login
   │
   └─► ✅ Has token → Render page
           │
           ▼
User uploads file
   │
   ▼
api.post() automatically adds:
Authorization: Bearer <token>
   │
   ▼
Backend auth middleware:
- Extract token from header
- Verify JWT signature
- Decode user ID
- Attach user to request
   │
   ├─► ❌ Invalid → 401 Unauthorized
   │
   └─► ✅ Valid → Continue to controller
```

## Technology Stack

### Frontend Stack
```
React 19.2.0
  └─► Vite 7.2.4 (Build tool)
      └─► React Router (Navigation)
          └─► Axios (HTTP client)
              └─► Context API (State management)
```

### Backend Stack
```
Node.js + Express 5.2.1
  ├─► MongoDB + Mongoose 9.0.2
  ├─► JWT (jsonwebtoken)
  ├─► Multer (File uploads)
  ├─► @google/genai (Gemini AI)
  └─► Python Integration
      ├─► pdfplumber (PDF extraction)
      ├─► pytesseract (OCR)
      ├─► Pillow (Image processing)
      └─► Pydantic (Data validation)
```

## Database Schema

```javascript
// User Collection
{
  _id: ObjectId,
  username: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}

// BillAnalysis Collection
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  originalFileName: String,
  extractedText: String,
  totalPages: Number,
  extractedVia: String (pdf/ocr),
  analysis: Mixed {
    overall_summary: {
      verdict: String,
      confidence_level: String,
      one_line_summary: String
    },
    positive_points: [{
      title: String,
      explanation: String
    }],
    potential_issues: [{
      item_name: String,
      severity: String,
      type: String,
      why_flagged: String,
      suggested_action: String
    }],
    insurance_attention_items: [{
      item_name: String,
      reason: String,
      coverage_likelihood: String
    }],
    final_advice_for_patient: [String]
  },
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

## File Structure

```
bill anlyzer/
├── backend/
│   ├── server/
│   │   ├── server.js                    # Entry point
│   │   ├── controllers/
│   │   │   ├── auth.controller.js       # Login/Register
│   │   │   ├── unified.controllers.js   # Upload+Analyze
│   │   │   └── billAnalysis.controllers.js  # CRUD
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── process.routes.js
│   │   │   └── index.js
│   │   ├── models/
│   │   │   ├── user.models.js
│   │   │   └── bill.models.js
│   │   ├── services/
│   │   │   └── gemini.service.js        # AI integration
│   │   ├── prompts/
│   │   │   └── bill_analysis_prompt.js  # AI prompt
│   │   ├── middlewares/
│   │   │   └── auth.middleware.js       # JWT verification
│   │   └── db/
│   │       └── db.js                    # MongoDB connection
│   ├── python/
│   │   ├── cli_extract.py               # Extraction script
│   │   ├── extractor/
│   │   │   ├── extract_text.py          # PDF logic
│   │   │   └── ocr_extractor.py         # OCR logic
│   │   └── venv/                        # Virtual environment
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx
    │   │   ├── Footer.jsx
    │   │   ├── Layout.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── UploadPage.jsx
    │   │   ├── HistoryPage.jsx
    │   │   └── AnalysisDetailPage.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## Security Measures

- ✅ JWT tokens for authentication
- ✅ Password hashing (bcrypt)
- ✅ Protected API routes
- ✅ File type validation (PDF, JPG, PNG only)
- ✅ Temporary file deletion after processing
- ✅ Bearer token in headers (not query params)
- ✅ User-specific data access (userId filtering)

## Performance Optimizations

- ✅ File deleted immediately after extraction
- ✅ MongoDB stores only necessary data
- ✅ Python subprocess for heavy processing
- ✅ Async/await for non-blocking operations
- ✅ Error boundaries and loading states
- ✅ Efficient React rendering patterns
