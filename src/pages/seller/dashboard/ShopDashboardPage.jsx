import React from 'react'
import SellerLayout from '../../components/seller/SellerLayout'
import DashboardHero from '../../components/seller/DashboardHero'

const ShopDashboardPage = () => {
  return (
    <SellerLayout active={1}>
      <div className="flex-1 min-w-0 overflow-x-hidden">
        <DashboardHero />
      </div>
    </SellerLayout>
  )
}

export default ShopDashboardPage