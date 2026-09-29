import React, { useEffect } from 'react'
import BuyerHeader from '@/buyer/components/BuyerHeader'
import Footer from '@/shared/components/Footer'
import UserOrderDetailComponent from '@/buyer/components/UserOrderDetailComponent'

const BuyerOrderDetailPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="w-full min-h-screen bg-[#F7F8FA] flex flex-col">
      <BuyerHeader onMenuClick={() => {}} />
      
      <div className="flex-1">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <UserOrderDetailComponent />
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default BuyerOrderDetailPage