import React from 'react'
import SellerLayout from '../SellerLayout.jsx'
import CreateProduct from '../../components/seller/CreateProduct.jsx'

/**
 * Modular create-product page (seller). Composes the existing backend-backed
 * product creation form (image upload/URL, pricing, stock, category) inside
 * the shared seller layout.
 */
const SellerCreateProductPage = () => (
  <SellerLayout sidebarActive={4}>
    <div className="bg-white rounded-md shadow p-3">
      <h1 className="text-xl font-Poppins font-semibold mb-1">Add Product</h1>
      <p className="text-sm text-brand-muted mb-3">Create a new product for your shop. It will appear in the marketplace once published.</p>
      <CreateProduct />
    </div>
  </SellerLayout>
)

export default SellerCreateProductPage