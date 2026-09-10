import React from 'react'
import SellerLayout from '../SellerLayout.jsx'
import DashboardHero from '../../components/seller/DashboardHero.jsx'

const SellerDashboardPage = () => (
  <SellerLayout sidebarActive={1}>
    <DashboardHero />
  </SellerLayout>
)

export default SellerDashboardPage