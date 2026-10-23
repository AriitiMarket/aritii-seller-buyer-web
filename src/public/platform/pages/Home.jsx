import React from 'react';
import { Link } from 'react-router-dom';
import {
  AiOutlineShop,
  AiOutlineGlobal,
  AiOutlineHeart,
  AiOutlineStar,
  AiOutlineSafety,
  AiOutlineThunderbolt,
  AiOutlineCustomerService,
} from 'react-icons/ai';
import { PublicLayout } from '@/public/layout/PublicLayout';
import { HeroSection } from '@/public/marketplace/components/HeroSection';
import AmazonCategoryGrid from '@/public/marketplace/components/AmazonCategoryGrid';
import { TrendingProducts } from '@/features/marketplace/components/TrendingProducts';
import FeaturedShopsRow from '@/features/marketplace/components/FeaturedShopsRow';
import { PlatformRolesSection } from '@/public/platform/components/PlatformRolesSection';
import { HowItWorksSection } from '@/public/platform/components/HowItWorksSection';

/**
 * PUBLIC HOMEPAGE - Amazon-Style Marketplace Discovery
 *
 * Implements Amazon shopping patterns:
 * - Immersive Hero with floating 4-quadrant feature cards (categories limited to 4 per card)
 * - Trending Products limited to top 5 with direct marketplace details links
 * - Featured Local Shops limited to top 4 with direct storefront links
 * - Connected Ecosystem: Buyers, Sellers, and Delivery Partners
 */
