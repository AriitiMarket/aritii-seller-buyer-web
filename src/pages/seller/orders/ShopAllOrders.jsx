import React from 'react'
import SellerLayout from '../../components/seller/SellerLayout'
import AllOrdersOfASingleShop from '../../components/seller/AllOrdersOfASingleShop'

const ShopAllOrders = () => {
  return (
    <SellerLayout active={2}>
      <div className="w-full justify-center flex">
        <AllOrdersOfASingleShop />
      </div>
    </SellerLayout>
  )
}

export default ShopAllOrders