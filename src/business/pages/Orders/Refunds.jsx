import React from 'react'
import AllRefundOrders from '@/business/components/AllRefundOrders'

const BusinessRefundsPage = () => (
  <>
    <div className="bg-white rounded-md shadow p-3">
      <h1 className="text-xl font-Poppins font-semibold mb-3">Refunds</h1>
      <AllRefundOrders />
    </div>
  </>
)

export default BusinessRefundsPage