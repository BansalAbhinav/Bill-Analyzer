import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";

// Import all pages
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { UploadPage } from "./pages/UploadPage";
import { GoogleCallbackPage } from "./pages/GoogleCallbackPage";

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

            {/* Auth Routes - Redirect to /upload if already logged in */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />
            <Route
              path="/auth/google/callback"
              element={<GoogleCallbackPage />}
            />

            {/* Protected Routes - Require login */}
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <UploadPage />
                </ProtectedRoute>
              }
            />

            {/* 404 Not Found */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center px-4">
                  <div className="text-center max-w-md">
                    <div className="mb-8">
                      <h1 className="text-8xl font-bold text-gray-900 mb-2">
                        404
                      </h1>
                      <div className="h-1 w-24 bg-blue-600 mx-auto rounded-full"></div>
                    </div>
                    <p className="text-lg text-gray-600 mb-8">
                      The page you're looking for doesn't exist.
                    </p>
                    <Link
                      to="/"
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                      </svg>
                      Back to Home
                    </Link>
                  </div>
                </div>
              }
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
