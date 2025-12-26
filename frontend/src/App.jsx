import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Import all pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UploadPage } from './pages/UploadPage';
import { HistoryPage } from './pages/HistoryPage';
import { AnalysisDetailPage } from './pages/AnalysisDetailPage';

function App() {
  return (
    // Wrap entire app with AuthProvider for authentication state
    <AuthProvider>
      {/* Setup routing */}
      <BrowserRouter>
        {/* Layout wraps all pages with Header and Footer */}
        <Layout>
          <Routes>
            {/* Public Routes - Anyone can access */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes - Require login */}
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <UploadPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <HistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analysis/:id"
              element={
                <ProtectedRoute>
                  <AnalysisDetailPage />
                </ProtectedRoute>
              }
            />
            
            {/* 404 Not Found */}
            <Route
              path="*"
              element={
                <div style={styles.notFound}>
                  <h1>404 - Page Not Found</h1>
                  <p>The page you're looking for doesn't exist.</p>
                  <a href="/" style={styles.link}>Go Home</a>
                </div>
              }
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

const styles = {
  notFound: {
    textAlign: 'center',
    padding: '4rem 1rem',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
    fontSize: '1.1rem',
  },
};

export default App;
