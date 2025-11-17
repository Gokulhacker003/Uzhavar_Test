import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthProvider';

// Protected Route Component - redirects to login if not authenticated
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAdminAuth();
  
  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'rgba(255, 255, 255, 0.95)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3em', marginBottom: '0.5em' }}>🌾</div>
          <div>Loading...</div>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    // Redirect to admin login page if not authenticated
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
}
