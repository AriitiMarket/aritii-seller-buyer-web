import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PublicRoutes from '@/app/routes/PublicRoutes';
import AuthRoutes from '@/app/routes/AuthRoutes';
import BuyerRoutes from '@/app/routes/BuyerRoutes';
import BusinessRoutes from '@/app/routes/BusinessRoutes';
import ProviderRoutes from '@/app/routes/ProviderRoutes';
import ProtectedRoute from '@/app/routes/ProtectedRoute';
import PageLoader from '@/app/routes/PageLoader';
import ErrorBoundary from '@/components/layout/ErrorBoundary';
import AuthNavigator from '@/shared/components/AuthNavigator';

const NotFound = lazy(() => import('@/public/NotFound'));
const BecomeProvider = lazy(() => import('@/features/provider-application/pages/BecomeProvider'));
const ProviderApplication = lazy(() => import('@/features/provider-application/pages/ProviderApplication'));
const ApplicationStatus = lazy(() => import('@/features/provider-application/pages/ApplicationStatus'));

/**
 * AppRoutes - the single route composition root.
 *
 * Each domain contributes its own route subtree (owned by src/routes/*):
 *   Public Website | Auth | Buyer | Business | Provider
 * There are no duplicate route paths and no cross-domain page imports: a
 * business page is only ever mounted under /business, a provider page only under
 * /provider, and so on (see docs/ROUTES.md).
 *
 * The Admin console lives in a separate application and is intentionally absent.
 */
const AppRoutes = () => (
  <ErrorBoundary>
    <BrowserRouter>
      <ToastContainer position="top-right" />
      <AuthNavigator />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* PUBLIC WEBSITE + CATALOG */}
          {PublicRoutes()}

          {/* AUTH + public seller entry */}
          {AuthRoutes()}

          {/* BUYER - authenticated customer experience */}
          {BuyerRoutes()}

          {/* BUSINESS / SELLER - approved business only */}
          {BusinessRoutes()}

          {/* PROVIDER - delivery provider workspace */}
          {ProviderRoutes()}

          {/* PUBLIC PROVIDER APPLICATION FLOWS */}
          {/* Marketing entry point is public; the form and status pages are
              authenticated because the application belongs to an account (the
              ProtectedRoute redirect brings the applicant back here after login). */}
          <Route path="/become-provider" element={<BecomeProvider />} />
          <Route
            path="/provider-application"
            element={
              <ProtectedRoute redirectTo="/delivery-sign-up">
                <ProviderApplication />
              </ProtectedRoute>
            }
          />
          <Route
            path="/provider-application/status"
            element={
              <ProtectedRoute redirectTo="/delivery-sign-up">
                <ApplicationStatus />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </ErrorBoundary>
);

export default AppRoutes;
