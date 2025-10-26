// Authentication helper functions for admin access

const AUTH_KEY = 'uzhavar_admin_auth';

export const authHelper = {
  // Check if user is authenticated
  isAuthenticated: () => {
    const authData = localStorage.getItem(AUTH_KEY);
    if (!authData) return false;
    
    try {
      const { timestamp, authenticated } = JSON.parse(authData);
      const now = Date.now();
      const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
      
      // Check if session is still valid (within 1 hour)
      if (authenticated && (now - timestamp) < oneHour) {
        return true;
      }
      
      // Session expired
      authHelper.logout();
      return false;
    } catch (error) {
      return false;
    }
  },

  // Login user
  login: (username, password) => {
    // Simple authentication (in production, this should be done server-side)
    if (username === 'admin' && password === 'uzhavar2025') {
      const authData = {
        authenticated: true,
        timestamp: Date.now(),
        username: username
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  },

  // Logout user
  logout: () => {
    localStorage.removeItem(AUTH_KEY);
  },

  // Get current user info
  getUser: () => {
    const authData = localStorage.getItem(AUTH_KEY);
    if (!authData) return null;
    
    try {
      const { username, authenticated } = JSON.parse(authData);
      return authenticated ? { username } : null;
    } catch (error) {
      return null;
    }
  }
};
