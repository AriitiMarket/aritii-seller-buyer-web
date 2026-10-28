import React, { useEffect } from 'react';
import SignUp from '@/auth/components/SignUp';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '@/services';
import { tokenStore } from '@/services/tokenStore';
import Loading from '@/components/common/Loading';
import { getSafeRedirect } from '@/auth/utils/redirect';

const NEXT_STEP = {
  BUYER: '/my-dashboard',
  SELLER: '/seller-registration',
  PROVIDER: '/provider-application',
};

const SignUpPage = ({ registrationType = 'BUYER' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.user || {});
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
      const destination =
        registrationType === 'BUYER'
          ? await authService.loginDestination(tokenStore.getLoginRole())
          : NEXT_STEP[registrationType] || NEXT_STEP.BUYER;
      if (active) navigate(destination, { replace: true });
    };
    void redirect();
    return () => {
      active = false;
    };
  }, [isAuthenticated, from, location.pathname, navigate, registrationType]);

  if (isAuthenticated) return <Loading />;
  return <SignUp registrationType={registrationType} from={from} />;
};

export default SignUpPage;
