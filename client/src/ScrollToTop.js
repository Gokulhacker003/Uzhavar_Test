import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Ensure we reset scroll to top on every navigation
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    } catch (err) {
      // fallback for older browsers
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
