import React, { useEffect } from 'react'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import CheckoutSteps from '../../components/checkout/CheckOutSteps'
import Checkout from '../../components/checkout/Checkout'

const CheckoutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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