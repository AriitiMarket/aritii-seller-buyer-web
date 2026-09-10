import React from 'react'
import SellerLayout from '../SellerLayout.jsx'
import AllOrdersOfASingleShop from '../../components/seller/AllOrdersOfASingleShop.jsx'

const SellerOrderHistoryPage = () => (
  <SellerLayout sidebarActive={14}>
    <div className="bg-white rounded-md shadow p-3">
      <h1 className="text-xl font-Poppins font-semibold mb-1">Order History</h1>
      <p className="text-sm text-brand-muted mb-3">Complete history of orders received by your shop, newest first.</p>
      <AllOrdersOfASingleShop />
    </div>
  </SellerLayout>
)

export default SellerOrderHistoryPage