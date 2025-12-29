import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Header Component - Shows on all pages
export const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <h1>Bill Analyzer</h1>
        </Link>

        {/* Navigation */}
        <nav style={styles.nav}>
          <Link to="/" style={styles.link}>
            Home
          </Link>

          {/* Show different links based on auth status */}
          {isAuthenticated() ? (
            <>
              <Link to="/upload" style={styles.link}>
                Upload Bill
              </Link>
              <span style={styles.userName}>{user?.username}</span>
              <button onClick={handleLogout} style={styles.button}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>
                Login
              </Link>
              <Link to="/register" style={styles.button}>
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    padding: "1rem 0",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    textDecoration: "none",
    color: "#2563eb",
    fontSize: "1.5rem",
    fontWeight: "700",
    letterSpacing: "-0.5px",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
  },
  link: {
    textDecoration: "none",
    color: "#475569",
    fontSize: "0.95rem",
    fontWeight: "500",
    transition: "color 0.2s",
  },
  userName: {
    color: "#1e293b",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1.25rem",
    borderRadius: "6px",
    cursor: "pointer",
    textDecoration: "none",
    fontSize: "0.95rem",
    fontWeight: "600",
    transition: "all 0.2s",
  },
};
