import React from "react";

// Footer Component - Shows on all pages
export const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <p>&copy; 2025 Bill Analyzer. All rights reserved.</p>
        <div style={styles.links}>
          <a href="#privacy" style={styles.link}>
            Privacy Policy
          </a>
          <a href="#terms" style={styles.link}>
            Terms of Service
          </a>
          <a href="#contact" style={styles.link}>
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#1e293b",
    padding: "2rem 0",
    marginTop: "auto",
    borderTop: "1px solid #334155",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    color: "#e2e8f0",
  },
  links: {
    display: "flex",
    gap: "1.5rem",
  },
  link: {
    textDecoration: "none",
    color: "#94a3b8",
    fontSize: "0.9rem",
    transition: "color 0.2s",
  },
};
