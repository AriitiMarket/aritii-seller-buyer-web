import React from 'react'
import SellerLayout from '../../components/seller/SellerLayout'
import CreateProduct from '../../components/seller/CreateProduct'

const ShopCreateProduct = () => {
  return (
    <SellerLayout active={4}>
      <div className="w-full justify-center flex">
        <CreateProduct />
      </div>
    </SellerLayout>
  )
}

export default ShopCreateProduct