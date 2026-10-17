import MarketplaceHeader from "@/public/components/MarketplaceHeader"
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
 * for all marketplace browsing, before and after authentication.
 *
 * Chrome stack (mobile-first):
 *   1. MarketplaceHeader — sticky, h-16 (64px), full-bleed
 *   2. SubNavBar — sticky top-16, h-10 (40px), full-bleed dark rail mounted
 *      directly under the header on every catalog route (matches the header's
 *      documented contract), so it spans edge-to-edge on desktop
 *   3. Page content — inside the standard max-w-7xl + px-4/6/8 container with
 *      pt-4 so nothing touches the sub-nav rail
 */
const PublicCatalogLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <PublicScrollToTop />
      <SkipToContent />
      <MarketplaceHeader />
      <SubNavBar />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none bg-white dark:bg-gray-950">
        {/* Main content background — full width from edge to edge, with no
            fixed max-width. The standard max-w-7xl + gutter container lives
            inside as the inner content wrapper (margin: 0 auto). */}
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
