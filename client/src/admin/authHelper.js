// Helper function to get auth headers
export function getAuthHeaders() {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
}

// Helper function to handle auth errors
export function handleAuthError(error, navigate) {
  if (error.status === 401) {
    localStorage.removeItem('adminToken');
    if (navigate) {
      navigate('/admin/login');
    } else {
      window.location.href = '/admin/login';
    }
  }
}
