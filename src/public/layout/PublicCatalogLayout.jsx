import MarketplaceHeader from "@/public/components/MarketplaceHeader"
import TopUtilityBar from "@/public/components/TopUtilityBar"
import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '@/shared/components/Footer';
import SkipToContent from '@/shared/components/SkipToContent';
import PublicScrollToTop from '@/public/components/PublicScrollToTop';
import SubNavBar from '@/features/marketplace/components/SubNavBar';

/**
 * PublicCatalogLayout - Wraps all public catalog routes (Products, Categories,
 * Shops, Deals, BestSelling, Search, ProductDetail, ShopDetail, Requests).
 *
 * Chrome stack (mobile-first):
 *   1. TopUtilityBar — h-10 (40px), location selector + portal links
 *   2. MarketplaceHeader — sticky, h-16 (64px), full-bleed
 *   3. SubNavBar — sticky, h-10 (40px), marketplace navigation
 *   4. Page content — inside the standard max-w-7xl container
 */
const PublicCatalogLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <PublicScrollToTop />
      <SkipToContent />
      <TopUtilityBar />
      <MarketplaceHeader />
      <SubNavBar />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none bg-white dark:bg-gray-950">
        <div className="w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <Outlet />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PublicCatalogLayout;
