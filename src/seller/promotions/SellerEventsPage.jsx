import React from 'react'
import SellerLayout from '../SellerLayout.jsx'
import AllEvents from '../../components/seller/AllEvents.jsx'

const SellerEventsPage = () => (
  <SellerLayout sidebarActive={5}>
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">All Events / Promotions</h1>
        <p className="text-sm text-gray-600">Create and manage promotions and events for your shop to boost sales and engage customers.</p>
      </div>
      <AllEvents />
    </div>
  </SellerLayout>
)

export default SellerEventsPage