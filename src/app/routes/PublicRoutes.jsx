import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import PublicCatalogLayout from '@/public/layout/PublicCatalogLayout';

/**
 * PUBLIC WEBSITE routes - no authentication required.
 *
 * Public pages present curated content and explain the platform.
 *
 * The three public experiences:
 *   /marketplace     → shopping-focused entry into the catalog (/products, /shops)
 *   /sell-on-aritii  → seller marketing/onboarding (→ /become-a-seller)
 *   /delivery        → delivery ecosystem explanation (public only, no ops data)
 *
 * Catalog browsing pages (Products, Categories, Shops, Deals, etc.)
 * are also public and wrapped in PublicCatalogLayout.
 */
const HomePage = lazy(() => import('@/public/platform/pages/Home'));
const AboutPage = lazy(() => import('@/public/platform/pages/About'));
const HowItWorksPage = lazy(() => import('@/public/platform/pages/HowItWorks'));
const FAQPage = lazy(() => import('@/public/platform/pages/FAQ'));
const PublicEventsPage = lazy(() => import('@/public/platform/pages/Events'));
const MarketplaceLandingPage = lazy(() => import('@/public/marketplace/pages/Marketplace'));
const SellOnAritiiPage = lazy(() => import('@/public/sell/pages/SellOnAritii'));
const DeliveryExperiencePage = lazy(() => import('@/public/delivery/pages/Delivery'));

const ProductsPage = lazy(() => import('@/public/marketplace/pages/Products'));
const ProductDetailsPage = lazy(() => import('@/buyer/pages/ProductDetail'));
const CategoriesPage = lazy(() => import('@/public/marketplace/pages/Categories'));
const ShopsPage = lazy(() => import('@/public/marketplace/pages/Shops'));
const ShopDetailsPage = lazy(() => import('@/buyer/pages/ShopDetail'));
const DealsPage = lazy(() => import('@/public/marketplace/pages/Deals'));
const BestSellingPage = lazy(() => import('@/public/marketplace/pages/BestSelling'));
const SearchResultsPage = lazy(() => import('@/public/marketplace/pages/SearchResults'));

export const PublicRoutes = () => (
  <>
    {/* Marketing / informational pages */}
    <Route path="/" element={<HomePage />} />
    <Route path="/marketplace" element={<MarketplaceLandingPage />} />
    <Route path="/sell-on-aritii" element={<SellOnAritiiPage />} />
    <Route path="/delivery" element={<DeliveryExperiencePage />} />
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
