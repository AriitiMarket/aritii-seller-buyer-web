import React, { useEffect } from 'react'
import BuyerHeader from '@/buyer/components/BuyerHeader'
import Footer from '@/shared/components/Footer'
import OrderDetailComponent from '@/buyer/components/OrderDetailComponent'

const BuyerOrderDetailPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="w-full min-h-screen bg-market-surface-dim flex flex-col">
      <BuyerHeader onMenuClick={() => {}} />
      
      <div className="flex-1">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <OrderDetailComponent />
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default BuyerOrderDetailPage
