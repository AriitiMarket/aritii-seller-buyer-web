import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Loading from '@/components/common/Loading';

/**
 * ProviderGuard - route guard for delivery provider routes.
 *
 * This ensures that only users with delivery provider capability can access
 * the provider workspace. The backend provisions this capability for approved
 * delivery providers.
 *
 * This is a UX guard, not a security boundary. The backend makes the final
 * authorization decisions.
 */
const ProviderGuard = ({ children, redirectTo }) => {
  const location = useLocation();
  const { loading, isAuthenticated, user } = useSelector((state) => state.user || {});
  
  // Check if user has provider capability
  const hasProviderCapability = user?.capabilities?.includes('PROVIDER') || user?.role === 'PROVIDER';

  // Wait for auth to resolve
  if (loading !== false) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo || '/login'} replace state={{ from: location.pathname }} />;
  }

  if (!hasProviderCapability) {
    // No provider capability - redirect to appropriate page
    return <Navigate to={redirectTo || '/my-dashboard'} replace />;
  }

  if (children) return children;

  return <Outlet />;
};

export default ProviderGuard;
