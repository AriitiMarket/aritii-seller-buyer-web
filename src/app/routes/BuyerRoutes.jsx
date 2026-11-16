import React, { lazy } from 'react';
import { Navigate, Route, useParams } from 'react-router-dom';
import ProtectedRoute from '@/app/routes/ProtectedRoute';

function ParamRedirect({ to }) {
  const params = useParams();
  let resolved = to;
  for (const [k, v] of Object.entries(params)) {
    resolved = resolved.replace(`:${k}`, v || '');
  }
  return <Navigate to={resolved} replace />;
}

/**
 * BUYER routes - the authenticated customer experience.
 *
 * Marketplace browsing (Products, Shops) is now unified in the public marketplace.
 * This keeps all shopping navigation in one place, accessible to both authenticated
 * and unauthenticated users.
 *
 * The buyer dashboard contains only buyer-specific account management:
 * - Overview
 * - Orders & Order Tracking
 * - Addresses
 * - Wishlist
 * - Reviews
 * - Requests (messaging with sellers)
 * - Settings
 * - Cart management
 * - Checkout & Payment
 */
const BuyerLayout = lazy(() => import('@/features/buyer/components/BuyerLayout'));
// BuyerAccountLayout is aliased to BuyerLayout to eliminate duplication.
const BuyerOverviewPage = lazy(() => import('@/features/buyer/pages/Dashboard/Dashboard'));
const BuyerProfilePage = lazy(() => import('@/features/buyer/pages/Profile'));
const BuyerOrdersPage = lazy(() => import('@/features/buyer/pages/Orders'));
const BuyerAddressesPage = lazy(() => import('@/features/buyer/pages/Addresses'));
const BuyerWishlistPage = lazy(() => import('@/features/buyer/pages/Wishlist'));
const BuyerReviewsPage = lazy(() => import('@/features/buyer/pages/Reviews'));
const BuyerRequestsPage = lazy(() => import('@/features/buyer/pages/Requests/Requests'));
const BuyerSelectSellerPage = lazy(() => import('@/features/buyer/pages/Requests/SelectSeller'));
const BuyerSellerProfilePage = lazy(() => import('@/features/buyer/pages/Requests/SellerProfile'));
const BuyerNewRequestPage = lazy(() => import('@/features/buyer/pages/Requests/NewRequest'));
const BuyerRequestWorkspacePage = lazy(() => import('@/features/buyer/pages/Requests/RequestWorkspace'));
const BuyerSettingsPage = lazy(() => import('@/features/buyer/pages/Settings'));
const BuyerCartPage = lazy(() => import('@/features/buyer/pages/Cart'));
const BuyerPaymentMethodsPage = lazy(() => import('@/features/buyer/pages/PaymentMethods'));
const BuyerTransactionsPage = lazy(() => import('@/features/buyer/pages/Transactions'));
const CheckoutPage = lazy(() => import('@/features/buyer/pages/Checkout'));
const OrderSuccessPage = lazy(() => import('@/features/buyer/pages/OrderSuccess'));
const PaymentPage = lazy(() => import('@/features/buyer/pages/Payment'));
const PaymentReturnPage = lazy(() => import('@/features/buyer/pages/PaymentReturn'));
const BuyerOrderDetailPage = lazy(() => import('@/features/buyer/pages/OrderDetail'));
const BuyerTrackOrderPage = lazy(() => import('@/features/buyer/pages/OrderTracking'));

export const BuyerRoutes = () => (
  <>
    {/* Direct dashboard aliases */}
    <Route path="/dashboard" element={<Navigate to="/my-dashboard" replace />} />
    <Route path="/buyer" element={<Navigate to="/my-dashboard" replace />} />
    <Route path="/buyer/dashboard" element={<Navigate to="/my-dashboard" replace />} />

    {/* Standalone buyer flows (own chrome, not the dashboard shell) */}
    <Route
      path="/checkout"
      element={
        <ProtectedRoute require="BUYER">
          <CheckoutPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/payment"
      element={
        <ProtectedRoute require="BUYER">
          <PaymentPage />
        </ProtectedRoute>
      }
    />
    <Route path="/payment/return" element={<ProtectedRoute require="BUYER"><PaymentReturnPage /></ProtectedRoute>} />
    <Route
      path="/buyer/requests"
      element={
        <ProtectedRoute require="BUYER">
          <BuyerRequestsPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/order/success"
      element={
        <ProtectedRoute require="BUYER">
          <OrderSuccessPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/user/order/:id"
      element={
        <ProtectedRoute require="BUYER">
          <BuyerOrderDetailPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/user/track/order/:id"
      element={
        <ProtectedRoute require="BUYER">
          <BuyerTrackOrderPage />
        </ProtectedRoute>
      }
    />

    {/* Payment surfaces. The buyer sidebar links to /payment-methods and
        /transactions, but neither path had a route — both links 404'd. */}
    <Route
      path="/payment-methods"
      element={
        <ProtectedRoute require="BUYER">
          <BuyerPaymentMethodsPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/transactions"
      element={
        <ProtectedRoute require="BUYER">
          <BuyerTransactionsPage />
        </ProtectedRoute>
      }
    />

    {/* Unified buyer dashboard - account management only */}
<Route
  path="/my-dashboard"
  element={
    <ProtectedRoute require="BUYER">
      <BuyerLayout />
    </ProtectedRoute>
  }
>
      <Route index element={<BuyerOverviewPage />} />
      <Route path="profile" element={<BuyerProfilePage />} />
      <Route path="orders" element={<BuyerOrdersPage />} />
      <Route path="addresses" element={<BuyerAddressesPage />} />
      <Route path="wishlist" element={<BuyerWishlistPage />} />
      <Route path="reviews" element={<BuyerReviewsPage />} />
      <Route path="requests" element={<BuyerRequestsPage />} />
      {/* Static request-flow segments must be declared so they never fall into
          the `requests/:id` workspace route (React Router ranks static above
          dynamic, but declaring them keeps the intent explicit). */}
      <Route path="requests/new" element={<BuyerSelectSellerPage />} />
      <Route path="requests/new/:shopId" element={<BuyerNewRequestPage />} />
      <Route path="requests/sellers/:shopId" element={<BuyerSellerProfilePage />} />
      <Route path="requests/:id" element={<BuyerRequestWorkspacePage />} />
      <Route path="settings" element={<BuyerSettingsPage />} />
      <Route path="cart" element={<BuyerCartPage />} />

      {/* Marketplace browsing redirects to public marketplace */}
      <Route path="marketplace" element={<Navigate to="/products" replace />} />
      <Route path="marketplace/product/:id" element={<ParamRedirect to="/product/:id" />} />
      <Route path="shops" element={<Navigate to="/shops" replace />} />
      <Route path="shops/:id" element={<ParamRedirect to="/shops/:id" />} />

      {/* Legacy/incorrect URL shapes — redirect instead of 404. */}
      <Route path="product/:id" element={<ParamRedirect to="/product/:id" />} />
    </Route>
  </>
);

export default BuyerRoutes;
