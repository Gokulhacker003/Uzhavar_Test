import React from 'react';
import { Navigate } from 'react-router-dom';
import { authHelper } from './authHelper';

// Protected Route Component - redirects to login if not authenticated
export default function ProtectedRoute({ children }) {
  const isAuthenticated = authHelper.isAuthenticated();
  
  if (!isAuthenticated) {
    // Redirect to admin login page if not authenticated
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
}
