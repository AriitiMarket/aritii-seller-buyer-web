import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser } from '@/store/slices/userThunks';
import { authService } from '@/services';
import { tokenStore } from '@/services/tokenStore';
import UnifiedLoginModal from '@/auth/components/UnifiedLoginModal';

const UnifiedLoginPage = ({ role = 'BUYER' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.user);
  const [open, setOpen] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;
    const redirect = async () => {
      const destination = await authService.loginDestination(role);
      if (active) navigate(destination, { replace: true });
    };
    redirect();
    return () => {
      active = false;
    };
  }, [isAuthenticated, navigate, role]);

  const handleLogin = async ({ email, password }) => {
    setError(null);
    try {
      tokenStore.setLoginRole(role);
      await dispatch(loginUser(email.trim(), password));
      setOpen(false);
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Login failed';
      setError(message);
      toast.error(message);
    }
  };

  const handleForgot = () => {
    navigate('/forgot-password');
  };

  const handleContactUs = () => {
    if (role === 'SELLER') return navigate('/seller-registration');
    if (role === 'PROVIDER') return navigate('/delivery-sign-up');
    return navigate('/sign-up');
  };

  return (
    <UnifiedLoginModal
      open={open}
      onClose={() => setOpen(false)}
      onLogin={handleLogin}
      onForgot={handleForgot}
      onContactUs={handleContactUs}
      error={error}
      role={role}
    />
  );
};

export default UnifiedLoginPage;
