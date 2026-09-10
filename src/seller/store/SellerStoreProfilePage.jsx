import React from 'react'
import SellerLayout from '../SellerLayout.jsx'
import ShopSettings from '../../components/seller/ShopSettings.jsx'

const SellerStoreProfilePage = () => (
  <SellerLayout sidebarActive={11}>
    <div className="bg-white rounded-md shadow p-3">
      <h1 className="text-xl font-Poppins font-semibold mb-1">Store Profile</h1>
      <p className="text-sm text-brand-muted mb-3">
        Edit your public shop information — name, logo, description, address and contact. This is what buyers see on your public shop page.
      </p>
      <ShopSettings />
    </div>
  </SellerLayout>
)

export default SellerStoreProfilePage