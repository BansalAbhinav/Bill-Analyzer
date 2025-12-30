# Bill Analyzer

AI-powered tool to analyze hospital bills and identify potential overcharges or billing errors.

**Live Demo:** https://carebill.vercel.app/

## What it does

Upload your medical bill (PDF or image) and get instant AI-powered analysis including:
- **Comprehensive breakdown** of all charges
- **Potential billing errors** or overcharges detection
- **Insurance coverage insights** and recommendations
- **Actionable next steps** for disputing charges

Built with Google Gemini AI to help patients understand and verify their medical bills.

### Key Highlights
- ✅ Supports both **PDF and image** formats (JPG, PNG)
- ✅ **OCR technology** extracts text from scanned bills
- ✅ **Smart rate limiting** - 4 bills per user at a time
- ✅ **Auto-cleanup** - Bills deleted after 24 hours for privacy
- ✅ **Cold start handling** - Graceful server wake-up on free tier hosting

## Tech Stack

**Frontend:** React, Tailwind CSS, React Router  
**Backend:** Node.js, Express, MongoDB  
**AI:** Google Gemini API  
**Storage:** Cloudinary  
**Auth:** JWT + Google OAuth  
**OCR:** Tesseract.js (for image text extraction)  
**PDF Processing:** pdf-parse  
**Scheduling:** node-cron (for automated cleanup tasks)  
**Hosting:** Render (Backend) + Vercel (Frontend)

## Setup

### Backend
```bash
cd backend
npm install
```

Create `.env` file:
```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_CLOUD_API_KEY=your_cloudinary_key
CLOUDINARY_CLOUD_API_SECRET=your_cloudinary_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/v1/auth/google/callback
FRONTEND_URL=http://localhost:5173
```

Run:
```bash
npm start
```

### Frontend
```bash
cd frontend
npm install
```

Create `.env` file:
```
VITE_API_BASE_URL=http://localhost:3000
```

Run:
```bash
npm run dev
```

## Features

### Core Features
- **Upload bills** as PDF or images (JPG, PNG)
- **AI-powered analysis** using Google Gemini for intelligent bill review
- **Google OAuth** sign-in for quick and secure access
- **JWT authentication** for secure session management
- **Responsive design** optimized for mobile and desktop

### Smart Limits & Cleanup
- **4-bill limit per user** - Maximum of 4 bills at a time to manage resources efficiently
- **Automatic cleanup** - Bills are automatically deleted after 24 hours
- **Startup cleanup** - Removes expired bills on server restart (critical for free tier hosting)
- **Hourly cleanup job** - Scheduled task runs every hour to maintain database hygiene

### User Experience
- **Server cold start detection** - Visual indicator when free-tier server is warming up
- **Real-time status banner** - Shows server readiness status (🟢 Ready / 🟡 Warming up)
- **Protected routes** - Secure pages requiring authentication
- **Image OCR support** - Extract text from bill images using Tesseract.js
- **PDF text extraction** - Direct text extraction from PDF documents
- **Cloudinary integration** - Secure file storage and management

## API Endpoints

### Authentication
- `POST /api/v1/auth/signUp` - Register new user
- `POST /api/v1/auth/signIn` - Login user
- `GET /api/v1/auth/google` - Initiate Google OAuth flow
- `GET /api/v1/auth/google/callback` - Google OAuth callback
- `GET /api/v1/auth/user` - Get current user details (protected)

### Bill Processing
- `POST /api/v1/bills/process` - Upload and analyze bill (protected, rate-limited to 4 bills)
- Automatic cleanup after 24 hours

### Server Management
- Health checks on startup for expired bill cleanup
- Scheduled cron job for hourly maintenance

## Deployment

**Backend:** https://bill-analyzer-ff3y.onrender.com/  
**Frontend:** https://carebill.vercel.app/

### Important Notes
- Backend uses **Render free tier** which may experience cold starts (server sleeps after inactivity)
- Cold start detection is built-in - UI shows warming status when server is waking up
- Bills auto-delete after 24 hours to manage storage on free tier
- Each user limited to 4 concurrent bills to optimize resource usage

## License

MIT