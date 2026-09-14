import React from 'react'
import SellerLayout from '../SellerLayout.jsx'
import AllProductsOfASingleShop from '../../components/seller/AllProductsOfASingleShop.jsx'

const SellerProductsPage = () => (
  <SellerLayout sidebarActive={3}>
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Products</h1>
        <p className="text-sm text-gray-600">Products belonging to your shop only. Click an eye icon to view details or the pencil to edit.</p>
      </div>
      <AllProductsOfASingleShop />
    </div>
  </SellerLayout>
)

export default SellerProductsPage