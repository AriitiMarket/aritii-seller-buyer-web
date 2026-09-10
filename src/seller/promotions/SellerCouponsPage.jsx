import React from 'react'
import SellerLayout from '../SellerLayout.jsx'
import AllCoupouns from '../../components/seller/AllCoupouns.jsx'

const SellerCouponsPage = () => (
  <SellerLayout sidebarActive={9}>
    <div className="bg-white rounded-md shadow p-3">
      <h1 className="text-xl font-Poppins font-semibold mb-3">Discount Codes</h1>
      <AllCoupouns />
    </div>
  </SellerLayout>
)

export default SellerCouponsPage