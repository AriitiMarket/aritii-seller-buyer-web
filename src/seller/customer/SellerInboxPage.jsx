import React from 'react'
import SellerLayout from '../SellerLayout.jsx'
import DashboardMessages from '../../components/seller/DashboardMessages.jsx'

const SellerInboxPage = () => (
  <SellerLayout sidebarActive={8}>
    <div className="bg-white rounded-md shadow p-3">
      <h1 className="text-xl font-Poppins font-semibold mb-3">Shop Inbox</h1>
      <DashboardMessages />
    </div>
  </SellerLayout>
)

export default SellerInboxPage