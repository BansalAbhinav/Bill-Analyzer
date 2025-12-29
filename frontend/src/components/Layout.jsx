import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

// Layout Component - Wraps all pages with Header and Footer
export const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
};
