import React, { lazy } from 'react';
import { Navigate, Route } from 'react-router-dom';
import ProtectedRoute from '@/app/routes/ProtectedRoute';

/**
 * PROVIDER routes - the delivery provider workspace.
 *
 * This domain is for external delivery providers who work with Aritii's delivery
 * system. Providers can view available work, manage their deliveries, track batches,
 * and update their profile.
 *
 * Route concepts:
 *   /provider                      overview and available work
 *   /provider/deliveries            active and completed deliveries
 *   /provider/batches                delivery batches for efficiency
 *   /provider/batches/:id           batch details
 *   /provider/profile               provider profile and settings
 *   /provider/availability           availability toggle
 *   /provider/warnings              warnings and notifications
 */
const ProviderLayout = lazy(() => import('@/features/delivery-provider/components/ProviderLayout'));
const ProviderOverviewPage = lazy(() => import('@/features/delivery-provider/pages/ProviderOverview'));
const AvailableWorkPage = lazy(() => import('@/features/delivery-provider/pages/AvailableWork'));
const MyDeliveriesPage = lazy(() => import('@/features/delivery-provider/pages/MyDeliveries'));
const BatchesPage = lazy(() => import('@/features/delivery-provider/pages/Batches'));
const BatchDetailsPage = lazy(() => import('@/features/delivery-provider/pages/BatchDetails'));
const ActiveDeliveryPage = lazy(() => import('@/features/delivery-provider/pages/ActiveDelivery'));
const WarningsPage = lazy(() => import('@/features/delivery-provider/pages/Warnings'));
const ProviderProfilePage = lazy(() => import('@/features/delivery-provider/pages/ProviderProfile'));
const OperatingAreaPage = lazy(() => import('@/features/delivery-provider/pages/OperatingArea'));
const ProviderWalletPage = lazy(() => import('@/features/delivery-provider/pages/Wallet'));

export const ProviderRoutes = () => (
  <Route
    path="/provider"
    element={
      <ProtectedRoute require="PROVIDER">
        <ProviderLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<ProviderOverviewPage />} />
    <Route path="dashboard" element={<Navigate to="/provider" replace />} />
    <Route path="available-work" element={<AvailableWorkPage />} />
    <Route path="deliveries" element={<MyDeliveriesPage />} />
    <Route path="deliveries/:id" element={<ActiveDeliveryPage />} />
    <Route path="batches" element={<BatchesPage />} />
    <Route path="batches/:id" element={<BatchDetailsPage />} />
    <Route path="warnings" element={<WarningsPage />} />
    <Route path="profile" element={<ProviderProfilePage />} />
    <Route path="operating-area" element={<OperatingAreaPage />} />
    <Route path="wallet" element={<ProviderWalletPage />} />
  </Route>
);

export default ProviderRoutes;
