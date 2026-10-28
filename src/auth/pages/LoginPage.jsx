import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser, verify2FALogin } from '@/store/slices/userThunks';
import { authService } from '@/services';
import { tokenStore } from '@/services/tokenStore';
import UnifiedLoginModal from '@/auth/components/UnifiedLoginModal';
import { getSafeRedirect } from '@/auth/utils/redirect';

/**
 * LoginPage
 *
 * Dedicated login page rendering the standard centered authentication modal
 * on direct navigation to /login, /seller-login, /delivery-login.
 */
const LoginPage = ({ role = 'BUYER' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.user || {});
  const [error, setError] = useState(null);

  const from = location.state?.from;

  useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;
    const redirect = async () => {
      const safeFrom = getSafeRedirect(from, null);
      if (safeFrom && safeFrom !== location.pathname) {
        navigate(safeFrom, { replace: true });
        return;
      }
      const destination = await authService.loginDestination(tokenStore.getLoginRole() || role);
      if (active) navigate(destination, { replace: true });
    };
    void redirect();
    return () => {
      active = false;
    };
  }, [isAuthenticated, navigate, from, location.pathname, role]);

  const handleLogin = async ({ email, password }) => {
    setError(null);
    try {
      const res = await dispatch(loginUser(email.trim(), password));
      if (res?.requires2fa) {
        return res;
      }
      toast.success('Signed in successfully!');
      const fallback = await authService.loginDestination(tokenStore.getLoginRole() || role);
      const destination = getSafeRedirect(from, fallback);
      navigate(destination, { replace: true });
      return res;
    } catch (err) {
      const data = err?.response?.data;
      const msg = data?.message || err?.message || 'Login failed. Please check your credentials.';
      setError(msg);
      toast.error(msg);
      throw err;
    }
  };

  const handleVerify2FA = async (verificationData) => {
    setError(null);
    try {
      const res = await dispatch(verify2FALogin(verificationData));
      toast.success('Signed in successfully!');
      const fallback = await authService.loginDestination(tokenStore.getLoginRole() || role);
      const destination = getSafeRedirect(from, fallback);
      navigate(destination, { replace: true });
      return res;
    } catch (err) {
      const data = err?.response?.data;
      const msg = data?.message || err?.message || 'Two-factor verification failed.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const handleForgot = () => {
    navigate('/forgot-password', { state: { from: getSafeRedirect(from, null) } });
  };

  const handleContactUs = (targetRole) => {
    const route =
      targetRole === 'SELLER'
        ? '/seller-registration'
        : targetRole === 'PROVIDER'
          ? '/delivery-sign-up'
          : '/sign-up';
    navigate(route, { state: { from: getSafeRedirect(from, null), role: targetRole } });
  };

  const handleClose = () => {
    const safeDestination = getSafeRedirect(from, null);
    if (safeDestination && safeDestination !== location.pathname) {
      navigate(safeDestination, { replace: true });
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <UnifiedLoginModal
      isPage={true}
      open={true}
      onClose={handleClose}
      onLogin={handleLogin}
      onVerify2FA={handleVerify2FA}
      onForgot={handleForgot}
      onContactUs={handleContactUs}
      error={error}
      role={role}
    />
  );
};

export default LoginPage;
