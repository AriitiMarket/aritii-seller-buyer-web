import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import PublicCatalogLayout from '@/public/layout/PublicCatalogLayout';

/**
 * PUBLIC WEBSITE routes - no authentication required.
 *
 * Public pages present curated content and explain the platform.
 * Catalog browsing pages (Products, Categories, Shops, Deals, etc.)
 * are also public and wrapped in PublicCatalogLayout.
 */
const HomePage = lazy(() => import('@/public/pages/Home'));
const AboutPage = lazy(() => import('@/public/pages/About'));
const HowItWorksPage = lazy(() => import('@/public/pages/HowItWorks'));
const FAQPage = lazy(() => import('@/public/pages/FAQ'));
const PublicEventsPage = lazy(() => import('@/public/pages/Events'));

const ProductsPage = lazy(() => import('@/public/pages/Products'));
const ProductDetailsPage = lazy(() => import('@/buyer/pages/ProductDetail'));
const CategoriesPage = lazy(() => import('@/public/pages/Categories'));
const ShopsPage = lazy(() => import('@/public/pages/Shops'));
const ShopDetailsPage = lazy(() => import('@/buyer/pages/ShopDetail'));
const DealsPage = lazy(() => import('@/public/pages/Deals'));
const BestSellingPage = lazy(() => import('@/public/pages/BestSelling'));
const SearchResultsPage = lazy(() => import('@/public/pages/SearchResults'));

export const PublicRoutes = () => (
  <>
    {/* Marketing / informational pages */}
    <Route path="/" element={<HomePage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/how-it-works" element={<HowItWorksPage />} />
    <Route path="/faq" element={<FAQPage />} />
    <Route path="/events" element={<PublicEventsPage />} />

    {/* Catalog browsing - public, no auth required */}
    <Route element={<PublicCatalogLayout />}>
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/product/:id" element={<ProductDetailsPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/shops" element={<ShopsPage />} />
      <Route path="/shops/:id" element={<ShopDetailsPage />} />
      <Route path="/deals" element={<DealsPage />} />
      <Route path="/best-selling" element={<BestSellingPage />} />
      <Route path="/search" element={<SearchResultsPage />} />
    </Route>
  </>
);

export default PublicRoutes;
