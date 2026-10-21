import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import { SellerRegistrationGuard } from '@/seller-registration';
import { LoginModalRedirect } from '@/auth/components/GlobalLoginModal';

/**
 * Auth routes.
 *
 * There is NO login page: the application has exactly ONE sign-in UI, the
 * global login modal (auth/components/UnifiedLoginModal, mounted once by
 * GlobalLoginModal). The `/login` family of URLs is kept purely so existing
 * links and route guards reach that modal instead of a 404.
 */
const SignUpPage = lazy(() => import('@/auth/pages/SignUpPage'));
const ForgotPasswordPage = lazy(() => import('@/auth/pages/ForgotPasswordPage'));
const ContactPage = lazy(() => import('@/auth/pages/ContactPage'));
const CreateShopPage = lazy(() => import('@/auth/pages/CreateShopPage'));
const SellerRegistrationPage = lazy(() => import('@/seller-registration/pages/SellerRegistrationPage'));
const SellerApplicationStatusPage = lazy(() => import('@/seller-registration/pages/SellerApplicationStatusPage'));

export const AuthRoutes = () => (
  <>
    {/* Legacy sign-in URLs → the one global login modal. */}
    <Route path="/login" element={<LoginModalRedirect role="BUYER" />} />
    <Route path="/seller-login" element={<LoginModalRedirect role="SELLER" />} />
    <Route path="/delivery-login" element={<LoginModalRedirect role="PROVIDER" />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/sign-up" element={<SignUpPage />} />
    <Route path="/seller-sign-up" element={<SignUpPage registrationType="SELLER" />} />
    <Route path="/delivery-sign-up" element={<SignUpPage registrationType="PROVIDER" />} />
    <Route path="/create-shop" element={<CreateShopPage />} />
    <Route path="/sell" element={<SignUpPage registrationType="SELLER" />} />
    <Route element={<SellerRegistrationGuard />}>
      <Route path="/seller-registration" element={<SellerRegistrationPage />} />
      <Route path="/seller-registration/status" element={<SellerApplicationStatusPage />} />
    </Route>
  </>
);

export default AuthRoutes;
