import React from 'react';
import { useBuyerDashboard } from '@/features/buyer/hooks/useBuyerDashboard';
import {
  BuyerWelcomeBanner,
  BuyerQuickStats,
  BuyerActiveOrdersList,
  BuyerProductSection,
  BuyerPopularShops,
  BuyerDashboardEmptyState,
} from './components';

/**
 * BuyerOverviewPage — Orchestrates the buyer dashboard overview.
 * Data subscription and derived order/catalog metrics are managed in useBuyerDashboard hook;
 * UI display is decomposed into modular presentational sub-components.
 */
const BuyerOverviewPage = () => {
  const {
    user,
    orders,
    activeOrders,
    inTransitCount,
    cartCount,
    wishlistCount,
    recommendedProducts,
    newArrivals,
    topShops,
  } = useBuyerDashboard();

  const isEmpty = recommendedProducts.length === 0 && activeOrders.length === 0;

  return (
    <div className="space-y-8">
      {/* 1. Welcome Banner */}
      <BuyerWelcomeBanner
        user={user}
        activeOrdersCount={activeOrders.length}
      />

      {/* 2. Quick Key Stats */}
      <BuyerQuickStats
        totalOrders={orders.length}
        inTransitCount={inTransitCount}
        cartCount={cartCount}
        savedItemsCount={wishlistCount}
      />

      {/* 3. Active Orders Stepper */}
      <BuyerActiveOrdersList activeOrders={activeOrders} />

      {/* 4. Recommended Products Carousel/Grid */}
      <BuyerProductSection
        title="Recommended For You"
        products={recommendedProducts}
        viewAllTo="/my-dashboard/marketplace"
      />

      {/* 5. New Arrivals Carousel/Grid */}
      <BuyerProductSection
        title="New Arrivals"
        products={newArrivals}
        viewAllTo="/my-dashboard/marketplace"
      />

      {/* 6. Popular Shops */}
      <BuyerPopularShops topShops={topShops} />

      {/* 7. Empty State Fallback */}
      {isEmpty && <BuyerDashboardEmptyState />}
    </div>
  );
};

export default BuyerOverviewPage;
