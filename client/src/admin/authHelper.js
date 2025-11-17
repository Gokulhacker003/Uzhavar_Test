// Authentication helper functions for admin access

const AUTH_KEY = 'uzhavar_admin_auth';

// Safe sessionStorage wrapper - clears when browser/tab closes
const safeSessionStorage = {
  getItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        return window.sessionStorage.getItem(key);
      }
    } catch (error) {
      console.error('Error reading from sessionStorage:', error);
    }
    return null;
  },
  setItem: (key, value) => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem(key, value);
      }
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
    }
  },
  removeItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Error removing from sessionStorage:', error);
    }
  }
};

export const authHelper = {
  // Check if user is authenticated
  isAuthenticated: () => {
    const authData = safeSessionStorage.getItem(AUTH_KEY);
    
    if (!authData) {
      return false;
    }
    
    try {
      const { authenticated } = JSON.parse(authData);
      return authenticated === true;
    } catch (error) {
      console.error('Error parsing auth data:', error);
      return false;
    }
  },

  // Login user
  login: (username, password) => {
    // Simple authentication (in production, this should be done server-side)
    if (username === 'admin' && password === 'uzhavar2025') {
      const authData = {
        authenticated: true,
        username: username
      };
      safeSessionStorage.setItem(AUTH_KEY, JSON.stringify(authData));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  },

  // Logout user
  logout: () => {
    safeSessionStorage.removeItem(AUTH_KEY);
  },

  // Get current user info
  getUser: () => {
    const authData = safeSessionStorage.getItem(AUTH_KEY);
    if (!authData) return null;
    
    try {
      const { username, authenticated } = JSON.parse(authData);
      return authenticated ? { username } : null;
    } catch (error) {
      return null;
    }
  }
};
