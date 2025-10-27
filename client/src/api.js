// client/src/api.js
const API_BASE = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');

// Debug: Log the API base URL
console.log('🔧 API_BASE configured as:', API_BASE || '(using proxy)');

export function apiUrl(path) {
  if (!path) path = '';
  
  // If no API_BASE, return relative path (uses proxy)
  if (!API_BASE) {
    return path.startsWith('/') ? path : `/${path}`;
  }
  
  // Use URL() for proper URL construction
  try {
    const baseUrl = new URL(API_BASE);
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const fullUrl = new URL(cleanPath, baseUrl);
    return fullUrl.toString();
  } catch (error) {
    console.error('❌ Error constructing URL:', error);
    // Fallback to string concatenation
    return path.startsWith('/') ? `${API_BASE}${path}` : `${API_BASE}/${path}`;
  }
}

// Helper function to convert image paths to full URLs
export function imageUrl(path) {
  if (!path) return '';
  
  // If already a full URL (http/https), return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // If relative path, prepend API base URL
  if (API_BASE) {
    try {
      const baseUrl = new URL(API_BASE);
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      const fullUrl = new URL(cleanPath, baseUrl);
      return fullUrl.toString();
    } catch (error) {
      console.error('❌ Error constructing image URL:', error);
      return path.startsWith('/') ? `${API_BASE}${path}` : `${API_BASE}/${path}`;
    }
  }
  
  // In development with proxy, return relative path
  return path.startsWith('/') ? path : `/${path}`;
}

export async function getHello() {
  const res = await fetch(apiUrl('/api/hello'), {
    headers: { 'Accept': 'application/json' }
    // credentials: 'include' // only if using cookies + server credentials: true
  });
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
}
