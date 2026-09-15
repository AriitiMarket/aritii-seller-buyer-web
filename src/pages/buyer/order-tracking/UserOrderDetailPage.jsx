import React, { useEffect } from 'react'
import Header from '../../../components/layout/Header'
import Footer from '../../../components/layout/Footer'
import UserOrderDetailComponent from '../../../components/profile/UserOrderDetailComponent'

const UserOrderDetailPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex-1">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <UserOrderDetailComponent />
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default UserOrderDetailPage