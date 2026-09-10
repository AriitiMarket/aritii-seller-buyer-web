import React from 'react'
import SellerLayout from '../SellerLayout.jsx'
import ShopSettings from '../../components/seller/ShopSettings.jsx'

const SellerSettingsPage = () => (
  <SellerLayout sidebarActive={11}>
    <div className="bg-white rounded-md shadow p-3">
      <h1 className="text-xl font-Poppins font-semibold mb-1">Seller Settings</h1>
      <p className="text-sm text-brand-muted mb-3">Account and public shop information.</p>
      <ShopSettings />
    </div>
  </SellerLayout>
)

export default SellerSettingsPage