import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Register Page
export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    // Call register function from AuthContext
    const result = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      // Redirect to login page after successful registration
      navigate("/login");
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Sign Up</h1>

        {/* Error Message */}
        {error && <div style={styles.error}>{error}</div>}

        {/* Register Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={styles.input}
              placeholder="Choose a username"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your email"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              placeholder="Create a password"
              required
              minLength="6"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={styles.input}
              placeholder="Confirm your password"
              required
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Login Link */}
        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login
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
    minHeight: "80vh",
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
  button: {
    backgroundColor: "#10b981",
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
