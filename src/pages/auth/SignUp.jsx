import React from 'react'
import SignUp from '../../components/auth/SignUp.jsx'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const SignUpPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/my-dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>
      <SignUp />
    </div>
  )
}

export default SignUpPage
