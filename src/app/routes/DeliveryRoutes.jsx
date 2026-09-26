import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '@/app/routes/ProtectedRoute';

/**
 * DELIVERY routes - the independent fulfilment domain.
 *
 * Guarded separately from buyer/business: only an account with a delivery
 * capability (provisioned by the backend) gets the workspace. The domain is laid
 * out to support Aritii Delivery and external providers.
 */
const DeliveryLayout = lazy(() => import('@/delivery/components/DeliveryLayout'));
const DeliveryDashboardPage = lazy(() => import('@/delivery/pages/Dashboard'));
const DeliveryOrdersPage = lazy(() => import('@/delivery/pages/Orders'));
const DeliveryAssignmentsPage = lazy(() => import('@/delivery/pages/Assignments'));
const DeliveryTrackingPage = lazy(() => import('@/delivery/pages/Tracking'));
const DeliveryProvidersPage = lazy(() => import('@/delivery/pages/Providers'));
const DeliveryHistoryPage = lazy(() => import('@/delivery/pages/History'));

export const DeliveryRoutes = () => (
  <Route
    path="/delivery"
    element={
      <ProtectedRoute require="DELIVERY">
        <DeliveryLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<DeliveryDashboardPage />} />
    <Route path="dashboard" element={<DeliveryDashboardPage />} />
    <Route path="orders" element={<DeliveryOrdersPage />} />
    <Route path="assignments" element={<DeliveryAssignmentsPage />} />
    <Route path="tracking" element={<DeliveryTrackingPage />} />
    <Route path="providers" element={<DeliveryProvidersPage />} />
    <Route path="history" element={<DeliveryHistoryPage />} />
  </Route>
);

export default DeliveryRoutes;
