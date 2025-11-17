import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext(null);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on mount - always start as logged out
  useEffect(() => {
    // Always start logged out - no persistence
    setIsAuthenticated(false);
    setUser(null);
    setIsLoading(false);
  }, []);

  // Clear auth on page unload/refresh/close
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Clear any session data
      setIsAuthenticated(false);
      setUser(null);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const login = (username, password) => {
    // Simple authentication (in production, this should be server-side)
    if (username === 'admin' && password === 'uzhavar2025') {
      setIsAuthenticated(true);
      setUser({ username });
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
