import React, { lazy } from 'react';
import { Navigate, Route } from 'react-router-dom';
import ProtectedRoute from '@/app/routes/ProtectedRoute';

/**
 * PROVIDER / DELIVERY routes - the courier partner hub and operations.
 *
 * This domain is for delivery providers who work with Aritii's delivery
 * system. Providers can view available work, manage their deliveries, track batches,
 * and manage their earnings/wallet.
 *
 * Namespaces:
 *   /provider/*        - Canonical delivery workspace route
 *   /delivery-center/* - Dedicated courier partner hub namespace
 */
const ProviderLayout = lazy(() => import('@/features/delivery/components/ProviderLayout'));
const ProviderOverviewPage = lazy(() => import('@/features/delivery/pages/ProviderOverview'));
const AvailableWorkPage = lazy(() => import('@/features/delivery/pages/AvailableWork'));
const MyDeliveriesPage = lazy(() => import('@/features/delivery/pages/MyDeliveries'));
const BatchesPage = lazy(() => import('@/features/delivery/pages/Batches'));
const BatchDetailsPage = lazy(() => import('@/features/delivery/pages/BatchDetails'));
const ActiveDeliveryPage = lazy(() => import('@/features/delivery/pages/ActiveDelivery'));
const WarningsPage = lazy(() => import('@/features/delivery/pages/Warnings'));
const ProviderProfilePage = lazy(() => import('@/features/delivery/pages/ProviderProfile'));
const OperatingAreaPage = lazy(() => import('@/features/delivery/pages/OperatingArea'));
const ProviderWalletPage = lazy(() => import('@/features/delivery/pages/Wallet'));

const renderProviderChildRoutes = (basePath) => (
  <>
    <Route index element={<ProviderOverviewPage />} />
    <Route path="dashboard" element={<Navigate to={basePath} replace />} />
    <Route path="available-work" element={<AvailableWorkPage />} />
    <Route path="deliveries" element={<MyDeliveriesPage />} />
    <Route path="deliveries/:id" element={<ActiveDeliveryPage />} />
    <Route path="batches" element={<BatchesPage />} />
    <Route path="batches/:id" element={<BatchDetailsPage />} />
    <Route path="warnings" element={<WarningsPage />} />
    <Route path="profile" element={<ProviderProfilePage />} />
    <Route path="operating-area" element={<OperatingAreaPage />} />
    <Route path="wallet" element={<ProviderWalletPage />} />
  </>
);

export const ProviderRoutes = () => (
  <>
    {/* Canonical /provider workspace */}
    <Route
      path="/provider"
      element={
        <ProtectedRoute require="PROVIDER">
          <ProviderLayout />
        </ProtectedRoute>
      }
    >
      {renderProviderChildRoutes('/provider')}
    </Route>

    {/* Dedicated /delivery-center/hub courier partner hub namespace */}
    <Route
      path="/delivery-center/hub"
      element={
        <ProtectedRoute require="PROVIDER">
          <ProviderLayout />
        </ProtectedRoute>
      }
    >
      {renderProviderChildRoutes('/delivery-center/hub')}
    </Route>

    {/* Courier operations aliases under /delivery-center/* */}
    <Route
      path="/delivery-center"
      element={
        <ProtectedRoute require="PROVIDER">
          <ProviderLayout />
        </ProtectedRoute>
      }
    >
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
  </>
);

export default ProviderRoutes;
