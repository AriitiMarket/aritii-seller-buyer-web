import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import { SellerRegistrationGuard } from '@/features/auth/seller-registration';

/**
 * Auth routes.
 *
 * There is NO login page: the application has exactly ONE sign-in UI, the
 * global login modal (auth/components/UnifiedLoginModal, mounted once by
 * GlobalLoginModal). The `/login` family of URLs is kept purely so existing
 * links and route guards reach that modal instead of a 404.
 */
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const SignUpPage = lazy(() => import('@/features/auth/pages/SignUpPage'));
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/features/auth/pages/ResetPasswordPage'));
const ContactPage = lazy(() => import('@/features/auth/pages/ContactPage'));
const CreateShopPage = lazy(() => import('@/features/auth/pages/CreateShopPage'));
const SellerRegistrationPage = lazy(() => import('@/features/auth/seller-registration/pages/SellerRegistrationPage'));
const SellerApplicationStatusPage = lazy(() => import('@/features/auth/seller-registration/pages/SellerApplicationStatusPage'));

export const AuthRoutes = () => (
  <>
    {/* Sign-in URLs → vertical centered modal layout (not full width) */}
    <Route path="/login" element={<LoginPage role="BUYER" />} />
    <Route path="/seller-login" element={<LoginPage role="SELLER" />} />
    <Route path="/delivery-login" element={<LoginPage role="PROVIDER" />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />
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
