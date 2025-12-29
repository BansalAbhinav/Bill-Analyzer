import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Home Page - Public, no authentication needed
export const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight tracking-tight">
              Analyze Your Hospital Bills with AI
            </h1>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              Upload your medical bills and get instant AI-powered analysis to
              understand charges, potential issues, and insurance coverage.
            </p>

            {isAuthenticated() ? (
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 bg-white text-blue-700 px-7 py-3 rounded-lg text-base font-medium shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all"
              >
                <span>📤</span>
                Upload Bill Now
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-white text-blue-700 px-7 py-3 rounded-lg text-base font-medium shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all"
              >
                Get Started Free
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-10">
            Why Bill Analyzer?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="group p-6 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all">
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Smart Analysis
              </h3>
              <p className="text-sm text-gray-600">
                AI-powered detection of overcharges and billing errors
              </p>
            </div>
            <div className="group p-6 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Save Money
              </h3>
              <p className="text-sm text-gray-600">
                Identify potential insurance coverage issues
              </p>
            </div>
            <div className="group p-6 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all">
              <div className="text-3xl mb-3">📄</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Easy Upload
              </h3>
              <p className="text-sm text-gray-600">
                Support for PDF and image files
              </p>
            </div>
            <div className="group p-6 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Instant Results
              </h3>
              <p className="text-sm text-gray-600">
                Get detailed analysis in seconds
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
