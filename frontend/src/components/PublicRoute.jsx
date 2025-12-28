import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Public Route Component
// This wraps pages that should redirect to /upload if user is already logged in
// (like login and register pages)
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading while checking auth status
  if (loading) {
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

  // If already authenticated, redirect to upload page
  if (isAuthenticated()) {
    return <Navigate to="/upload" replace />;
  }

  // If not authenticated, show the public page (login/register)
  return children;
};
