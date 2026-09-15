import React from 'react'
import SellerLayout from '../../components/seller/SellerLayout'
import AllEvents from '../../components/seller/AllEvents'

const ShopAllEvents = () => {
  return (
    <SellerLayout active={5}>
      <div className="w-full justify-center flex">
        <AllEvents />
      </div>
    </SellerLayout>
  )
}

export default ShopAllEvents