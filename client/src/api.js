// client/src/api.js
const API_BASE = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');

export function apiUrl(path) {
  if (!path) path = '';
  if (!API_BASE) return path.startsWith('/') ? path : `/${path}`;
  return path.startsWith('/') ? `${API_BASE}${path}` : `${API_BASE}/${path}`;
}

export async function getHello() {
  const res = await fetch(apiUrl('/api/hello'), {
    headers: { 'Accept': 'application/json' }
    // credentials: 'include' // only if using cookies + server credentials: true
  });
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
}
