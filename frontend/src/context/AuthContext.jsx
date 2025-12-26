import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context for authentication
const AuthContext = createContext(null);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check if user is logged in on app start
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    // Check if values exist and are not "undefined" string
    if (savedToken && savedToken !== 'undefined' && savedUser && savedUser !== 'undefined') {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);
  
  // Login function
  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/signIn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }
      
      // Backend returns: { status, message, data: accessToken }
      const token = result.data;
      
      // Save token
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ email })); // Save email as user
      
      setToken(token);
      setUser({ email });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  // Register function
  const register = async (userData) => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/signUp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }
      
      // After registration, user needs to login separately
      // Backend only returns success message, not token
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };
  
  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!token;
  };
  
  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated,
    loading,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
