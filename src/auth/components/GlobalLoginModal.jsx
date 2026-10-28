import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser, verify2FALogin } from '@/store/slices/userThunks';
import { authService } from '@/services';
import { tokenStore } from '@/services/tokenStore';
import { useLayout } from '@/app/providers/LayoutContext';
import UnifiedLoginModal from '@/auth/components/UnifiedLoginModal';
import { getSafeRedirect } from '@/auth/utils/redirect';

/**
 * The legacy sign-in URLs and the role each one hints at.
 */
export const LOGIN_PATH_ROLES = {
  '/login': 'BUYER',
  '/seller-login': 'SELLER',
  '/delivery-login': 'PROVIDER',
};

/**
 * GlobalLoginModal — single global login modal for Ariiti Market.
 */
const GlobalLoginModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loginModalOpen, loginModalRole, loginModalReturnTo, closeLoginModal } = useLayout();
  const [error, setError] = useState(null);

  const handleLogin = async ({ email, password }) => {
    setError(null);
    try {
      const res = await dispatch(loginUser(email.trim(), password));
      if (res?.requires2fa) {
        return res;
      }
      closeLoginModal();
      toast.success('Signed in successfully!');

      const fallbackDestination = await authService.loginDestination(tokenStore.getLoginRole());
      const destination = getSafeRedirect(
        loginModalReturnTo || location.state?.from,
        fallbackDestination
      );
      navigate(destination, { replace: true });
      return res;
    } catch (err) {
      const data = err?.response?.data;
      const msg =
        data?.message ||
        err?.message ||
        'Login failed. Please check your credentials.';
      setError(msg);
      toast.error(msg);
      throw err;
    }
  };

  const handleVerify2FA = async (verificationData) => {
    setError(null);
    try {
      const res = await dispatch(verify2FALogin(verificationData));
      closeLoginModal();
      toast.success('Signed in successfully!');

      const fallbackDestination = await authService.loginDestination(tokenStore.getLoginRole());
      const destination = getSafeRedirect(
        loginModalReturnTo || location.state?.from,
        fallbackDestination
      );
      navigate(destination, { replace: true });
      return res;
    } catch (err) {
      const data = err?.response?.data;
      const msg =
        data?.message ||
        err?.message ||
        'Two-factor verification failed.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const handleForgot = () => {
    // Preserve return destination when moving to password recovery
    const returnDestination = getSafeRedirect(loginModalReturnTo || location.pathname, '/');
    closeLoginModal();
    navigate('/forgot-password', { state: { from: returnDestination } });
  };

  const handleContactUs = (role) => {
    // Preserve return destination when moving to registration
    const returnDestination = getSafeRedirect(loginModalReturnTo || location.pathname, '/');
    closeLoginModal();
    if (role === 'SELLER') {
      return navigate('/seller-registration', { state: { from: returnDestination, role } });
    }
    if (role === 'PROVIDER') {
      return navigate('/delivery-sign-up', { state: { from: returnDestination, role } });
    }
    return navigate('/sign-up', { state: { from: returnDestination, role } });
  };

  const handleClose = () => {
    closeLoginModal();
    // When the user was specifically on a sign-in route, navigate back to previous page
    if (LOGIN_PATH_ROLES[location.pathname]) {
      const destination = getSafeRedirect(loginModalReturnTo || location.state?.from, null);
      if (destination && destination !== location.pathname) {
        navigate(destination, { replace: true });
      } else if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate('/', { replace: true });
      }
    }
    // Otherwise the user stays on their current page (e.g. product detail, cart, etc.)
  };

  if (!loginModalOpen) return null;

  return (
    <UnifiedLoginModal
      open={loginModalOpen}
      onClose={handleClose}
      onLogin={handleLogin}
      onVerify2FA={handleVerify2FA}
      onForgot={handleForgot}
      onContactUs={handleContactUs}
      error={error}
      role={loginModalRole || 'BUYER'}
    />
  );
};

export default GlobalLoginModal;
