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

  // ---- Approval status (user_roles.status) carried on the profile -----------
  // `roleStatuses` only lists roles the account actually holds, e.g.
  // { SELLER: 'PENDING' }; a missing key means "never applied for that role".
  // A role that is neither ACTIVE nor absent is one still waiting on approval —
  // or that was rejected / suspended. Such an account stays locked to that
  // role's own waiting room and must never reach a buyer interface.
  const LOCKED_STATUSES = ['PENDING', 'REJECTED', 'SUSPENDED'];
  const roleStatuses = user?.roleStatuses || {};
  const statusOf = (role) =>
    roleStatuses[role] ? String(roleStatuses[role]).toUpperCase() : '';
  const sellerLocked = LOCKED_STATUSES.includes(statusOf('SELLER'));
  const providerLocked = LOCKED_STATUSES.includes(statusOf('PROVIDER'));

  // Wait for auth + (on business routes) seller capability resolution.
  // sellerLoading is true ONLY while loadSeller is actively running.
  if (loading !== false || (needsBusiness && isAuthenticated && sellerLoading)) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo || '/login'} replace state={{ from: location.pathname }} />;
  }

  if (needsBusiness && !hasSellerCapability) {
    // No approved business capability - fall back to the buyer dashboard. A seller
    // still in review (or rejected / suspended) belongs in its own waiting room,
    // not the buyer dashboard it would otherwise land on.
    if (sellerLocked) return <Navigate to="/seller-registration/status" replace />;
    return <Navigate to={redirectTo || '/my-dashboard'} replace />;
  }

  if (needsProvider && !hasProviderCapability) {
    // The delivery/provider workspace is provisioned by the backend; without the
    // PROVIDER capability there is nothing to show there. A provider still in
    // review goes to its status page instead of the buyer dashboard.
    if (providerLocked) return <Navigate to="/provider-application/status" replace />;
    return <Navigate to={redirectTo || '/my-dashboard'} replace />;
  }

  if (needsBuyer && hasSellerCapability) {
    // Sellers must use the business dashboard only — buyer routes are buyer-only.
    return <Navigate to={redirectTo || '/business'} replace />;
  }

  // Strict role separation: an account registered as a seller or delivery provider
  // is locked to that role until it is approved. While pending — and once rejected
  // or suspended — it is kept out of every buyer interface and sent to its status
  // page, where it can continue, track or fix the application.
  if (needsBuyer && sellerLocked) {
    return <Navigate to="/seller-registration/status" replace />;
  }

  if (needsBuyer && providerLocked) {
    return <Navigate to="/provider-application/status" replace />;
  }

  if (children) return children;

  return <Outlet />;
};

export default ProtectedRoute;
