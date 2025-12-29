# Bill Analyzer

AI-powered tool to analyze hospital bills and identify potential overcharges or billing errors.

**Live Demo:** https://carebill.vercel.app/

## What it does

Upload your medical bill (PDF or image) and get instant analysis including:
- Breakdown of charges
- Potential billing errors or overcharges
- Insurance coverage insights
- Recommendations for next steps

Built with Gemini AI to help patients understand their medical bills better.

## Tech Stack

**Frontend:** React, Tailwind CSS, React Router  
**Backend:** Node.js, Express, MongoDB  
**AI:** Google Gemini API  
**Storage:** Cloudinary  
**Auth:** JWT + Google OAuth

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

- Upload bills as PDF or images (JPG, PNG)
- Google sign-in for quick access
- AI analysis powered by Gemini
- Responsive design for mobile and desktop
- Secure authentication with JWT

## API Endpoints

- `POST /api/v1/auth/signUp` - Register new user
- `POST /api/v1/auth/signIn` - Login
- `GET /api/v1/auth/google` - Google OAuth
- `POST /api/v1/bills/process` - Upload and analyze bill

## Deployment

**Backend:** https://bill-analyzer-ff3y.onrender.com/  
**Frontend:** https://carebill.vercel.app/

## License

MIT