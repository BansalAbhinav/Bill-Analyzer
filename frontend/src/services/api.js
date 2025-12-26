// Simple API configuration
// This file contains all backend URLs and API helper functions

const API_BASE_URL = 'http://localhost:3000/api/v1';

// API helper with automatic token handling
export const api = {
  // Make a request with automatic token inclusion
  async request(url, options = {}) {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // Prepare headers
    const headers = {
      ...options.headers,
    };
    
    // Add token if it exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Add Content-Type for JSON requests
    if (options.body && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
    
    // Make the fetch request
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });
    
    // Handle errors
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Something went wrong');
    }
    
    return response.json();
  },
  
  // GET request
  get(url) {
    return this.request(url, { method: 'GET' });
  },
  
  // POST request
  post(url, data) {
    return this.request(url, {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  },
  
  // DELETE request
  delete(url) {
    return this.request(url, { method: 'DELETE' });
  },
};

// API endpoints
export const endpoints = {
  // Auth endpoints
  auth: {
    login: '/auth/signIn',
    register: '/auth/signUp',
  },
  
  // Bill analysis endpoints
  bills: {
    process: '/data/process',           // Upload and analyze
    getAll: '/data/analyses',           // Get all analyses
    getOne: (id) => `/data/analysis/${id}`,  // Get one analysis
    delete: (id) => `/data/analysis/${id}`,  // Delete analysis
    analytics: '/data/analytics',       // Get statistics
  },
};
