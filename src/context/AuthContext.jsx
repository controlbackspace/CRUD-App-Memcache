// C:\Users\jakea\Basic_CRUD_Application\src\context\AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';

const getAuthUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api/auth';
  }
  return 'http://localhost:5000/api/auth';
};

const AUTH_URL = getAuthUrl();

const getStoredToken = () => {
  if (Platform.OS === 'web') {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  }
  return null;
};

const setStoredToken = (token) => {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }
};

export const AuthContext = createContext({}); 

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getStoredToken()); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${AUTH_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed.');
      }
      
      if (data.token) {
        setToken(data.token);
        setStoredToken(data.token); 
        setUser(data.user || { username });
        return { success: true };
      }
      
      throw new Error('No token returned from server.');
    } catch (err) {
      console.error('❌ Login Error:', err.message);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${AUTH_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed.');
      }

      return { success: true };
    } catch (err) {
      console.error('❌ Registration Error:', err.message);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setStoredToken(null); 
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};