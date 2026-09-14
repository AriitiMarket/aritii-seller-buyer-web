import React from 'react'
import SellerLayout from '../SellerLayout.jsx'
import ShopSettings from '../../components/seller/ShopSettings.jsx'

const SellerStoreProfilePage = () => (
  <SellerLayout sidebarActive={11}>
    <div className="max-w-4xl">
      {/* Header Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Store Profile</h1>
            <p className="text-gray-600 leading-relaxed">
              Edit your public shop information — name, logo, description, address and contact. This is what buyers see on your public shop page.
            </p>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <ShopSettings />
    </div>
  </SellerLayout>
)

export default SellerStoreProfilePage