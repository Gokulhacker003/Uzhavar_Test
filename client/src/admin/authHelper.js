// Authentication helper functions for admin access

const AUTH_KEY = 'uzhavar_admin_auth';

// Safe localStorage wrapper for SSR/build compatibility
const safeLocalStorage = {
  getItem: (key) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key, value) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(key);
    }
  }
};

export const authHelper = {
  // Check if user is authenticated
  isAuthenticated: () => {
    const authData = safeLocalStorage.getItem(AUTH_KEY);
    console.log('🔐 Auth check - authData:', authData);
    
    if (!authData) {
      console.log('❌ No auth data found');
      return false;
    }
    
    try {
      const { timestamp, authenticated } = JSON.parse(authData);
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      const timeElapsed = now - timestamp;
      
      console.log('⏱️ Time elapsed:', Math.round(timeElapsed / 1000 / 60), 'minutes');
      console.log('✅ Authenticated:', authenticated);
      console.log('⏰ Session valid:', (now - timestamp) < twentyFourHours);
      
      // Check if session is still valid (within 24 hours)
      if (authenticated && (now - timestamp) < twentyFourHours) {
        console.log('✅ User is authenticated');
        
        // Update timestamp to keep session alive (sliding session)
        const updatedAuthData = {
          authenticated: true,
          timestamp: Date.now(),
          username: JSON.parse(authData).username
        };
        safeLocalStorage.setItem(AUTH_KEY, JSON.stringify(updatedAuthData));
        
        return true;
      }
      
      // Session expired
      console.log('⚠️ Session expired, logging out');
      authHelper.logout();
      return false;
    } catch (error) {
      console.error('❌ Error parsing auth data:', error);
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
      safeLocalStorage.setItem(AUTH_KEY, JSON.stringify(authData));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  },

  // Logout user
  logout: () => {
    safeLocalStorage.removeItem(AUTH_KEY);
  },

  // Get current user info
  getUser: () => {
    const authData = safeLocalStorage.getItem(AUTH_KEY);
    if (!authData) return null;
    
    try {
      const { username, authenticated } = JSON.parse(authData);
      return authenticated ? { username } : null;
    } catch (error) {
      return null;
    }
  }
};
