import React from 'react'
import SellerLayout from '../SellerLayout.jsx'
import AllRefundOrders from '../../components/seller/AllRefundOrders.jsx'

const SellerRefundsPage = () => (
  <SellerLayout sidebarActive={10}>
    <div className="bg-white rounded-md shadow p-3">
      <h1 className="text-xl font-Poppins font-semibold mb-3">Refunds</h1>
      <AllRefundOrders />
    </div>
  </SellerLayout>
)

export default SellerRefundsPage