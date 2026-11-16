import React from 'react';
import BaseLayout from '@/components/layout/BaseLayout';
import MarketplaceHeader from '@/features/marketplace/components/MarketplaceHeader';
import Footer from '@/shared/components/Footer';
import PublicScrollToTop from '@/public/components/PublicScrollToTop';
import TopUtilityBar from '@/public/components/TopUtilityBar';

/**
 * PublicCatalogLayout - Wraps all public catalog routes (Products, Categories,
 * Shops, Deals, BestSelling, Search, ProductDetail, ShopDetail, Requests).
 *
 * Uses BaseLayout with:
 * - topBar: PublicScrollToTop + TopUtilityBar (scroll restoration & portal switcher)
 * - header: MarketplaceHeader (primary header + subnavbar)
 * - contentWrapper: standard max-w-7xl container with responsive horizontal padding
 * - footer: Marketplace Footer
 * - layoutMode: 'page'
 * - withErrorBoundary: true (crash containment)
 */
const PublicCatalogLayout = () => {
  return (
    <BaseLayout
      portalName="Marketplace"
      layoutMode="page"
      topBar={
        <>
          <PublicScrollToTop />
          <TopUtilityBar />
        </>
      }
      header={<MarketplaceHeader />}
      footer={<Footer />}
      className="min-h-screen flex flex-col bg-white dark:bg-gray-950"
      mainClassName="flex-1 outline-none bg-white dark:bg-gray-950"
      contentWrapperClassName="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4"
      withErrorBoundary={true}
    />
  );
};

export { PublicCatalogLayout };
export default PublicCatalogLayout;
