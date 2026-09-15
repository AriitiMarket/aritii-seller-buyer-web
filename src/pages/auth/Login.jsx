import React from 'react'
import Login from '../../components/auth/Login'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/my-dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>
      <Login />
    </div>
  )
}

export default LoginPage