const HomePage = () => {
  return (
    <PublicLayout>
      <div className="home-page-scroll bg-[#EAEDED] dark:bg-[#0f1419] min-h-screen">
        <div className="relative z-10">
          {/* Amazon-style Hero */}
          <HeroSection />

          {/* Floating Category & Deal Grid (Amazon 4-quadrant cards, limited to 4 per card) */}
          <AmazonCategoryGrid />

          {/* Quick Department & Logistics Shortcuts Rail */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-8 relative z-20">
            <div className="bg-white dark:bg-[#1a222d] rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#75d04b]/15 text-[#5ac12f] flex items-center justify-center font-bold text-lg flex-shrink-0">
                  <AiOutlineShop size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F1111] dark:text-white">Aritii Local Marketplace</h3>
                  <p className="text-xs text-[#565959] dark:text-gray-400">Direct from community artisans & verified merchants across Ethiopia</p>
                </div>
              </div>

              {/* Department pill buttons */}
              <div className="flex items-center gap-2 flex-wrap justify-center md:justify-end text-xs">
                <Link
                  to="/categories"
                  className="px-3 py-1.5 rounded-lg bg-[#131921] hover:bg-[#232f3e] text-white font-bold transition-colors"
                >
                  All Departments →
                </Link>
                <Link
                  to="/products?category=Electronics"
                  className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-[#0F1111] dark:text-gray-200 font-medium transition-colors"
                >
                  Electronics
                </Link>
                <Link
                  to="/products?category=Fashion"
                  className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-[#0F1111] dark:text-gray-200 font-medium transition-colors"
                >
                  Fashion
                </Link>
                <Link
                  to="/products?category=Groceries"
                  className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-[#0F1111] dark:text-gray-200 font-medium transition-colors"
                >
                  Coffee & Spices
                </Link>
                <Link
                  to="/products?category=Handcrafts"
                  className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-[#0F1111] dark:text-gray-200 font-medium transition-colors"
                >
                  Handcrafts
                </Link>
                <Link
                  to="/shops"
                  className="px-3 py-1.5 rounded-lg bg-[#FF9900]/15 hover:bg-[#FF9900]/25 text-[#FF9900] font-bold transition-colors"
                >
                  🏪 Shops
                </Link>
                <Link
                  to="/delivery"
                  className="px-3 py-1.5 rounded-lg bg-[#00A8E1]/15 hover:bg-[#00A8E1]/25 text-[#00A8E1] font-bold transition-colors"
                >
                  🚚 Delivery
                </Link>
              </div>
            </div>
          </section>

          {/* Featured Products & Deals (Limited to 5 with direct marketplace /product/:id link) */}
          <TrendingProducts />

          {/* Featured Verified Shops (Limited to 4 with direct storefront /shop/:id link) */}
          <FeaturedShopsRow />

          {/* Amazon-Style Value Proposition / Fast Delivery Banner */}
          <section className="py-6 bg-white dark:bg-[#131921] border-b border-gray-200 dark:border-gray-800 my-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="flex flex-col items-center p-3">
                  <div className="w-10 h-10 rounded-full bg-[#FF9900]/10 text-[#FF9900] flex items-center justify-center mb-2">
                    <AiOutlineThunderbolt size={22} />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#0F1111] dark:text-white">Fast Local Delivery</h4>
                  <p className="text-[11px] text-[#565959] dark:text-gray-400">Same-day options across key zones</p>
                </div>
                <div className="flex flex-col items-center p-3">
                  <div className="w-10 h-10 rounded-full bg-[#00A8E1]/10 text-[#00A8E1] flex items-center justify-center mb-2">
                    <AiOutlineSafety size={22} />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#0F1111] dark:text-white">Secure Checkout</h4>
                  <p className="text-[11px] text-[#565959] dark:text-gray-400">Protected payments & easy refunds</p>
                </div>
                <div className="flex flex-col items-center p-3">
                  <div className="w-10 h-10 rounded-full bg-[#75d04b]/10 text-[#5ac12f] flex items-center justify-center mb-2">
                    <AiOutlineShop size={22} />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#0F1111] dark:text-white">Verified Local Sellers</h4>
                  <p className="text-[11px] text-[#565959] dark:text-gray-400">Direct from community artisans & shops</p>
                </div>
                <div className="flex flex-col items-center p-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center mb-2">
                    <AiOutlineCustomerService size={22} />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#0F1111] dark:text-white">Dedicated Support</h4>
                  <p className="text-[11px] text-[#565959] dark:text-gray-400">24/7 assistance for orders & sellers</p>
                </div>
              </div>
            </div>
          </section>

          {/* Three connected experiences: buyers, sellers, delivery */}
          <PlatformRolesSection />

          {/* How Aritii Works */}
          <HowItWorksSection />

          {/* Local Commerce Community Focus */}
          <section className="py-12 md:py-16 bg-white dark:bg-[#1a222d] border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10 md:mb-12">
                <span className="inline-block px-3 py-1 mb-3 rounded-full bg-[#FF9900]/10 text-[#FF9900] text-xs font-bold uppercase tracking-wider">
                  Community Marketplace
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-[#0F1111] dark:text-white mb-2">
                  Built for Ethiopian Businesses & Shoppers
                </h2>
                <p className="text-[#565959] dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
                  Aritii combines modern e-commerce standards with deep local support.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { icon: AiOutlineShop, title: 'Local Sellers', description: 'Support independent businesses and artisanal creators right in your city.' },
                  { icon: AiOutlineGlobal, title: 'Authentic Sourcing', description: 'Discover genuine goods made and sourced locally without excessive markups.' },
                  { icon: AiOutlineHeart, title: 'Frictionless Shopping', description: 'Clean Amazon-inspired navigation, clear filters, and instant search.' },
                  { icon: AiOutlineThunderbolt, title: 'Connected Delivery', description: 'Real-time assignment to riders for fast, door-to-door handoffs.' },
                  { icon: AiOutlineSafety, title: 'Buyer Protection', description: 'Escrow payments and transparent returns protect every purchase.' },
                  { icon: AiOutlineStar, title: 'Seller Growth Tools', description: 'Analytics, inventory alerts, and instant payouts empower merchants.' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="flex items-start gap-4 p-5 bg-[#F7F7F7] dark:bg-gray-850 rounded-lg border border-gray-200 dark:border-gray-800"
                    >
                      <span className="flex-shrink-0 w-11 h-11 rounded-lg bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-[#FF9900]">
                        <Icon size={22} />
                      </span>
                      <div>
                        <h3 className="font-bold text-sm text-[#0F1111] dark:text-white mb-1">{item.title}</h3>
                        <p className="text-xs text-[#565959] dark:text-gray-400 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Comprehensive Commerce & Logistics Network Hub */}
          <section className="bg-[#EAEDED] dark:bg-[#0f1419] py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <span className="inline-block px-3 py-1 mb-2 rounded-full bg-[#75d04b]/15 text-[#5ac12f] text-xs font-bold uppercase tracking-wider">
                  The Aritii Commerce Network
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#0F1111] dark:text-white">
                  Built for Buyers, Sellers, and Delivery Partners
                </h2>
                <p className="text-xs sm:text-sm text-[#565959] dark:text-gray-400 max-w-xl mx-auto mt-1">
                  Connect with Ethiopia's premier local marketplace with integrated fulfillment and safe payments.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Seller Box */}
                <div className="p-6 sm:p-7 bg-white dark:bg-[#1a222d] border border-gray-200 dark:border-gray-800 rounded-xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-10 h-10 rounded-lg bg-[#FF9900]/15 text-[#FF9900] flex items-center justify-center font-bold text-lg">
                        🏪
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF9900] bg-[#FF9900]/10 px-2 py-0.5 rounded-full">
                        0% Listing Fee
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#0F1111] dark:text-white mb-2">
                      Sell on Aritii Marketplace
                    </h3>
                    <p className="text-xs text-[#565959] dark:text-gray-400 mb-4 leading-relaxed">
                      Launch your digital storefront in minutes. Reach thousands of active shoppers, manage multi-shop inventory, and receive direct bank & Telebirr payouts.
                    </p>
                    <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300 mb-6">
                      <li className="flex items-center gap-2">✓ Verified storefront badge</li>
                      <li className="flex items-center gap-2">✓ Automated courier dispatch</li>
                      <li className="flex items-center gap-2">✓ Direct escrow settlements</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <Link
                      to="/seller-center"
                      className="block w-full text-center py-2.5 px-4 bg-[#FF9900] hover:bg-[#E68A00] text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
                    >
                      Open Your Shop Now
                    </Link>
                    <Link
                      to="/seller-center/overview"
                      className="block w-full text-center py-1.5 text-xs text-[#007185] hover:underline"
                    >
                      How selling works →
                    </Link>
                  </div>
                </div>

                {/* Delivery Box */}
                <div className="p-6 sm:p-7 bg-white dark:bg-[#1a222d] border border-gray-200 dark:border-gray-800 rounded-xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-10 h-10 rounded-lg bg-[#00A8E1]/15 text-[#00A8E1] flex items-center justify-center font-bold text-lg">
                        🚚
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#00A8E1] bg-[#00A8E1]/10 px-2 py-0.5 rounded-full">
                        Daily Payouts
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#0F1111] dark:text-white mb-2">
                      Deliver & Earn with Aritii
                    </h3>
                    <p className="text-xs text-[#565959] dark:text-gray-400 mb-4 leading-relaxed">
                      Be your own boss. Pick up packages from local shops using your bicycle, motorcycle, or car, and complete door-to-door deliveries in your preferred zone.
                    </p>
                    <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300 mb-6">
                      <li className="flex items-center gap-2">✓ Flexible schedules & zone choice</li>
                      <li className="flex items-center gap-2">✓ Transparent per-trip compensation</li>
                      <li className="flex items-center gap-2">✓ Real-time rider support app</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <Link
                      to="/delivery-center"
                      className="block w-full text-center py-2.5 px-4 bg-[#00A8E1] hover:bg-[#0087B8] text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
                    >
                      Apply as Delivery Partner
                    </Link>
                    <Link
                      to="/delivery"
                      className="block w-full text-center py-1.5 text-xs text-[#007185] hover:underline"
                    >
                      Explore logistics network →
                    </Link>
                  </div>
                </div>

                {/* Logistics & Tracking Box */}
                <div className="p-6 sm:p-7 bg-white dark:bg-[#1a222d] border border-gray-200 dark:border-gray-800 rounded-xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-10 h-10 rounded-lg bg-[#75d04b]/15 text-[#75d04b] flex items-center justify-center font-bold text-lg">
                        📍
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#75d04b] bg-[#75d04b]/10 px-2 py-0.5 rounded-full">
                        Live Tracking
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#0F1111] dark:text-white mb-2">
                      Track Deliveries & Zones
                    </h3>
                    <p className="text-xs text-[#565959] dark:text-gray-400 mb-4 leading-relaxed">
                      Follow every order step by step. Our multi-zone logistics system links regional dispatch ports directly to customer addresses across all major cities.
                    </p>
                    <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300 mb-6">
                      <li className="flex items-center gap-2">✓ Real-time order progress</li>
                      <li className="flex items-center gap-2">✓ Doorstep courier confirmation</li>
                      <li className="flex items-center gap-2">✓ 100% Escrow purchase guarantee</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <Link
                      to="/my-dashboard/orders"
                      className="block w-full text-center py-2.5 px-4 bg-[#131921] hover:bg-[#232f3e] text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
                    >
                      Track My Orders
                    </Link>
                    <Link
                      to="/help"
                      className="block w-full text-center py-1.5 text-xs text-[#007185] hover:underline"
                    >
                      Buyer protection & FAQ →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Amazon-style Sign In CTA Bar for visitors */}
          <section className="bg-white dark:bg-[#131921] py-8 border-t border-gray-200 dark:border-gray-800 text-center">
            <div className="max-w-md mx-auto px-4">
              <p className="text-xs text-[#0F1111] dark:text-white mb-2 font-medium">
                See personalized recommendations
              </p>
              <Link
                to="/login"
                className="block w-full py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] text-xs font-bold rounded-md shadow-sm transition-colors mb-2"
              >
                Sign In
              </Link>
              <p className="text-[11px] text-[#565959] dark:text-gray-400">
                New customer?{' '}
                <Link to="/sign-up" className="text-[#007185] dark:text-[#42a2b3] hover:underline">
                  Start here.
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
};

export default HomePage;
