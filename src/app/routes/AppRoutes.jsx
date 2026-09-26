import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PublicRoutes from '@/app/routes/PublicRoutes';
import AuthRoutes from '@/app/routes/AuthRoutes';
import BuyerRoutes from '@/app/routes/BuyerRoutes';
import BusinessRoutes from '@/app/routes/BusinessRoutes';
import PageLoader from '@/app/routes/PageLoader';
import ErrorBoundary from '@/components/layout/ErrorBoundary';
import AuthNavigator from '@/shared/components/AuthNavigator';

const NotFound = lazy(() => import('@/public/NotFound'));

/**
 * AppRoutes - the single route composition root.
 *
 * Each domain contributes its own route subtree (owned by src/routes/*):
 *   Public Website | Auth | Buyer | Business | Delivery
 * There are no duplicate route paths and no cross-domain page imports: a
 * business page is only ever mounted under /business, a delivery page only under
 * /delivery, and so on (see docs/ROUTES.md).
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

          {/* DELIVERY - not exposed by the customer frontend yet (docs/ROUTES.md
              "Delivery boundary"): buyer delivery visibility is /user/track/order/:id.
              src/app/routes/DeliveryRoutes.jsx is kept as scaffolding but is not mounted. */}

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </ErrorBoundary>
);

export default AppRoutes;
