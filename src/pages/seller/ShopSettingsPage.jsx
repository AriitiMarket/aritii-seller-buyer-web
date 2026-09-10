import React from 'react'
import SellerLayout from '../../components/seller/SellerLayout'
import ShopSettings from '../../components/seller/ShopSettings'

const ShopSettingsPage = () => {
  return (
    <SellerLayout active={11}>
      <div className="flex-1 min-w-0 px-4 py-6">
        <ShopSettings />
      </div>
    </SellerLayout>
  )
}

export default ShopSettingsPage