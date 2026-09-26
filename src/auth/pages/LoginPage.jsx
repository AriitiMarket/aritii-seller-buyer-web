import React from 'react'
import Login from '@/auth/components/Login'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Store from '@/store'
import { loadSeller } from '@/store/slices/userThunks'

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      // For SELLER role, ensure capability is resolved before redirect
      const redirect = async () => {
        if (user?.role === 'SELLER') {
          await Store.dispatch(loadSeller());
        }
        const isSeller = Store.getState()?.seller?.isSeller;
        const from = location.state?.from;
        navigate(from && from !== '/login' ? from : (isSeller ? "/business" : "/my-dashboard"), { replace: true });
      };
      redirect();
    }
  }, [isAuthenticated, user, navigate, location]);

  return (
    <div>
      <Login />
    </div>
  )
}

export default LoginPage
