const BASE_URL = 'http://localhost:5000/api/auth';

export const authService = {
  
  register: async (username, password) => {
    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Registration sequence rejected.');
      }
      return { success: true, data };
    } catch (error) {
      console.error('[Service Exception] Register pipeline error:', error.message);
      throw error;
    }
  },

  
  login: async (username, password) => {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Invalid credential configuration.');
      }
      
      return {
        success: true,
        user: { username: data.username || username },
        token: data.token
      };
    } catch (error) {
      console.error('[Service Exception] Login pipeline error:', error.message);
      throw error;
    }
  }
};