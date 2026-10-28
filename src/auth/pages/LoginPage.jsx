import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser, verify2FALogin } from '@/store/slices/userThunks';
import { authService } from '@/services';
import { tokenStore } from '@/services/tokenStore';
import UnifiedLoginModal from '@/auth/components/UnifiedLoginModal';

/**
 * LoginPage
 *
 * Dedicated login page rendering the clean, vertical modal-style card in the center of the viewport
 * (not full width, max-w-md, clear and focused).
 */
const LoginPage = ({ role = 'BUYER' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.user);
  const [error, setError] = useState(null);

  const from = location.state?.from;

  useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;
    const redirect = async () => {
      if (from && from !== location.pathname) {
        navigate(from, { replace: true });
        return;
      }
      const destination = await authService.loginDestination(tokenStore.getLoginRole() || role);
      if (active) navigate(destination, { replace: true });
    };
    redirect();
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
      const destination = from || (await authService.loginDestination(tokenStore.getLoginRole() || role));
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
      const destination = from || (await authService.loginDestination(tokenStore.getLoginRole() || role));
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
    navigate('/forgot-password');
  };

  const handleContactUs = (targetRole) => {
    if (targetRole === 'SELLER') return navigate('/seller-registration');
    if (targetRole === 'PROVIDER') return navigate('/delivery-sign-up');
    return navigate('/sign-up');
  };

  const handleClose = () => {
    navigate('/');
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
