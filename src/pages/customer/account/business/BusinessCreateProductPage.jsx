import React from 'react'
import CreateProduct from '../../../../components/seller/CreateProduct'

const BusinessCreateProductPage = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Add Product</h1>
      <p className="text-sm text-gray-600">Create a new product for your shop. It will appear in the marketplace once published.</p>
    </div>
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <CreateProduct />
    </div>
  </div>
)

export default BusinessCreateProductPage
