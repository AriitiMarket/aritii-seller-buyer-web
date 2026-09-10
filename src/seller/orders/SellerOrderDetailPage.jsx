import React from 'react'
import SellerLayout from '../SellerLayout.jsx'
import OrderDetails from '../../components/seller/OrderDetails.jsx'

const SellerOrderDetailPage = () => (
  <SellerLayout sidebarActive={2}>
    <OrderDetails />
  </SellerLayout>
)

export default SellerOrderDetailPage