import React from 'react';
import { MdShoppingBag } from 'react-icons/md';
import { FiPackage, FiDollarSign, FiAlertCircle } from 'react-icons/fi';
import { SellerStatCard } from '@/features/seller/components';

export const DashboardKPICards = ({
  totalProducts = 0,
  totalOrders = 0,
  totalRevenue = '0',
  pendingOrders = 0,
  cancelledOrders = 0,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <SellerStatCard
        title="Total Products"
        value={totalProducts}
        icon={MdShoppingBag}
        color="blue"
        link="/business/products"
      />
      <SellerStatCard
        title="Total Orders"
        value={totalOrders}
        icon={FiPackage}
        color="green"
        link="/business/orders"
      />
      <SellerStatCard
        title="Revenue"
        value={`ETB ${totalRevenue}`}
        change={totalOrders > 0 ? '+' : undefined}
        isPositive
        icon={FiDollarSign}
        color="green"
        link="/business/revenue"
      />
      <SellerStatCard
        title="Pending Orders"
        value={pendingOrders}
        change={cancelledOrders > 0 ? cancelledOrders : undefined}
        isPositive={cancelledOrders === 0}
        icon={FiAlertCircle}
        color={pendingOrders > 0 ? 'yellow' : 'green'}
        link="/business/orders?tab=new"
      />
    </div>
  );
};

export default DashboardKPICards;
