import React from 'react'
import SellerLayout from '../../components/seller/SellerLayout'
import AllRefundOrders from '../../components/seller/AllRefundOrders'

const ShopAllRefunds = () => {
  return (
    <SellerLayout active={10}>
      <div className="w-full justify-center flex">
        <AllRefundOrders />
      </div>
    </SellerLayout>
  )
}

export default ShopAllRefunds