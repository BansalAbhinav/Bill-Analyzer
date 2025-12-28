import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

// Layout Component - Wraps all pages with Header and Footer
export const Layout = ({ children }) => {
  return (
    <div style={styles.layout}>
      <Header />
      <main style={styles.main}>{children}</main>
      <Footer />
    </div>
  );
};

const styles = {
  layout: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  main: {
    flex: 1,
    maxWidth: "1200px",
    width: "100%",
    margin: "0 auto",
    padding: "2rem 1rem",
  },
};
