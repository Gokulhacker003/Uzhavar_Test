// Shared phone utilities: digits-only and exactly 10 digits
export function sanitizePhone(value) {
  return String(value || '').replace(/\D/g, '').slice(0, 10);
}

export function isValidPhone(value) {
  return /^\d{10}$/.test(String(value || ''));
}
