import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'

// The standalone seller-register form has been removed. Sellers use their ONE
// Aritii account; creating a shop is part of the seller onboarding center
// (/sell), which already routes by auth state: visitors -> sign in / register,
// buyers -> application, approved sellers -> Seller Center. Visiting /create-shop
// now forwards there.
const CreateShopPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.user)

  useEffect(() => {
    navigate(isAuthenticated ? "/sell" : "/sign-up", { replace: true })
  }, [isAuthenticated])

  return null
}

export default CreateShopPage