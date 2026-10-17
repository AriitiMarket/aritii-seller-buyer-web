import React, { useEffect } from 'react'
import BuyerHeader from '@/buyer/components/BuyerHeader'
import Footer from '@/shared/components/Footer'
import Payment from '@/buyer/components/Payment'
import CheckoutSteps from '@/buyer/components/CheckoutSteps'

const PaymentPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className='w-full min-h-screen bg-market-surface-dim flex flex-col'>
      <BuyerHeader onMenuClick={() => {}} />
      
      {/* Checkout Steps */}
      <div className="w-full py-6 bg-white border-b border-market-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CheckoutSteps active={2} />
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
