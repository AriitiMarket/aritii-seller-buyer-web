import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicHeader from '@/public/components/PublicHeader';
import ExperienceSubNav from '@/public/components/ExperienceSubNav';
import Footer from '@/shared/components/Footer';
import SkipToContent from '@/shared/components/SkipToContent';
import PublicScrollToTop from '@/public/components/PublicScrollToTop';

/**
 * PublicCatalogLayout - Wraps all public catalog routes (Products, Categories,
 * Shops, Deals, BestSelling, Search).
 *
 * Uses the same PublicHeader + ExperienceSubNav as other public pages, so the
 * Marketplace sub-header stays visible while browsing the catalog.
 */
const PublicCatalogLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDF6EC] dark:bg-gray-950">
      <PublicScrollToTop />
      <SkipToContent />
      <PublicHeader />
      <ExperienceSubNav />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none bg-[#FDF6EC] dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 md:py-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PublicCatalogLayout;
