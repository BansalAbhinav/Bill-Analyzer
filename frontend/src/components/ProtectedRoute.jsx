import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Protected Route Component
// This wraps pages that require authentication
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  // Give a brief moment for auth state to stabilize (for OAuth redirects)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  // Show loading while checking auth status
  if (loading || isChecking) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, show the protected page
  return children;
};
