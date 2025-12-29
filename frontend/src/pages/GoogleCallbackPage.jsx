import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const GoogleCallbackPage = () => {
  const [status, setStatus] = useState("Processing...");
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the token from URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        console.log("Token from URL:", token);

        if (!token) {
          throw new Error("No token found");
        }

        // Decode the JWT to get user info
        const tokenParts = token.split(".");
        const payload = JSON.parse(atob(tokenParts[1]));

        console.log("Decoded JWT payload:", payload);

        const userData = {
          userId: payload.userId,
          username: payload.username,
          role: payload.role,
        };

        console.log("Calling loginWithToken with:", userData);

        // Use AuthContext to login
        loginWithToken(token, userData);

        console.log("Login successful");

        setStatus("Success! Redirecting...");

        // Small delay to ensure localStorage and state are synced
        setTimeout(() => {
          navigate("/upload", { replace: true });
        }, 100);
      } catch (error) {
        console.error("Google callback error:", error);
        setStatus(
          `Authentication failed: ${error.message}. Redirecting to login...`,
        );
        setTimeout(() => navigate("/login"), 2000);
      }
    };

    handleCallback();
  }, [navigate, loginWithToken]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{status}</h2>
        <div style={styles.spinner}></div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "70vh",
  },
  card: {
    textAlign: "center",
    padding: "2rem",
  },
  title: {
    color: "#334155",
    marginBottom: "1rem",
  },
  spinner: {
    width: "40px",
    height: "40px",
    margin: "0 auto",
    border: "4px solid #e2e8f0",
    borderTop: "4px solid #2563eb",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};
