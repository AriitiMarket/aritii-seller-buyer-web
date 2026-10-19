import React from 'react'
import SignUp from '@/auth/components/SignUp'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authService } from '@/services'
import { tokenStore } from '@/services/tokenStore'
import Loading from '@/components/common/Loading'

const NEXT_STEP = {
  BUYER: '/my-dashboard',
  SELLER: '/seller-registration',
  PROVIDER: '/provider-application',
};



  useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;
    const redirect = async () => {
      // Continue into the entry path the visitor selected, or that a route guard
      // preserved. This keeps Seller and Delivery Provider applications role-specific.
      if (from && from !== location.pathname) {
        navigate(from, { replace: true });
        return;
      }
      const destination = registrationType === 'BUYER'
        ? await authService.loginDestination(tokenStore.getLoginRole())
        : NEXT_STEP[registrationType] || NEXT_STEP.BUYER;
      if (active) navigate(destination, { replace: true });
    };
    redirect();
    return () => { active = false; };
  }, [isAuthenticated, from, location.pathname, navigate, registrationType]);

  if (isAuthenticated) return <Loading />;
  return <SignUp registrationType={registrationType} />;
}

export default SignUpPage
