import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Login Page
export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Call login function from AuthContext
    const result = await login(email, password);

    if (result.success) {
      // Redirect to upload page after successful login
      navigate("/upload");
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Login</h1>

        {/* Error Message */}
        {error && <div style={styles.error}>{error}</div>}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="Enter your email"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div style={styles.divider}>
          <span style={styles.dividerText}>OR</span>
        </div>

        {/* Google Login Button */}
        <a
          href={`${(import.meta.env.VITE_API_BASE_URL || "http://localhost:3000").replace(/\/$/, "")}/api/v1/auth/google`}
          style={styles.googleButton}
        >
          <span style={styles.googleIcon}>G</span>
          Continue with Google
        </a>

        {/* Sign Up Link */}
        <p style={styles.footer}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.link}>
            Sign Up
          </Link>
        </p>
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
    padding: "2rem 1rem",
    backgroundColor: "#f8fafc",
  },
  card: {
    backgroundColor: "#fff",
    padding: "2.5rem",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    width: "100%",
    maxWidth: "420px",
  },
  title: {
    textAlign: "center",
    marginBottom: "2rem",
    color: "#1e293b",
    fontSize: "1.75rem",
    fontWeight: "700",
  },
  error: {
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    padding: "0.875rem",
    borderRadius: "8px",
    marginBottom: "1rem",
    textAlign: "center",
    border: "1px solid #fecaca",
    fontSize: "0.9rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    fontWeight: "600",
    color: "#334155",
    fontSize: "0.9rem",
  },
  input: {
    padding: "0.875rem",
    border: "1.5px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "1rem",
    transition: "border-color 0.2s",
    outline: "none",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    margin: "1.5rem 0",
  },
  dividerText: {
    padding: "0 1rem",
    color: "#94a3b8",
    fontSize: "0.875rem",
    fontWeight: "500",
    backgroundColor: "#fff",
    position: "relative",
    zIndex: 1,
    width: "100%",
  },
  googleButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
    padding: "0.875rem",
    border: "1.5px solid #e2e8f0",
    borderRadius: "8px",
    backgroundColor: "#fff",
    color: "#334155",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "none",
    transition: "all 0.2s",
    marginBottom: "1rem",
  },
  googleIcon: {
    width: "20px",
    height: "20px",
    backgroundColor: "#4285f4",
    color: "#fff",
    borderRadius: "3px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "14px",
  },
  button: {
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "0.875rem",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
    marginTop: "0.5rem",
  },
  footer: {
    textAlign: "center",
    marginTop: "1.5rem",
    color: "#64748b",
    fontSize: "0.9rem",
  },
  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "600",
  },
};
