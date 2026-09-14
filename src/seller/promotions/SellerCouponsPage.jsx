import React from 'react'
import SellerLayout from '../SellerLayout.jsx'
import AllCoupouns from '../../components/seller/AllCoupouns.jsx'

const SellerCouponsPage = () => (
  <SellerLayout sidebarActive={9}>
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Discount Codes</h1>
        <p className="text-sm text-gray-600">Create and manage discount codes to reward customers and increase conversion rates.</p>
      </div>
      <AllCoupouns />
    </div>
  </SellerLayout>
)

export default SellerCouponsPage