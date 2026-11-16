import React, { lazy } from 'react';
import { Navigate, Route } from 'react-router-dom';
import ProtectedRoute from '@/app/routes/ProtectedRoute';

/**
 * BUSINESS / SELLER routes - the management workspace of an approved business.
 *
 * Every route is behind ProtectedRoute require="BUSINESS": the backend must have
 * confirmed an approved business capability. The domain uses BusinessLayout,
 * which owns the business header + sidebar without cross-portal style leakage.
 *
 * Namespaces:
 *   /business/* - Canonical business portal route
 *   /seller/*   - Dedicated merchant portal namespace
 */
const BusinessLayout = lazy(() => import('@/features/seller/components/BusinessLayout.jsx'));
const BusinessDashboardPage = lazy(() => import('@/features/seller/pages/Dashboard.jsx'));
const BusinessShopsPage = lazy(() => import('@/features/seller/pages/Shops/Shops.jsx'));
const BusinessShopDetailPage = lazy(() => import('@/features/seller/pages/Shops/ShopDetail.jsx'));
const BusinessProductsPage = lazy(() => import('@/features/seller/pages/Products/Products.jsx'));
const BusinessProductCreatePage = lazy(() => import('@/features/seller/pages/Products/Create.jsx'));
const BusinessProductEditPage = lazy(() => import('@/features/seller/pages/Products/Edit.jsx'));
const BusinessProductDetailPage = lazy(() => import('@/features/seller/pages/Products/Detail.jsx'));
const BusinessInventoryPage = lazy(() => import('@/features/seller/pages/Inventory/Inventory.jsx'));
const BusinessOrdersPage = lazy(() => import('@/features/seller/pages/Orders/Orders.jsx'));
const BusinessOrderDetailPage = lazy(() => import('@/features/seller/pages/Orders/Detail.jsx'));
const BusinessRefundsPage = lazy(() => import('@/features/seller/pages/Orders/Refunds.jsx'));
const BusinessCustomersPage = lazy(() => import('@/features/seller/pages/Customers/Customers.jsx'));
const BusinessFinancePage = lazy(() => import('@/features/seller/pages/Finance/Finance.jsx'));
const BusinessPromotionsPage = lazy(() => import('@/features/seller/pages/Promotions/Promotions.jsx'));
const BusinessRequestsPage = lazy(() => import('@/features/seller/pages/Requests/Requests.jsx'));
const BusinessReportsPage = lazy(() => import('@/features/seller/pages/Reports/Reports.jsx'));
const BusinessReviewsPage = lazy(() => import('@/features/seller/pages/Reviews/Reviews.jsx'));
const BusinessEventsPage = lazy(() => import('@/features/seller/pages/Events/Events.jsx'));
const BusinessAnalyticsPage = lazy(() => import('@/features/seller/pages/Analytics/Analytics.jsx'));
const BusinessSettingsPage = lazy(() => import('@/features/seller/pages/Profile/Settings.jsx'));
const BusinessStoreMetricsPage = lazy(() => import('@/features/seller/pages/Analytics/StoreMetrics.jsx'));

const renderBusinessChildRoutes = (basePath) => (
  <>
    <Route index element={<BusinessDashboardPage />} />
    {/* Canonical dashboard is the index route; keep the old path as a redirect */}
    <Route path="dashboard" element={<Navigate to={basePath} replace />} />
    {/* Store Profile moved into Settings; Order History merged into Orders */}
    <Route path="profile" element={<Navigate to={`${basePath}/settings`} replace />} />
    <Route path="orders/history" element={<Navigate to={`${basePath}/orders`} replace />} />
    <Route path="reviews" element={<BusinessReviewsPage />} />

    <Route path="shops" element={<BusinessShopsPage />} />
    <Route path="shops/:id" element={<BusinessShopDetailPage />} />

    <Route path="products" element={<BusinessProductsPage />} />
    <Route path="products/create" element={<BusinessProductCreatePage />} />
    <Route path="products/:id/edit" element={<BusinessProductEditPage />} />
    <Route path="products/:id" element={<BusinessProductDetailPage />} />

    <Route path="inventory" element={<BusinessInventoryPage />} />

    <Route path="orders" element={<BusinessOrdersPage />} />
    <Route path="orders/:id" element={<BusinessOrderDetailPage />} />
    <Route path="refunds" element={<BusinessRefundsPage />} />
    <Route path="customers" element={<BusinessCustomersPage />} />
    <Route path="finance" element={<BusinessFinancePage />} />
    {/* Keep older finance URLs usable and open the matching Finance tab. */}
    <Route path="revenue" element={<Navigate to={`${basePath}/finance?tab=revenue`} replace />} />
    <Route path="transactions" element={<Navigate to={`${basePath}/finance?tab=transactions`} replace />} />

    {/* Payment Management Routes */}
    <Route path="payment-accounts" element={<Navigate to={`${basePath}/finance?tab=payment-accounts`} replace />} />
    <Route path="payouts" element={<Navigate to={`${basePath}/finance?tab=payouts`} replace />} />
    <Route path="refund-management" element={<Navigate to={`${basePath}/finance?tab=refund-management`} replace />} />
    <Route path="returns" element={<Navigate to={`${basePath}/finance?tab=returns`} replace />} />
    <Route path="metrics" element={<Navigate to={`${basePath}/finance?tab=metrics`} replace />} />

    {/* Promotions and Events are separate features, each with its own page */}
    <Route path="promotions" element={<BusinessPromotionsPage />} />
    {/* Requests addressed to this shop — the seller side of Product Requests */}
    <Route path="requests" element={<BusinessRequestsPage />} />
    <Route path="events" element={<BusinessEventsPage />} />

    <Route path="analytics" element={<BusinessAnalyticsPage />} />
    <Route path="reports" element={<BusinessReportsPage />} />
    <Route path="store-metrics" element={<BusinessStoreMetricsPage />} />
    <Route path="settings" element={<BusinessSettingsPage />} />

    {/* Legacy alias kept so existing links keep working */}
    <Route path="store" element={<Navigate to={`${basePath}/settings`} replace />} />
  </>
);

export const BusinessRoutes = () => (
  <>
    {/* Canonical /business portal */}
    <Route
      path="/business"
      element={
        <ProtectedRoute require="BUSINESS">
          <BusinessLayout />
        </ProtectedRoute>
      }
    >
      {renderBusinessChildRoutes('/business')}
    </Route>

    {/* Explicit /seller merchant namespace */}
    <Route
      path="/seller"
      element={
        <ProtectedRoute require="BUSINESS">
          <BusinessLayout />
        </ProtectedRoute>
      }
    >
      {renderBusinessChildRoutes('/seller')}
    </Route>
  </>
);

export default BusinessRoutes;
