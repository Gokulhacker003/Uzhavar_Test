// client/src/api.js
const API_BASE = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');

export function apiUrl(path) {
  if (!path) path = '';
  if (!API_BASE) return path.startsWith('/') ? path : `/${path}`;
  return path.startsWith('/') ? `${API_BASE}${path}` : `${API_BASE}/${path}`;
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
    return path.startsWith('/') ? `${API_BASE}${path}` : `${API_BASE}/${path}`;
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
