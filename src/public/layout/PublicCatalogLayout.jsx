import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicHeader from '@/public/components/PublicHeader';
import Footer from '@/shared/components/Footer';
import SkipToContent from '@/shared/components/SkipToContent';

/**
 * PublicCatalogLayout - Wraps all public catalog routes (Products, Categories,
 * Shops, Deals, BestSelling, Search).
 *
 * Uses the same PublicHeader as other public pages.
 */
const PublicCatalogLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <SkipToContent />
      <PublicHeader />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PublicCatalogLayout;
