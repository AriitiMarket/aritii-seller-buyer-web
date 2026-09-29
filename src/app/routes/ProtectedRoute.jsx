import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Loading from '@/components/common/Loading';

/**
 * ProtectedRoute - the frontend route guard for every authenticated domain.
 *
 * IMPORTANT: this is a UX guard, NOT the security boundary. The backend decides
 * what a caller may read or change; hiding a route only prevents a confusing
 * screen. See docs/AUTHORIZATION.md.
 *
 * Usage:
 *   <Route element={<ProtectedRoute />}> ...nested protected routes... </Route>
 *   <ProtectedRoute require="BUSINESS" />   -> approved business account only
 *   <ProtectedRoute require="BUYER" />      -> non-seller buyers only
 *   <ProtectedRoute require="DELIVERY" />   -> delivery provider only (alias of PROVIDER)
 *   <ProtectedRoute require="PROVIDER" />   -> delivery provider only
 *
 * `require` values mirror the backend capability model:
 *   AUTHENTICATED (default) | BUYER | BUSINESS | DELIVERY | PROVIDER | ADMIN
 *   (ADMIN belongs to the separate admin application and is never routed here.)
 *
 * DELIVERY and PROVIDER are the same actor: the delivery workspace is the
 * provider workspace, so both gate on the PROVIDER capability. Gating DELIVERY
 * on the seller capability (as this guard used to) made /delivery unreachable
 * for providers and wrongly admitted sellers.
 */
const ProtectedRoute = ({ children, require = 'AUTHENTICATED', redirectTo }) => {
  const location = useLocation();
  const { loading, isAuthenticated, user } = useSelector((state) => state.user || {});
  const { isLoading: sellerLoading, isSeller } = useSelector((state) => state.seller || {});

  const needsBusiness = require === 'BUSINESS';
  const needsBuyer = require === 'BUYER';
  const needsProvider = require === 'PROVIDER' || require === 'DELIVERY';

  const hasSellerCapability = isSeller;
  const hasProviderCapability =
    user?.capabilities?.includes('PROVIDER') || user?.role === 'PROVIDER';

  // Wait for auth + (on business routes) seller capability resolution.
  // sellerLoading is true ONLY while loadSeller is actively running.
  if (loading !== false || (needsBusiness && isAuthenticated && sellerLoading)) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo || '/login'} replace state={{ from: location.pathname }} />;
  }

  if (needsBusiness && !hasSellerCapability) {
    // No approved business capability - fall back to the buyer dashboard.
    return <Navigate to={redirectTo || '/my-dashboard'} replace />;
  }

  if (needsProvider && !hasProviderCapability) {
    // The delivery/provider workspace is provisioned by the backend; without the
    // PROVIDER capability there is nothing to show there.
    return <Navigate to={redirectTo || '/my-dashboard'} replace />;
  }

  if (needsBuyer && hasSellerCapability) {
    // Sellers must use the business dashboard only — buyer routes are buyer-only.
    return <Navigate to={redirectTo || '/business'} replace />;
  }

  if (children) return children;

  return <Outlet />;
};

export default ProtectedRoute;
