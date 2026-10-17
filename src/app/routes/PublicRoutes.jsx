import React, { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
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
const MarketplaceLandingPage = lazy(() => import('@/features/marketplace/pages/MarketplaceLandingPage'));
const SellOnAritiiPage = lazy(() => import('@/public/sell/pages/SellOnAritii'));
const SellerCentralLandingPage = lazy(() => import('@/public/seller-central/pages/SellerCentralLanding'));
const SellerCenterOverviewPage = lazy(() => import('@/public/sell/pages/SellerCenterOverview'));
const SellerCenterBenefitsPage = lazy(() => import('@/public/sell/pages/SellerCenterBenefits'));
const SellerCenterHowItWorksPage = lazy(() => import('@/public/sell/pages/SellerCenterHowItWorks'));
const SellerCenterWorkspacePage = lazy(() => import('@/public/sell/pages/SellerCenterWorkspace'));
const DeliveryExperiencePage = lazy(() => import('@/public/delivery/pages/Delivery'));
const DeliveryPortalLandingPage = lazy(() => import('@/public/delivery-center/pages/DeliveryPortalLanding'));

const ProductsPage = lazy(() => import('@/features/marketplace/pages/Products'));
const BestSellersPage = lazy(() => import('@/features/marketplace/pages/BestSellersPage'));
const ProductDetailsPage = lazy(() => import('@/features/marketplace/pages/ProductDetail'));
const CategoriesPage = lazy(() => import('@/features/marketplace/pages/Categories'));
const ShopsPage = lazy(() => import('@/features/marketplace/pages/Shops'));
const ShopDetailsPage = lazy(() => import('@/buyer/pages/ShopDetail'));
const DealsPage = lazy(() => import('@/features/marketplace/pages/DealsPage'));
const SearchResultsPage = lazy(() => import('@/features/marketplace/pages/Products'));  // kept from public

export const PublicRoutes = () => (
  <>
    {/* Marketing / informational pages */}
    <Route path="/" element={<HomePage />} />
    <Route path="/marketplace" element={<MarketplaceLandingPage />} />
    <Route path="/sell-on-aritii" element={<SellOnAritiiPage />} />
    {/* Independent Seller Central Landing */}
    <Route path="/seller" element={<SellerCentralLandingPage />} />
    {/* Seller Center pages - dedicated sections */}
    <Route path="/seller-center/overview" element={<SellerCenterOverviewPage />} />
    <Route path="/seller-center/benefits" element={<SellerCenterBenefitsPage />} />
    <Route path="/seller-center/how-it-works" element={<SellerCenterHowItWorksPage />} />
    <Route path="/seller-center/workspace" element={<SellerCenterWorkspacePage />} />
    <Route path="/delivery" element={<DeliveryExperiencePage />} />
    <Route path="/delivery-center" element={<DeliveryPortalLandingPage />} />
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
      <Route path="/best-selling" element={<BestSellersPage />} />
      <Route path="/search" element={<Navigate to="/products" replace />} />
    </Route>
  </>
);

export default PublicRoutes;
