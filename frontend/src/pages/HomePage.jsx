import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Home Page - Public, no authentication needed
export const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-blue-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 lg:py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight tracking-tight">
              Analyze Your Hospital Bills with AI
            </h1>
            <p className="text-lg text-blue-100 mb-6   leading-relaxed">
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

     {/* Important Disclaimer */}
      <section className="py-6 bg-amber-50/50 border-y border-amber-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg p-5 shadow-sm border border-amber-200/50">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-900 mb-1.5">
                  Service Limitations & Privacy
                </h3>
                <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
                  <p>
                    <strong className="font-medium text-gray-900">Daily Limit:</strong> This free educational tool has approximately 20 analyses per day. 
                    Please use it thoughtfully to ensure availability for everyone.
                  </p>
                  <p>
                    <strong className="font-medium text-gray-900">Upload Limit:</strong> Each user can upload a maximum of 4 bills at a time.
                  </p>
                  <p>
                    <strong className="font-medium text-gray-900">Auto-Deletion:</strong> All uploaded bills and their analysis are automatically deleted after 24 hours for your privacy.
                    You can upload more bills once older ones are removed.
                  </p>
                </div>
              </div>
            </div>
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
