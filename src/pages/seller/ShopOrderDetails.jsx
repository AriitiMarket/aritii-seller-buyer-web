import React from 'react'
import SellerLayout from '../../components/seller/SellerLayout'
import OrderDetails from '../../components/seller/OrderDetails'

const ShopOrderDetails = () => {
  return (
    <SellerLayout active={2}>
      <div className="w-11/12 mx-auto py-6">
        <OrderDetails />
      </div>
    </SellerLayout>
  )
}

export default ShopOrderDetails