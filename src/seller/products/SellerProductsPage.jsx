import React from 'react'
import SellerLayout from '../SellerLayout.jsx'
import AllProductsOfASingleShop from '../../components/seller/AllProductsOfASingleShop.jsx'

const SellerProductsPage = () => (
  <SellerLayout sidebarActive={3}>
    <div className="bg-white rounded-md shadow p-3">
      <h1 className="text-xl font-Poppins font-semibold mb-2">My Products</h1>
      <p className="text-sm text-brand-muted mb-4">Products belonging to your shop only. Click an eye icon to view details or the pencil to edit.</p>
      <AllProductsOfASingleShop />
    </div>
  </SellerLayout>
)

export default SellerProductsPage