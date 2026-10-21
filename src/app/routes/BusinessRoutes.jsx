import React, { lazy } from 'react';
import { Navigate, Route } from 'react-router-dom';
import ProtectedRoute from '@/app/routes/ProtectedRoute';

/**
 * BUSINESS / SELLER routes - the management workspace of an approved business.
 *
 * Every route is behind ProtectedRoute require="BUSINESS": the backend must have
 * confirmed an approved business capability. The whole domain shares ONE layout
 * (BusinessLayout), which owns the business header + sidebar.
 *
 * Route concepts follow the target contract:
 *   /business                overview
 *   /business/shops[/:id]    multiple shops per business
 *   /business/products       catalog management (+ create)
 *   /business/orders         order queue
 *   /business/inventory      stock
 *   /business/promotions     commercial offers (own feature)
 *   /business/events         time-based events (own feature)
 *   /business/analytics      reporting
 *   /business/requests       product requests from buyers
 *   /business/settings       account + store profile settings
 */
const BusinessLayout = lazy(() => import('../../business/components/BusinessLayout.jsx'));
const BusinessDashboardPage = lazy(() => import('../../business/pages/Dashboard.jsx'));
const BusinessShopsPage = lazy(() => import('../../business/pages/Shops/Shops.jsx'));
const BusinessShopDetailPage = lazy(() => import('../../business/pages/Shops/ShopDetail.jsx'));
const BusinessProductsPage = lazy(() => import('../../business/pages/Products/Products.jsx'));
const BusinessProductCreatePage = lazy(() => import('../../business/pages/Products/Create.jsx'));
const BusinessProductEditPage = lazy(() => import('../../business/pages/Products/Edit.jsx'));
const BusinessProductDetailPage = lazy(() => import('../../business/pages/Products/Detail.jsx'));
const BusinessInventoryPage = lazy(() => import('../../business/pages/Inventory/Inventory.jsx'));
const BusinessOrdersPage = lazy(() => import('../../business/pages/Orders/Orders.jsx'));
const BusinessOrderDetailPage = lazy(() => import('../../business/pages/Orders/Detail.jsx'));
const BusinessRefundsPage = lazy(() => import('../../business/pages/Orders/Refunds.jsx'));
const BusinessCustomersPage = lazy(() => import('../../business/pages/Customers/Customers.jsx'));
const BusinessFinancePage = lazy(() => import('../../business/pages/Finance/Finance.jsx'));
const BusinessPromotionsPage = lazy(() => import('../../business/pages/Promotions/Promotions.jsx'));
const BusinessRequestsPage = lazy(() => import('../../business/pages/Requests/Requests.jsx'));
const BusinessReportsPage = lazy(() => import('../../business/pages/Reports/Reports.jsx'));
const BusinessReviewsPage = lazy(() => import('../../business/pages/Reviews/Reviews.jsx'));
const BusinessEventsPage = lazy(() => import('../../business/pages/Events/Events.jsx'));
const BusinessAnalyticsPage = lazy(() => import('../../business/pages/Analytics/Analytics.jsx'));
const BusinessSettingsPage = lazy(() => import('../../business/pages/Profile/Settings.jsx'));
const BusinessStoreMetricsPage = lazy(() => import('../../business/pages/Analytics/StoreMetrics.jsx'));

export const BusinessRoutes = () => (
  <Route
    path="/business"
    element={
      <ProtectedRoute require="BUSINESS">
        <BusinessLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<BusinessDashboardPage />} />
    {/* Canonical dashboard is the index route (/business); keep the old path as a redirect */}
    <Route path="dashboard" element={<Navigate to="/business" replace />} />
    {/* Store Profile moved into Settings; Order History merged into Orders */}
    <Route path="profile" element={<Navigate to="/business/settings" replace />} />
    <Route path="orders/history" element={<Navigate to="/business/orders" replace />} />
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
    <Route path="revenue" element={<Navigate to="/business/finance?tab=revenue" replace />} />
    <Route path="transactions" element={<Navigate to="/business/finance?tab=transactions" replace />} />

    {/* Payment Management Routes (NEW) */}
    <Route path="payment-accounts" element={<Navigate to="/business/finance?tab=payment-accounts" replace />} />
    <Route path="payouts" element={<Navigate to="/business/finance?tab=payouts" replace />} />
    <Route path="refund-management" element={<Navigate to="/business/finance?tab=refund-management" replace />} />
    <Route path="returns" element={<Navigate to="/business/finance?tab=returns" replace />} />
    <Route path="metrics" element={<Navigate to="/business/finance?tab=metrics" replace />} />

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
    <Route path="store" element={<Navigate to="/business/settings" replace />} />
  </Route>
);

export default BusinessRoutes;
