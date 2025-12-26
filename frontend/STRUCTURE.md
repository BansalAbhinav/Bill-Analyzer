# Frontend Structure - Quick Reference

## 🗺️ Page Flow

```
┌─────────────┐
│   Home (/)  │ ← Public - Anyone can visit
│   Landing   │
└──────┬──────┘
       │
       ├─────────────────────┬──────────────────────┐
       ▼                     ▼                      ▼
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   /login    │      │  /register  │      │             │
│   Login     │      │   Sign Up   │      │             │
└──────┬──────┘      └──────┬──────┘      │             │
       │                    │              │             │
       └──────────┬─────────┘              │             │
                  │                        │             │
         ✅ Get Bearer Token              │             │
                  │                        │             │
                  ▼                        ▼             │
           ┌─────────────┐         ┌─────────────┐      │
           │  /upload    │ ◄────── │  /history   │      │
           │  Upload PDF │         │  Past Bills │      │
           └──────┬──────┘         └──────┬──────┘      │
                  │                       │              │
                  │ Upload ────────────► Save            │
                  │ ◄────── View Detail ──┤              │
                  │                       │              │
                  ▼                       ▼              │
           ┌──────────────────────────────────┐         │
           │      /analysis/:id               │         │
           │   Full Analysis Details          │         │
           └──────────────────────────────────┘         │
                                                         │
           🔒 All protected routes require token ◄──────┘
```

## 📂 File Organization

### Components (Reusable)
```
src/components/
├── Header.jsx           → Nav bar, shows login/logout based on auth
├── Footer.jsx           → Simple footer with copyright
├── Layout.jsx           → Wraps pages: <Header><children><Footer>
└── ProtectedRoute.jsx   → Checks auth, redirects to /login if not logged in
```

### Pages (Main Views)
```
src/pages/
├── HomePage.jsx              → Landing (/)
├── LoginPage.jsx             → Login form (/login)
├── RegisterPage.jsx          → Register form (/register)
├── UploadPage.jsx            → Upload bill (/upload) 🔒
├── HistoryPage.jsx           → All analyses (/history) 🔒
└── AnalysisDetailPage.jsx    → Single analysis (/analysis/:id) 🔒
```

### Context & Services
```
src/
├── context/
│   └── AuthContext.jsx    → Global auth state (user, token, login(), logout())
│
└── services/
    └── api.js             → Axios + Bearer token + endpoints
```

## 🔐 How Authentication Works

### 1. User Logs In
```javascript
// LoginPage.jsx
const handleSubmit = async (e) => {
  const { user, token } = await login(email, password);
  // AuthContext saves token to localStorage
  navigate('/upload');
};
```

### 2. Token Stored
```javascript
// AuthContext.jsx
const login = async (email, password) => {
  const response = await api.post('/api/v1/auth/login', { email, password });
  localStorage.setItem('token', response.data.token);
  setUser(response.data.user);
};
```

### 3. Protected Route Checks
```javascript
// ProtectedRoute.jsx
if (!isAuthenticated()) {
  return <Navigate to="/login" />;
}
return <>{children}</>;
```

### 4. API Calls Include Token
```javascript
// api.js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 📡 API Integration

### Upload Flow
```
User selects file
    ↓
UploadPage.jsx creates FormData
    ↓
POST /api/v1/data/process
    ↓
Backend: Extract → Analyze with AI → Save to MongoDB
    ↓
Response: { analysis: {...}, extractedText, ... }
    ↓
Display results on page
```

### History Flow
```
HistoryPage.jsx loads
    ↓
GET /api/v1/data/analyses?page=1&limit=20
    ↓
Backend queries MongoDB
    ↓
Response: { analyses: [...] }
    ↓
Display grid of cards
```

### Detail Flow
```
Click "View Details" on history
    ↓
Navigate to /analysis/:id
    ↓
GET /api/v1/data/analysis/:id
    ↓
Response: { full analysis object }
    ↓
Display formatted analysis
```

## 🎯 Key Concepts

### State Management
- **AuthContext**: Global auth state (user, token, loading)
- **Local State**: Each page manages its own data (uploads, history, etc.)

### Error Handling
```javascript
try {
  const response = await api.post(...);
  setData(response.data);
} catch (err) {
  setError(err.message || 'Something went wrong');
}
```

### Loading States
```javascript
const [loading, setLoading] = useState(false);

// Before API call
setLoading(true);

// After API call
setLoading(false);

// In JSX
{loading && <p>Loading...</p>}
```

## 🚀 Running the App

### Development
```bash
cd frontend
npm install
npm run dev
# Opens on http://localhost:5173
```

### Backend Must Be Running
```bash
cd backend
node server/server.js
# Must be on http://localhost:8000
```

## 📝 Beginner-Friendly Features

✅ **Inline Comments**: Every section explained  
✅ **Simple Patterns**: No complex state management  
✅ **Error Messages**: Clear feedback on errors  
✅ **Loading States**: Users know when things are processing  
✅ **Inline Styles**: No separate CSS files to manage  
✅ **Clear Naming**: Functions and variables are descriptive  

## 🎨 Future Improvements

When ready, you can add:
- **shadcn/ui** for better-looking components
- **React Query** for better API state management
- **Form libraries** like React Hook Form
- **CSS frameworks** like Tailwind
- **Toast notifications** for better feedback
- **Animations** with Framer Motion
