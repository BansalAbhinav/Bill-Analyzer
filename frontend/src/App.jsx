import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
                <div style={styles.notFound}>
                  <h1>404 - Page Not Found</h1>
                  <p>The page you're looking for doesn't exist.</p>
                  <a href="/" style={styles.link}>
                    Go Home
                  </a>
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
    textAlign: "center",
    padding: "4rem 1rem",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
    fontSize: "1.1rem",
  },
};

export default App;
