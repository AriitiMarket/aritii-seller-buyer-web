import React from 'react'
import SellerLayout from '../../components/seller/SellerLayout'
import AllCoupons from '../../components/seller/AllCoupouns'

const ShopAllCoupons = () => {
  return (
    <SellerLayout active={9}>
      <div className="w-full justify-center flex">
        <AllCoupons />
      </div>
    </SellerLayout>
  )
}

export default ShopAllCoupons