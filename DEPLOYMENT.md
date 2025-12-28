# Deployment Guide for Vercel

This guide will help you deploy both the frontend and backend of your Bill Analyzer application to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. MongoDB Atlas account for production database
3. Google OAuth credentials configured for production URLs

## Project Structure

```
bill-analyzer/
├── frontend/          # React + Vite frontend
└── backend/           # Express.js backend
```

## Step 1: Prepare Your Environment Variables

### Backend Environment Variables (.env)

Create a `.env` file in the `backend` folder with:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Database
MONGODB_URI=your_mongodb_atlas_connection_string

# JWT Secret
JWT_SECRET_KEY=your_super_secret_jwt_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://your-backend.vercel.app/api/v1/auth/google/callback

# Frontend URL (for CORS and redirects)
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend Environment Variables (.env)

Create a `.env` file in the `frontend` folder with:

```env
# Backend API URL
VITE_API_BASE_URL=https://your-backend.vercel.app
```

## Step 2: Deploy Backend to Vercel

1. **Navigate to your backend folder:**
   ```bash
   cd backend
   ```

2. **Install Vercel CLI (if not already installed):**
   ```bash
   npm install -g vercel
   ```

3. **Login to Vercel:**
   ```bash
   vercel login
   ```

4. **Deploy:**
   ```bash
   vercel
   ```
   - Follow the prompts
   - Choose "Create new project"
   - When asked for the project name, use something like `bill-analyzer-backend`

5. **Add Environment Variables in Vercel Dashboard:**
   - Go to your project on Vercel dashboard
   - Navigate to Settings > Environment Variables
   - Add all the variables from your `.env` file:
     - `MONGODB_URI`
     - `JWT_SECRET_KEY`
     - `GOOGLE_CLIENT_ID`
     - `GOOGLE_CLIENT_SECRET`
     - `GOOGLE_REDIRECT_URI` (update with your actual Vercel backend URL)
     - `FRONTEND_URL` (will update this after frontend deployment)
     - `NODE_ENV` = `production`

6. **Redeploy after adding environment variables:**
   ```bash
   vercel --prod
   ```

7. **Note your backend URL:** e.g., `https://bill-analyzer-backend.vercel.app`

## Step 3: Update Google OAuth Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to your OAuth 2.0 credentials
3. Add to **Authorized JavaScript origins:**
   - `https://your-backend.vercel.app`
   - `https://your-frontend.vercel.app`
4. Add to **Authorized redirect URIs:**
   - `https://your-backend.vercel.app/api/v1/auth/google/callback`
   - `https://your-frontend.vercel.app/auth/google/callback`

## Step 4: Deploy Frontend to Vercel

1. **Navigate to your frontend folder:**
   ```bash
   cd ../frontend
   ```

2. **Update your frontend `.env` file:**
   ```env
   VITE_API_BASE_URL=https://your-actual-backend-url.vercel.app
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   - Follow the prompts
   - Choose "Create new project"
   - When asked for the project name, use something like `bill-analyzer-frontend`

4. **Add Environment Variables in Vercel Dashboard:**
   - Go to your project on Vercel dashboard
   - Navigate to Settings > Environment Variables
   - Add: `VITE_API_BASE_URL` = `https://your-backend.vercel.app`

5. **Redeploy:**
   ```bash
   vercel --prod
   ```

6. **Note your frontend URL:** e.g., `https://bill-analyzer-frontend.vercel.app`

## Step 5: Update Backend with Frontend URL

1. Go to your **backend project** on Vercel dashboard
2. Navigate to Settings > Environment Variables
3. Update `FRONTEND_URL` with your actual frontend URL
4. Redeploy the backend:
   ```bash
   cd backend
   vercel --prod
   ```

## Step 6: Update MongoDB Atlas Network Access

1. Go to MongoDB Atlas dashboard
2. Navigate to Network Access
3. Add `0.0.0.0/0` to allow connections from anywhere (Vercel uses dynamic IPs)
   - **Note:** This is required for serverless functions but is secure with proper authentication

## Step 7: Test Your Deployment

1. Visit your frontend URL: `https://your-frontend.vercel.app`
2. Test login functionality
3. Test Google OAuth
4. Test file upload and analysis
5. Check that all API calls work correctly

## Common Issues and Solutions

### Issue 1: CORS Errors
**Solution:** Make sure your `FRONTEND_URL` environment variable in the backend matches your actual frontend URL exactly (including https://).

### Issue 2: Google OAuth Not Working
**Solution:** 
- Verify redirect URIs in Google Cloud Console match your production URLs
- Check that `GOOGLE_REDIRECT_URI` in backend env matches what's in Google Console
- Ensure URLs use `https://` not `http://`

### Issue 3: API Calls Failing
**Solution:** 
- Check that `VITE_API_BASE_URL` in frontend points to your actual backend URL
- Verify all environment variables are set in Vercel dashboard
- Check Vercel function logs for errors

### Issue 4: MongoDB Connection Errors
**Solution:**
- Verify `MONGODB_URI` is correct and includes credentials
- Check MongoDB Atlas Network Access allows connections from anywhere
- Ensure your MongoDB user has proper permissions

### Issue 5: 404 Errors on Page Refresh
**Solution:** The `vercel.json` files are already configured with rewrites to handle this. If still occurring, verify the `vercel.json` file exists and is properly configured.

## Monitoring and Logs

- **View Logs:** Go to your Vercel project > Deployments > Click on a deployment > View Function Logs
- **Real-time Monitoring:** Vercel dashboard provides real-time monitoring of your deployments

## Updating Your Deployment

When you make code changes:

```bash
# For backend
cd backend
vercel --prod

# For frontend
cd frontend
vercel --prod
```

## Using Custom Domains (Optional)

1. Go to your project on Vercel
2. Navigate to Settings > Domains
3. Add your custom domain
4. Update DNS records as instructed
5. Update environment variables with your custom domain
6. Update Google OAuth settings with custom domain

## Security Checklist

- ✅ All sensitive data in environment variables (not in code)
- ✅ MongoDB connection string uses strong password
- ✅ JWT_SECRET_KEY is strong and unique
- ✅ CORS is properly configured to only allow your frontend domain
- ✅ Google OAuth redirect URIs are specific (not wildcards)
- ✅ `.env` files are in `.gitignore`

## Quick Reference - Environment Variables

### Backend Required Variables:
- `MONGODB_URI`
- `JWT_SECRET_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- `FRONTEND_URL`
- `NODE_ENV`

### Frontend Required Variables:
- `VITE_API_BASE_URL`

---

**Need Help?** Check Vercel documentation at https://vercel.com/docs or contact support.
