import React from 'react'
import SellerLayout from '../SellerLayout.jsx'
import AllOrdersOfASingleShop from '../../components/seller/AllOrdersOfASingleShop.jsx'

const SellerOrdersPage = () => (
  <SellerLayout sidebarActive={2}>
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">All Orders</h1>
        <p className="text-sm text-gray-600">
          Orders placed for products in your shop. Filter and manage order status from the detail view.
        </p>
      </div>
      <AllOrdersOfASingleShop />
    </div>
  </SellerLayout>
)

export default SellerOrdersPage