import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser } from '@/store/slices/userThunks';
import { authService } from '@/services';
import { tokenStore } from '@/services/tokenStore';
import CustomerPortalLoginModal from '@/auth/components/CustomerPortalLoginModal';

/**
 * LoginPage
 *
 * Replaces the legacy full-page Login with the new Customer Portal login modal.
 * The modal is shared by BUYER, SELLER and DELIVERY PROVIDER accounts.
 *
 * The modal stays presentational - this page owns the form state and drives
 * authentication through the auth endpoint (PKCE /auth/authorize -> /auth/token).
 * After a successful login the session lands on the role-specific workspace.
 */
const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.user);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // After a successful login, place the session in the role's workspace.
  useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;
    const redirect = async () => {
      const destination = await authService.loginDestination(tokenStore.getLoginRole());
      if (active) navigate(destination, { replace: true });
    };
    redirect();
    return () => {
      active = false;
    };
  }, [isAuthenticated, navigate]);

  const handleLogin = async ({ email, password }) => {
    setError(null);
    setSubmitting(true);
    try {
      // Drives the auth endpoint (PKCE /auth/authorize -> /auth/token).
      await dispatch(loginUser(email.trim(), password));
      setOpen(false);
    } catch (err) {
      const data = err?.response?.data;
      const status = err?.response?.status;
      setError(
        data?.message ||
          err?.message ||
          'Login failed. Please check your email/phone and password.'
      );
      toast.error(
        data?.message ||
          err?.message ||
          'Login failed. Please check your email/phone and password.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgot = () => {
    navigate('/forgot-password');
  };

  const handleContactUs = () => {
    // Route brand-new visitors into the right registration flow.
    const role = tokenStore.getLoginRole();
    if (role === 'SELLER') return navigate('/seller-registration');
    if (role === 'PROVIDER') return navigate('/delivery-sign-up');
    return navigate('/sign-up');
  };

  return (
    <CustomerPortalLoginModal
      open={open}
      onClose={() => setOpen(false)}
      onLogin={handleLogin}
      onForgot={handleForgot}
      onContactUs={handleContactUs}
      error={error}
    />
  );
};

export default LoginPage;
