import React from 'react'
import SignUp from '@/auth/components/SignUp'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Store from '@/store'
import { loadSeller } from '@/store/slices/userThunks'

const SignUpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      const redirect = async () => {
        if (user?.role === 'SELLER') {
          await Store.dispatch(loadSeller());
        }
        const isSeller = Store.getState()?.seller?.isSeller;
        // Preserve the intended destination (e.g. /seller-registration) when the
        // visitor was bounced here by a guard.
        const from = location.state?.from;
        navigate(from && from !== '/sign-up' ? from : (isSeller ? "/business" : "/my-dashboard"), { replace: true });
      };
      redirect();
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div>
      <SignUp />
    </div>
  )
}

export default SignUpPage
