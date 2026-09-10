import React from 'react'
import SellerLayout from '../SellerLayout.jsx'
import AllEvents from '../../components/seller/AllEvents.jsx'

const SellerEventsPage = () => (
  <SellerLayout sidebarActive={5}>
    <div className="bg-white rounded-md shadow p-3">
      <h1 className="text-xl font-Poppins font-semibold mb-3">All Events / Promotions</h1>
      <AllEvents />
    </div>
  </SellerLayout>
)

export default SellerEventsPage