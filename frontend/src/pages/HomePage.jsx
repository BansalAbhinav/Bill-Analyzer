import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Home Page - Public, no authentication needed
export const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.title}>Analyze Your Hospital Bills with AI</h1>
        <p style={styles.subtitle}>
          Upload your medical bills and get instant AI-powered analysis to
          understand charges, potential issues, and insurance coverage.
        </p>

        {/* CTA Button */}
        {isAuthenticated() ? (
          <Link to="/upload" style={styles.button}>
            Upload Bill Now
          </Link>
        ) : (
          <Link to="/register" style={styles.button}>
            Get Started Free
          </Link>
        )}
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <h2>Why Use Bill Analyzer?</h2>
        <div style={styles.featureGrid}>
          <div style={styles.feature}>
            <h3>🔍 Smart Analysis</h3>
            <p>AI-powered detection of overcharges and billing errors</p>
          </div>
          <div style={styles.feature}>
            <h3>💰 Save Money</h3>
            <p>Identify potential insurance coverage issues</p>
          </div>
          <div style={styles.feature}>
            <h3>📄 Easy Upload</h3>
            <p>Support for PDF and image files</p>
          </div>
          <div style={styles.feature}>
            <h3>⚡ Instant Results</h3>
            <p>Get detailed analysis in seconds</p>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
  },
  hero: {
    textAlign: "center",
    padding: "4rem 1.5rem",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    borderRadius: "0 0 30px 30px",
  },
  title: {
    fontSize: "3rem",
    marginBottom: "1rem",
    color: "#fff",
    fontWeight: "700",
    letterSpacing: "-1px",
  },
  subtitle: {
    fontSize: "1.25rem",
    color: "rgba(255,255,255,0.95)",
    marginBottom: "2rem",
    lineHeight: "1.6",
  },
  button: {
    display: "inline-block",
    backgroundColor: "#fff",
    color: "#667eea",
    padding: "1rem 2.5rem",
    borderRadius: "10px",
    textDecoration: "none",
    fontSize: "1.1rem",
    fontWeight: "600",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    transition: "transform 0.2s",
  },
  features: {
    padding: "4rem 1.5rem",
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "2rem",
    marginTop: "2rem",
  },
  feature: {
    textAlign: "center",
    padding: "2rem 1.5rem",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    transition: "transform 0.2s, box-shadow 0.2s",
    color: "#1e293b",
  },
};
