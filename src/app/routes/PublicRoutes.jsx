import React, { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import PublicCatalogLayout from '@/public/layout/PublicCatalogLayout';

/**
 * PUBLIC WEBSITE routes - no authentication required.
 *
 * Public pages present curated content and explain the platform.
 *
 * Namespaces:
 *   /marketplace/*   → retail shopping experience, product catalog, cart
 *   /seller-center/* → seller marketing and onboarding
 *   /delivery        → delivery ecosystem overview
 *
 * Catalog browsing pages (Products, Categories, Shops, Deals, etc.)
 * are also accessible at root paths and wrapped in PublicCatalogLayout.
 */
const HomePage = lazy(() => import('@/public/platform/pages/Home'));
const AboutPage = lazy(() => import('@/public/platform/pages/About'));
const HowItWorksPage = lazy(() => import('@/public/platform/pages/HowItWorks'));
const FAQPage = lazy(() => import('@/public/platform/pages/FAQ'));
const PublicEventsPage = lazy(() => import('@/public/platform/pages/Events'));
const LegalPage = lazy(() => import('@/public/platform/pages/Legal'));
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
const ShopDetailsPage = lazy(() => import('@/features/buyer/pages/ShopDetail'));
const DealsPage = lazy(() => import('@/features/marketplace/pages/DealsPage'));
const BuyerCartPage = lazy(() => import('@/features/buyer/pages/Cart'));

export const PublicRoutes = () => (
  <>
    {/* Marketing / informational pages */}
    <Route path="/" element={<HomePage />} />
    <Route path="/sell-on-aritii" element={<SellOnAritiiPage />} />

    {/* Seller Center marketing pages — dedicated public sections */}
    <Route path="/seller-center" element={<SellerCentralLandingPage />} />
    <Route path="/seller-center/overview" element={<SellerCenterOverviewPage />} />
    <Route path="/seller-center/benefits" element={<SellerCenterBenefitsPage />} />
    <Route path="/seller-center/how-it-works" element={<SellerCenterHowItWorksPage />} />
    <Route path="/seller-center/workspace" element={<SellerCenterWorkspacePage />} />

    {/* Delivery public marketing */}
    <Route path="/delivery" element={<DeliveryExperiencePage />} />
    <Route path="/delivery-center" element={<DeliveryPortalLandingPage />} />

    <Route path="/about" element={<AboutPage />} />
    <Route path="/how-it-works" element={<HowItWorksPage />} />
    <Route path="/faq" element={<FAQPage />} />
    <Route path="/events" element={<PublicEventsPage />} />

    {/* Aliases for the help entry points used by the header and the footer */}
    <Route path="/help" element={<Navigate to="/faq" replace />} />
    <Route path="/support" element={<Navigate to="/faq" replace />} />
    <Route path="/customer-service" element={<Navigate to="/faq" replace />} />
    <Route path="/privacy" element={<LegalPage doc="privacy" />} />
    <Route path="/terms" element={<LegalPage doc="terms" />} />
    <Route path="/cookie" element={<LegalPage doc="cookie" />} />

    {/* Explicit /marketplace/* Retail Catalog Namespace */}
    <Route path="/marketplace" element={<PublicCatalogLayout />}>
      <Route index element={<MarketplaceLandingPage />} />
      <Route path="products" element={<ProductsPage />} />
      <Route path="product/:id" element={<ProductDetailsPage />} />
      <Route path="categories" element={<CategoriesPage />} />
      <Route path="shops" element={<ShopsPage />} />
      <Route path="shops/:id" element={<ShopDetailsPage />} />
      <Route path="shop/:id" element={<ShopDetailsPage />} />
      <Route path="deals" element={<DealsPage />} />
      <Route path="best-selling" element={<BestSellersPage />} />
      <Route path="cart" element={<BuyerCartPage />} />
      <Route path="new-arrivals" element={<Navigate to="/marketplace/products?sort=newest" replace />} />
      <Route path="search" element={<Navigate to="/marketplace/products" replace />} />
    </Route>

    {/* Canonical root catalog browsing paths — wrapped in PublicCatalogLayout */}
    <Route element={<PublicCatalogLayout />}>
      <Route path="/cart" element={<BuyerCartPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/product/:id" element={<ProductDetailsPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/shops" element={<ShopsPage />} />
      <Route path="/shops/:id" element={<ShopDetailsPage />} />
      <Route path="/shop/:id" element={<ShopDetailsPage />} />
      <Route path="/deals" element={<DealsPage />} />
      <Route path="/best-selling" element={<BestSellersPage />} />
      <Route path="/new-arrivals" element={<Navigate to="/products?sort=newest" replace />} />
      <Route path="/search" element={<Navigate to="/products" replace />} />
    </Route>
  </>
);

export default PublicRoutes;
