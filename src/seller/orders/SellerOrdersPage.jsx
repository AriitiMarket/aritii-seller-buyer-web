import React from 'react'
import SellerLayout from '../SellerLayout.jsx'
import AllOrdersOfASingleShop from '../../components/seller/AllOrdersOfASingleShop.jsx'

const SellerOrdersPage = () => (
  <SellerLayout sidebarActive={2}>
    <div className="bg-white rounded-md shadow p-3">
      <h1 className="text-xl font-Poppins font-semibold mb-1">All Orders</h1>
      <p className="text-sm text-brand-muted mb-3">
        Orders placed for products in your shop. Filter and manage order status from the detail view.
      </p>
      <AllOrdersOfASingleShop />
    </div>
  </SellerLayout>
)

export default SellerOrdersPage