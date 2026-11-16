import React from 'react';
import { FiDollarSign, FiShoppingCart, FiPackage, FiUsers } from 'react-icons/fi';
import MetricCard from './MetricCard';

export const StoreMetricsKPIGrid = ({
  revenue = 0,
  windowOrdersCount = 0,
  completedOrdersCount = 0,
  productsCount = 0,
  totalStockUnits = 0,
  uniqueCustomers = 0,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <MetricCard
        label="Total Revenue"
        value={`ETB ${revenue.toLocaleString()}`}
        sub="From delivered orders"
        tone="green"
        icon={FiDollarSign}
      />
      <MetricCard
        label="Total Orders"
        value={windowOrdersCount}
        sub="All orders for your shop in the selected period"
        tone="blue"
        icon={FiShoppingCart}
        trend={completedOrdersCount > 0 ? `${completedOrdersCount} delivered` : undefined}
      />
      <MetricCard
        label="Active Products"
        value={productsCount}
        sub="Products in your shop"
        tone="blue"
        icon={FiPackage}
        trend={totalStockUnits > 0 ? `${totalStockUnits} units` : 'No stock'}
      />
      <MetricCard
        label="Customers"
        value={uniqueCustomers}
        sub="Unique customers"
        tone="purple"
        icon={FiUsers}
      />
    </div>
  );
};

export default StoreMetricsKPIGrid;
