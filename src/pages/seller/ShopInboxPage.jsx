import React from 'react'
import SellerLayout from '../../components/seller/SellerLayout'
import DashboardMessages from '../../components/seller/DashboardMessages'

const ShopInboxPage = () => {
  return (
    <SellerLayout active={8}>
      <div className="w-full justify-center flex">
        <DashboardMessages />
      </div>
    </SellerLayout>
  )
}

export default ShopInboxPage