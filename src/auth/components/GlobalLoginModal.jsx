import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser, verify2FALogin } from '@/store/slices/userThunks';
import { authService } from '@/services';
import { tokenStore } from '@/services/tokenStore';
import { useLayout } from '@/app/providers/LayoutContext';
import UnifiedLoginModal from '@/auth/components/UnifiedLoginModal';

/**
 * The legacy sign-in URLs and the role each one hints at.
 *
 * The role is only a HINT about where the visitor was when they asked to sign
 * in — it picks the badge and the sign-up link. The session's real role is
 * resolved by the Identity Service from the account's role memberships.
 */
export const LOGIN_PATH_ROLES = {
  '/login': 'BUYER',
  '/seller-login': 'SELLER',
  '/delivery-login': 'PROVIDER',
};

/**
 * GlobalLoginModal — the ONE login UI of the application.
 *
 * It is mounted once, globally, by AppRoutes. Every sign-in affordance in the
 * app (headers, product cards, guards, deep links) ends up here, so there is
 * exactly one place that collects credentials and one place that decides where
 * the session lands.
 *
 * The role is NOT chosen by the visitor: the Identity Service resolves it from
 * the account's own role memberships and returns it as `login_role`. The
 * frontend only uses that answer to pick the workspace.
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
      // The backend decided the role; the destination follows from it. When a
      // route guard interrupted the visitor, return to the page they wanted.
      const destination =
        loginModalReturnTo ||
        (await authService.loginDestination(tokenStore.getLoginRole()));
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
      const destination =
        loginModalReturnTo ||
        (await authService.loginDestination(tokenStore.getLoginRole()));
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
    closeLoginModal();
    navigate('/forgot-password');
  };

  const handleContactUs = (role) => {
    closeLoginModal();
    if (role === 'SELLER') return navigate('/seller-registration');
    if (role === 'PROVIDER') return navigate('/delivery-sign-up');
    return navigate('/sign-up');
  };

  const handleClose = () => {
    closeLoginModal();
    // Dismissing the modal on a legacy sign-in URL returns to the previous
    // page instead of stranding the visitor on the sign-in route.
    if (LOGIN_PATH_ROLES[location.pathname]) {
      if (window.history.length > 1) navigate(-1);
      else navigate('/', { replace: true });
    }
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

/**
 * LoginModalRedirect — the `/login` route.
 *
 * There is no login PAGE any more: the single global modal is the only sign-in
 * UI. This route exists so the legacy URLs (and the route guards that point at
 * them) reach that modal. It opens the modal and hands the URL back to the
 * application, remembering where the visitor was headed.
 */
export const LoginModalRedirect = ({ role = 'BUYER' }) => {
  const { openLoginModal } = useLayout();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const from = location.state?.from || null;
    openLoginModal(role, from);
    navigate('/', { replace: true });
  }, []);

  return null;
};

export default GlobalLoginModal;
