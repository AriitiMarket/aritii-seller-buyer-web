import React from 'react'
import SellerLayout from '../../components/seller/SellerLayout'
import CreateEvent from '../../components/seller/CreateEvent'

const ShopCreateEvents = () => {
  return (
    <SellerLayout active={6}>
      <div className="w-full justify-center flex">
        <CreateEvent />
      </div>
    </SellerLayout>
  )
}

export default ShopCreateEvents