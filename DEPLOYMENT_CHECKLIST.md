# Production Deployment - Quick Checklist

## ✅ Pre-Deployment Checklist

### 1. Environment Variables Setup

#### Backend (.env):
```bash
cd backend
cp .env.example .env
# Edit .env and fill in all values
```

Required variables:
- [ ] `MONGODB_URI` - MongoDB Atlas connection string
- [ ] `JWT_SECRET_KEY` - Strong secret key
- [ ] `GOOGLE_CLIENT_ID` - From Google Cloud Console
- [ ] `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- [ ] `GOOGLE_REDIRECT_URI` - Will update after backend deployment
- [ ] `FRONTEND_URL` - Will update after frontend deployment

#### Frontend (.env):
```bash
cd frontend
cp .env.example .env
# Edit .env and fill in all values
```

Required variables:
- [ ] `VITE_API_BASE_URL` - Will update after backend deployment

### 2. Vercel Account Setup
- [ ] Create account at https://vercel.com
- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Login: `vercel login`

### 3. MongoDB Atlas Setup
- [ ] Create free cluster at https://cloud.mongodb.com
- [ ] Create database user with password
- [ ] Get connection string
- [ ] Configure Network Access to allow all IPs (0.0.0.0/0)

### 4. Google OAuth Setup
- [ ] Go to https://console.cloud.google.com/
- [ ] Create/Select project
- [ ] Enable Google+ API
- [ ] Create OAuth 2.0 credentials
- [ ] Note Client ID and Secret

## 🚀 Deployment Steps

### Step 1: Deploy Backend First
```bash
cd backend
vercel
# Follow prompts, note the URL you get
```

Add environment variables in Vercel dashboard for backend project.

Redeploy:
```bash
vercel --prod
```

**Backend URL:** `___________________________`

### Step 2: Update Google OAuth
Add to Google Cloud Console OAuth credentials:
- Authorized redirect URI: `https://your-backend-url.vercel.app/api/v1/auth/google/callback`
- Authorized JavaScript origin: `https://your-backend-url.vercel.app`

### Step 3: Deploy Frontend
Update `frontend/.env`:
```env
VITE_API_BASE_URL=https://your-backend-url.vercel.app
```

```bash
cd frontend
vercel
# Follow prompts, note the URL you get
```

Add environment variables in Vercel dashboard for frontend project.

Redeploy:
```bash
vercel --prod
```

**Frontend URL:** `___________________________`

### Step 4: Update Backend Environment
In backend Vercel dashboard, update:
- `FRONTEND_URL` = your frontend URL
- `GOOGLE_REDIRECT_URI` = `https://your-backend-url.vercel.app/api/v1/auth/google/callback`

Redeploy backend:
```bash
cd backend
vercel --prod
```

### Step 5: Final Google OAuth Update
Add to Google Cloud Console:
- Authorized JavaScript origin: `https://your-frontend-url.vercel.app`
- Authorized redirect URI: `https://your-frontend-url.vercel.app/auth/google/callback`

## 🧪 Testing

Visit your frontend URL and test:
- [ ] Homepage loads
- [ ] Login with email/password works
- [ ] Google OAuth login works
- [ ] Upload page accessible after login
- [ ] File upload and analysis works
- [ ] History page shows previous analyses
- [ ] Logout works
- [ ] Protected routes redirect to login when not authenticated

## 🔧 Troubleshooting

### CORS Errors
- Check `FRONTEND_URL` in backend env matches frontend URL exactly
- Ensure both URLs use `https://`

### Google OAuth Fails
- Verify all redirect URIs in Google Console
- Check `GOOGLE_REDIRECT_URI` in backend env
- Ensure Client ID and Secret are correct

### API Calls Fail
- Check `VITE_API_BASE_URL` points to correct backend URL
- Verify backend is deployed and running
- Check Vercel function logs for errors

### Database Connection Fails
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas Network Access allows 0.0.0.0/0
- Ensure database user credentials are correct

## 📝 Important URLs to Save

- **Frontend Production:** `___________________________`
- **Backend Production:** `___________________________`
- **MongoDB Atlas:** https://cloud.mongodb.com
- **Google Cloud Console:** https://console.cloud.google.com
- **Vercel Dashboard:** https://vercel.com/dashboard

## 🔄 For Future Updates

```bash
# Backend updates
cd backend
vercel --prod

# Frontend updates
cd frontend
vercel --prod
```

## 📚 Full Documentation

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)
