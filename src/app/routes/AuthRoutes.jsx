import React, { lazy } from 'react';
import { Navigate, Route } from 'react-router-dom';
import { SellerRegistrationGuard } from '@/seller-registration';

/**
 * Authentication routes (and the public business/seller entry point).
 *
 * `/become-a-seller` is public on purpose: visitors must be able to learn about selling and
 * sign in / register. It routes by auth state inside the page and leads INTO the
 * business domain - it is not a business workspace route.
 */
const LoginPage = lazy(() => import('@/auth/pages/LoginPage'));
const CustomerPortalLoginDemo = lazy(() => import('@/auth/pages/CustomerPortalLoginDemo'));
const SignUpPage = lazy(() => import('@/auth/pages/SignUpPage'));
const ShopLoginPage = lazy(() => import('@/auth/components/ShopLoginPage'));
const CreateShopPage = lazy(() => import('@/auth/pages/CreateShopPage'));
const SellerRegistrationPage = lazy(() => import('@/seller-registration/pages/SellerRegistrationPage'));
const SellerApplicationStatusPage = lazy(() => import('@/seller-registration/pages/SellerApplicationStatusPage'));

export const AuthRoutes = () => (
  <>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/sign-up" element={<SignUpPage />} />
    <Route path="/seller-sign-up" element={<SignUpPage registrationType="SELLER" />} />
    <Route path="/delivery-sign-up" element={<SignUpPage registrationType="PROVIDER" />} />
    <Route path="/shop-login" element={<ShopLoginPage />} />
    <Route path="/create-shop" element={<CreateShopPage />} />
    {/* ==================== SANDBOX / DEMO ROUTES ==================== */}
    {/* Deliberately isolated from the real auth flow (which is role-specific). */}
    <Route path="/customer-portal-login-demo" element={<CustomerPortalLoginDemo />} />

    <Route path="/become-a-seller" element={<SignUpPage registrationType="SELLER" />} />
    <Route path="/sell" element={<SignUpPage registrationType="SELLER" />} />
    <Route element={<SellerRegistrationGuard />}>
      <Route path="/seller-registration" element={<SellerRegistrationPage />} />
      <Route path="/seller-registration/status" element={<SellerApplicationStatusPage />} />
    </Route>
  </>
);

export default AuthRoutes;
