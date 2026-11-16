import React from 'react';
import Loader from '@/components/common/Loading';
import {
  RevenueTrendChart,
  CategoryChart,
  OrderStatusChart,
  MonthlyOrdersChart,
} from '@/features/seller/shared/charts';
import { useStoreMetrics } from './hooks/useStoreMetrics';
import {
  StoreMetricsKPIGrid,
  StoreMetricsLowStockAlerts,
  StoreMetricsInventoryAndBestsellers,
} from './components';

/**
 * BusinessStoreMetricsPage — Container orchestrating store analytics and charts.
 * Pure calculations are encapsulated in useStoreMetrics; presentation is separated into
 * focused, decoupled sub-components.
 */
const BusinessStoreMetricsPage = () => {
  const {
    isLoading,
    shopProducts,
    timeFilter,
    setTimeFilter,
    windowOrders,
    revenue,
    lowStock,
    outOfStock,
    bestSellers,
    totalStockUnits,
    completedOrders,
    uniqueCustomers,
  } = useStoreMetrics();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Store Analytics</h1>
        <p className="text-gray-600">Comprehensive insights into your store performance.</p>
      </div>

      {/* 1. Key Metrics Grid */}
      <StoreMetricsKPIGrid
        revenue={revenue}
        windowOrdersCount={windowOrders.length}
        completedOrdersCount={completedOrders}
        productsCount={shopProducts.length}
        totalStockUnits={totalStockUnits}
        uniqueCustomers={uniqueCustomers}
      />

      {/* 2. Revenue Trend Chart */}
      <RevenueTrendChart
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
        ShopOrders={windowOrders}
      />

      {/* 3. Two Column Category & Status Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <CategoryChart ShopOrders={windowOrders} products={shopProducts} />
        <OrderStatusChart ShopOrders={windowOrders} />
      </div>

      {/* 4. Monthly Orders Comparison */}
      <MonthlyOrdersChart ShopOrders={windowOrders} />

      {/* 5. Low Stock Alerts */}
      <StoreMetricsLowStockAlerts lowStock={lowStock} />

      {/* 6. Best Sellers & Inventory Snapshot */}
      <StoreMetricsInventoryAndBestsellers
        bestSellers={bestSellers}
        totalStockUnits={totalStockUnits}
        lowStockCount={lowStock.length}
        outOfStockCount={outOfStock.length}
      />
    </>
  );
};

export default BusinessStoreMetricsPage;
