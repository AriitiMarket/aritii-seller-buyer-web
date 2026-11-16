import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SellerEmptyState, WalletCard } from '@/features/seller/components';
import { SalesOverviewChart } from '@/features/seller/shared/charts';
import ReturnsDashboardCard from '@/features/seller/components/ReturnsDashboardCard';
import SellerMetricsDisplay from '@/features/seller/components/SellerMetricsDisplay';
import { useDashboardMetrics } from '@/features/seller/hooks/useDashboardMetrics';
import {
  DashboardGreeting,
  DashboardKPICards,
  DashboardStockAlerts,
  DashboardRecentOrders,
  DashboardOperations,
} from './dashboard';

/**
 * BusinessDashboardHero — Container orchestrating the seller dashboard view.
 * Logic is encapsulated in useDashboardMetrics hook; presentation is decomposed
 * into focused, modular sub-components.
 */
const DashboardHero = () => {
  const navigate = useNavigate();
  const {
    seller,
    userId,
    activeShop,
    activeShopId,
    hasMultipleShops,
    shops,
    selectShop,
    shopName,
    timeFilter,
    totalRevenue,
    totalOrders,
    totalProducts,
    pendingOrders,
    completedOrders,
    cancelledOrders,
    outOfStock,
    lowStockProducts,
    recentOrders,
  } = useDashboardMetrics();

  // Show empty state if no active shop or shop is pending approval
  if (!activeShop || activeShop.status === 'PENDING_APPROVAL') {
    return (
      <div className="space-y-6">
        <div className="seller-section-header">
          <h1 className="seller-section-header-title">
            {activeShop?.status === 'PENDING_APPROVAL' ? 'Shop Pending Approval' : 'No Active Shop'}
          </h1>
          <p className="seller-section-header-desc">
            {activeShop?.status === 'PENDING_APPROVAL'
              ? 'Your shop is under review. You will be able to manage it once approved.'
              : 'You need to create a shop to start selling on Aritii Marketplace.'}
          </p>
        </div>
        <SellerEmptyState
          title={activeShop?.status === 'PENDING_APPROVAL' ? 'Shop Under Review' : 'Create Your First Shop'}
          description={
            activeShop?.status === 'PENDING_APPROVAL'
              ? 'Your shop application is being reviewed by our team. This usually takes 1-3 business days.'
              : 'Your seller account is approved! Create your first shop to start selling.'
          }
          action={
            activeShop?.status === 'PENDING_APPROVAL'
              ? { to: '/seller-registration/status', label: 'Check Application Status' }
              : { to: '/business/shops', label: 'Create Shop' }
          }
          icon="🏪"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header & Greeting */}
      <DashboardGreeting
        seller={seller}
        shopName={shopName}
        hasMultipleShops={hasMultipleShops}
        shops={shops}
        activeShopId={activeShopId}
        selectShop={selectShop}
      />

      {/* 2. Top-level KPI Metrics */}
      <DashboardKPICards
        totalProducts={totalProducts}
        totalOrders={totalOrders}
        totalRevenue={totalRevenue}
        pendingOrders={pendingOrders}
        cancelledOrders={cancelledOrders}
      />

      {/* 3. Wallet summary */}
      <div className="mt-6">
        <WalletCard
          sellerId={userId}
          onViewTransactions={() => navigate('/business/wallet/transactions')}
        />
      </div>

      {/* 4. Stock alerts */}
      <DashboardStockAlerts
        outOfStock={outOfStock}
        lowStockCount={lowStockProducts.length}
      />

      {/* 5. Sales Trend and Order Status breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="seller-section-header">
          <h3 className="text-lg font-bold text-market-on-surface mb-4">Sales Trend</h3>
          <div className="h-[240px]">
            <SalesOverviewChart timeFilter={timeFilter} />
          </div>
        </div>
        <div className="seller-section-header">
          <h3 className="text-lg font-bold text-market-on-surface mb-4">Order Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-market-surface-container-low rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-100" />
                <span className="text-market-on-surface font-medium">Pending</span>
              </div>
              <span className="font-semibold text-market-on-surface">{pendingOrders}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-market-surface-container-low rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-100" />
                <span className="text-market-on-surface font-medium">Completed</span>
              </div>
              <span className="font-semibold text-market-on-surface">{completedOrders}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-market-surface-container-low rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-100" />
                <span className="text-market-on-surface font-medium">Cancelled</span>
              </div>
              <span className="font-semibold text-market-on-surface">{cancelledOrders}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Recent Orders Table */}
      <DashboardRecentOrders recentOrders={recentOrders} />

      {/* 7. Operational Status and Quick Actions */}
      <DashboardOperations />

      {/* 8. Seller Metrics and Returns cards */}
      <div className="seller-section">
        <h3 className="seller-section-title">Performance Metrics</h3>
        <SellerMetricsDisplay />
      </div>

      <div className="seller-section">
        <ReturnsDashboardCard onNavigate={navigate} />
      </div>
    </div>
  );
};

export default DashboardHero;
