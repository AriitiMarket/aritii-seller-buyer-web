import React from 'react';
import PublicHeader from '@/public/components/PublicHeader';
import PublicFooter from '@/shared/components/Footer';
import TopNotificationBar from '@/public/components/TopNotificationBar';
import { HeroSection } from '@/public/sections/HeroSection';
import { FeaturedCategories } from '@/public/sections/FeaturedCategories';
import { SelectedProducts } from '@/public/sections/SelectedProducts';
import { SelectedShops } from '@/public/sections/SelectedShops';
import { DealsSection } from '@/public/sections/DealsSection';
import { TrendingProducts } from '@/public/sections/TrendingProducts';
import { HowItWorksSection } from '@/public/sections/HowItWorksSection';

/**
 * PUBLIC HOMEPAGE - Marketplace discovery page
 *
 * A focused e-commerce marketplace homepage that helps users discover
 * products, shops, and categories. Not a corporate landing page.
 */
const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNotificationBar />
      <PublicHeader />

      {/* Hero with search */}
      <HeroSection />

      {/* Categories */}
      <FeaturedCategories />

      {/* Today's Deals */}
      <DealsSection />

      {/* Featured products and shops */}
      <SelectedProducts />
      <SelectedShops />

      {/* Trending products */}
      <TrendingProducts />

      {/* How it works */}
      <HowItWorksSection />

      <PublicFooter />
    </div>
  );
};

export default HomePage;
