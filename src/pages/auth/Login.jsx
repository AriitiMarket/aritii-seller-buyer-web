import React from 'react'
import Login from '../../components/auth/Login'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'


const LoginPage = () => {

  const navigate= useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);

  useEffect(() => {
    if (isAuthenticated || isSeller) {
      // Already signed in — route by role (seller -> dashboard, buyer -> home).
      navigate(isSeller ? "/dashboard" : "/");
    }
  }, [isSeller])


  return (
    <div>
        <Login />
    </div>
  )
}

export default  LoginPage