import React from 'react'
import { Navigate } from 'react-router-dom'

// The separate seller login page is removed — Aritii uses ONE login for both
// buyers and sellers (single account). Visiting /shop-login now redirects to
// the unified /login page.
const ShopLoginPage = () => {
  return <Navigate to="/login" replace />;
}

export default ShopLoginPage