import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setNavigate } from '@/services/interceptors';

/**
 * Injects React Router's `navigate` into the API interceptor
 * so 401 refresh failures redirect via SPA routing (no full page reload).
 */
export default function AuthNavigator() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
    return () => setNavigate(null);
  }, [navigate]);

  return null;
}
