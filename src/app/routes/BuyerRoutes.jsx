import React, { lazy } from 'react';
import { Navigate, Route } from 'react-router-dom';
import ProtectedRoute from '@/app/routes/ProtectedRoute';

/**
 * BUYER routes - the authenticated customer experience.
 *
 * The dashboard nested routes all render inside BuyerLayout (which owns the
 * buyer header + sidebar). Business management is deliberately NOT available
 * under /my-dashboard: it has its own domain at /business (see BusinessRoutes).
 */
const BuyerLayout = lazy(() => import('@/buyer/components/BuyerLayout'));
const BuyerOverviewPage = lazy(() => import('@/buyer/pages/Dashboard/Dashboard'));
const BuyerProfilePage = lazy(() => import('@/buyer/pages/Profile'));
const BuyerOrdersPage = lazy(() => import('@/buyer/pages/Orders'));
const BuyerAddressesPage = lazy(() => import('@/buyer/pages/Addresses'));
const BuyerWishlistPage = lazy(() => import('@/buyer/pages/Wishlist'));
const BuyerReviewsPage = lazy(() => import('@/buyer/pages/Reviews'));
const BuyerRequestsPage = lazy(() => import('@/buyer/pages/Requests/Requests'));
const BuyerSelectSellerPage = lazy(() => import('@/buyer/pages/Requests/SelectSeller'));
const BuyerSellerProfilePage = lazy(() => import('@/buyer/pages/Requests/SellerProfile'));
const BuyerNewRequestPage = lazy(() => import('@/buyer/pages/Requests/NewRequest'));
const BuyerRequestWorkspacePage = lazy(() => import('@/buyer/pages/Requests/RequestWorkspace'));
const BuyerSettingsPage = lazy(() => import('@/buyer/pages/Settings'));
const BuyerProductsBrowse = lazy(() => import('@/buyer/pages/Dashboard/ProductsBrowse'));
const BuyerCartPage = lazy(() => import('@/buyer/pages/Cart'));
const BuyerShopsBrowse = lazy(() => import('@/buyer/pages/Dashboard/ShopsBrowse'));
const BuyerProductDetail = lazy(() => import('@/buyer/pages/Dashboard/BuyerProductDetail'));
const BuyerShopDetail = lazy(() => import('@/buyer/pages/Dashboard/BuyerShopDetail'));
const CheckoutPage = lazy(() => import('@/buyer/pages/Checkout'));
const OrderSuccessPage = lazy(() => import('@/buyer/pages/OrderSuccess'));
const PaymentPage = lazy(() => import('@/buyer/pages/Payment'));
const BuyerOrderDetailPage = lazy(() => import('@/buyer/pages/OrderDetail'));
const BuyerTrackOrderPage = lazy(() => import('@/buyer/pages/OrderTracking'));

export const BuyerRoutes = () => (
  <>
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

    {/* Unified buyer dashboard - one layout, nested content routes */}
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
      <Route path="marketplace" element={<BuyerProductsBrowse />} />
      <Route path="marketplace/product/:id" element={<BuyerProductDetail />} />
      <Route path="shops" element={<BuyerShopsBrowse />} />
      <Route path="shops/:id" element={<BuyerShopDetail />} />
      <Route path="cart" element={<BuyerCartPage />} />

      {/* Legacy/incorrect URL shapes — redirect instead of 404.
          (Product cards used to build /my-dashboard/product/:id, and shop links
          can be built with a marketplace-prefixed base path.) */}
      <Route path="product/:id" element={<Navigate to="marketplace/product/:id" replace />} />
      <Route path="marketplace/shops/:id" element={<Navigate to="../shops/:id" replace />} />
    </Route>
  </>
);

export default BuyerRoutes;
