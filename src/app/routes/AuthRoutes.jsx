import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import { SellerRegistrationGuard } from '@/seller-registration';

const UnifiedLoginPage = lazy(() => import('@/auth/pages/UnifiedLoginPage'));
const SignUpPage = lazy(() => import('@/auth/pages/SignUpPage'));
const CreateShopPage = lazy(() => import('@/auth/pages/CreateShopPage'));
const SellerRegistrationPage = lazy(() => import('@/seller-registration/pages/SellerRegistrationPage'));
const SellerApplicationStatusPage = lazy(() => import('@/seller-registration/pages/SellerApplicationStatusPage'));

export const AuthRoutes = () => (
  <>
    <Route path="/login" element={<UnifiedLoginPage role="BUYER" />} />
    <Route path="/seller-login" element={<UnifiedLoginPage role="SELLER" />} />
    <Route path="/delivery-login" element={<UnifiedLoginPage role="PROVIDER" />} />
    <Route path="/forgot-password" element={<div>Forgot password page</div>} />
    <Route path="/contact" element={<div>Contact page</div>} />
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
