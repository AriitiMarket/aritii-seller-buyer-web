import React from 'react'
import AllOrdersOfASingleShop from '../../../../components/seller/AllOrdersOfASingleShop'

const BusinessOrdersPage = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Business Orders</h1>
      <p className="text-sm text-gray-600">Orders placed for products in your shop. Filter and manage order status from the detail view.</p>
    </div>
    <AllOrdersOfASingleShop />
  </div>
)

export default BusinessOrdersPage
