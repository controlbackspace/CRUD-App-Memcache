import React from 'react';
import { useAuth } from '../hooks/useAuth';


export const ProtectedRoute = ({ children, fallbackRedirect = '/login' }) => {
  const { token, loading } = useAuth();

  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h3>Loading authentication engine records...</h3>
      </div>
    );
  }

  
  if (!token) {
    window.location.href = fallbackRedirect;
    return null;
  }

  
  return children;
};