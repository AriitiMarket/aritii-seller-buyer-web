import React from 'react'
import Login from '@/auth/components/Login'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authService } from '@/services'
import { tokenStore } from '@/services/tokenStore'

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.user);
  const from = location.state?.from;

  useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;
    const redirect = async () => {
      // A buyer session always lands on the consistent public marketplace
      // layout (same experience non-logged-in shoppers see), never the
      // marketing hero and never the account shell.
      // Identity resolves the role for this shared Login. A seller/provider
      // awaiting approval lands on the correct application status page.
      const destination = await authService.loginDestination(tokenStore.getLoginRole());
      if (active) navigate(destination, { replace: true });
    };
    redirect();
    return () => { active = false; };
  }, [isAuthenticated, from, navigate]);

  return (
    <div>
      <Login />
    </div>
  )
}

export default LoginPage
