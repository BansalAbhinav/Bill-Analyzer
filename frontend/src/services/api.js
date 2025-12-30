// Simple API configuration
// This file contains all backend URLs and API helper functions

// Remove trailing slash if present to prevent double slashes
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
).replace(/\/$/, "");
const API_VERSION = "/api/v1";
const FULL_API_URL = `${API_BASE_URL}${API_VERSION}`;

// API helper with automatic token handling
export const api = {
  // Make a request with automatic token inclusion
  async request(url, options = {}) {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    // Prepare headers
    const headers = {
      ...options.headers,
    };

    // Add token if it exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Add Content-Type for JSON requests
    if (options.body && !(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    // Make the fetch request
    const response = await fetch(`${FULL_API_URL}${url}`, {
      ...options,
      headers,
    });

    // Handle errors
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Something went wrong");
    }

    return response.json();
  },

  // GET request
  get(url) {
    return this.request(url, { method: "GET" });
  },

  // POST request
  post(url, data) {
    return this.request(url, {
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  },

  // DELETE request
  delete(url) {
    return this.request(url, { method: "DELETE" });
  },
};

// API endpoints
export const endpoints = {
  // Auth endpoints
  auth: {
    login: "/auth/signIn",
    register: "/auth/signUp",
  },

  // Bill analysis endpoint
  bills: {
    process: "/data/process", // Upload and analyze (single endpoint)
  },
};

// Health check endpoint (direct to base URL, not versioned)
export const checkServerHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) throw new Error("Health check failed");
    return await response.json();
  } catch (error) {
    return { status: "warming" }; // Default to warming if can't connect
  }
};
