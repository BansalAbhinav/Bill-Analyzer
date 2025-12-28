# Bill Analyzer Frontend

Simple React app for uploading and analyzing hospital bills using AI.

## 📁 Folder Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header.jsx       # Navigation bar with auth links
│   │   ├── Footer.jsx       # Page footer
│   │   ├── Layout.jsx       # Wraps all pages with Header/Footer
│   │   └── ProtectedRoute.jsx  # Requires login to access
│   │
│   ├── context/             # Global state management
│   │   └── AuthContext.jsx  # Handles login/register/logout
│   │
│   ├── pages/               # Main page components
│   │   ├── HomePage.jsx     # Public landing page (/)
│   │   ├── LoginPage.jsx    # Login form (/login)
│   │   ├── RegisterPage.jsx # Registration form (/register)
│   │   ├── UploadPage.jsx   # Upload bills - Protected (/upload)
│   │   ├── HistoryPage.jsx  # View all analyses - Protected (/history)
│   │   └── AnalysisDetailPage.jsx  # View single analysis - Protected (/analysis/:id)
│   │
│   ├── services/            # API and utilities
│   │   └── api.js           # Axios setup + endpoints
│   │
│   ├── App.jsx              # Main app with routes
│   └── main.jsx             # Entry point
```

## 🔐 Authentication Flow

1. **Public Pages**: Home, Login, Register - accessible without login
2. **Protected Pages**: Upload, History, Analysis Details - require JWT token
3. **Token Storage**: Bearer token saved in `localStorage`
4. **Auto Logout**: Token removed on logout or invalid credentials

## 🚀 Getting Started

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

The app runs on: `http://localhost:5173`

### Backend Connection

Make sure your backend is running on `http://localhost:8000`:

- See `backend/` folder for backend setup
- Update `baseURL` in `src/services/api.js` if using different port

## 📄 Pages Overview

### Home (Public)

- Hero section with app description
- Feature highlights
- Call-to-action buttons to login/register

### Login/Register (Public)

- Simple forms with error handling
- Redirects to `/upload` after successful login
- Token automatically saved and used for protected routes

### Upload (Protected)

- File upload form for PDF or images
- Displays AI analysis results:
  - Overall summary and verdict
  - Positive points
  - Potential issues
  - Insurance coverage notes
  - Patient recommendations

### History (Protected)

- Grid of all past analyses
- Shows filename, date, verdict
- Delete and view detail buttons

### Analysis Detail (Protected)

- Full analysis with formatted sections
- Extracted text viewer (toggle)
- Delete analysis option
- Back to history link

## 🔧 Key Files

### `src/services/api.js`

- Axios instance with automatic Bearer token
- Endpoint constants
- Error handling

### `src/context/AuthContext.jsx`

- Global auth state (user, token, loading)
- Functions: `login()`, `register()`, `logout()`
- `isAuthenticated()` check
- Auto-loads token from localStorage on mount

### `src/components/ProtectedRoute.jsx`

- Wrapper for routes requiring auth
- Redirects to `/login` if not authenticated
- Shows loading state while checking auth

## 🎨 Styling

Currently using inline styles for simplicity. You can:

- Add shadcn/ui components (as mentioned)
- Replace inline styles with CSS modules
- Use Tailwind CSS
- Add your own design system

## 🔗 API Endpoints Used

- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Register
- `POST /api/v1/data/process` - Upload & analyze bill
- `GET /api/v1/data/analyses` - Get all analyses
- `GET /api/v1/data/analysis/:id` - Get single analysis
- `DELETE /api/v1/data/analysis/:id` - Delete analysis

## 📝 Notes

- All components use simple, beginner-friendly React patterns
- Extensive comments explaining each section
- Error handling on all API calls
- Loading states for better UX
- Responsive design (basic)

## 🛠️ Next Steps

1. **Install shadcn/ui** for better components
2. **Add loading spinners** instead of text
3. **Improve form validation** with better error messages
4. **Add pagination** to history page
5. **Export analysis** as PDF or JSON
6. **Dark mode** support
