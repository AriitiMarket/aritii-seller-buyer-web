import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Header from '../../../components/layout/Header'
import Footer from '../../../components/layout/Footer'
import CheckoutSteps from '../../../components/checkout/CheckOutSteps'
import Checkout from '../../../components/checkout/Checkout'
import { validateCart } from '../../../store/redux/actions/cart'

const CheckoutPage = () => {
  const dispatch = useDispatch()
  const { cart, isLoading } = useSelector((state) => state.cart)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Validate cart on page load
  useEffect(() => {
    if (cart && cart.length > 0) {
      dispatch(validateCart())
    }
  }, [dispatch, cart.length])

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 mx-auto mb-4 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600">Validating cart items...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      {/* Checkout Steps */}
      <div className="w-full py-6 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CheckoutSteps active={1} />
        </div>
      </div>

      {/* Main Checkout Content */}
      <div className="flex-1">
        <Checkout />
      </div>

      <Footer />
    </div>
  )
}

export default CheckoutPage
