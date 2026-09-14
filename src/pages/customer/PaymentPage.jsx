import React, { useEffect } from 'react'
import Header from '../../components/layout/Header.jsx'
import Footer from '../../components/layout/Footer.jsx'
import Payment from '../../components/payment/Payment.jsx'
import CheckOutSteps from '../../components/checkout/CheckOutSteps.jsx'

const PaymentPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className='w-full min-h-screen bg-gray-50 flex flex-col'>
      <Header />
      
      {/* Checkout Steps */}
      <div className="w-full py-6 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CheckOutSteps active={2} />
        </div>
      </div>

      {/* Main Payment Content */}
      <div className="flex-1">
        <Payment />
      </div>

      <Footer />
    </div>
  )
}

export default PaymentPage