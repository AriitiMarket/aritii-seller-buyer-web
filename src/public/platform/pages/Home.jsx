import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineArrowRight, AiOutlineCheck, AiOutlineShop, AiOutlineGlobal, AiOutlineHeart, AiOutlineStar } from 'react-icons/ai';
import { PublicLayout } from '@/public/layout/PublicLayout';
import { HeroSection } from '@/public/marketplace/components/HeroSection';
import { PlatformRolesSection } from '@/public/platform/components/PlatformRolesSection';
import { TrendingProducts } from '@/public/marketplace/components/TrendingProducts';
import { HowItWorksSection } from '@/public/platform/components/HowItWorksSection';

/**
 * PUBLIC HOMEPAGE - Marketplace discovery page
 *
 * A focused e-commerce marketplace homepage that presents Aritii as one
 * platform for local commerce — buyers, sellers and delivery services — and
 * helps users discover products, shops, and categories.
 */
const HomePage = () => {
  return (
    <PublicLayout>
      <div className="home-page-scroll">
        <div className="relative z-10">
      {/* Hero with search */}
      <HeroSection />

      {/* Three connected experiences: buyers, sellers, delivery */}
      <PlatformRolesSection />

      {/* How Aritii Works */}
      <HowItWorksSection />

      {/* Trending products */}
      <TrendingProducts />

      {/* Local Commerce Focus Section */}
      <section className="home-brand-section home-brand-section--community py-12 md:py-16 bg-[#FDF6EC] dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-12">
            <span className="inline-block px-3 py-1 mb-4 rounded-full bg-[#75d04b]/10 text-[#5ac12f] text-xs font-bold uppercase tracking-wider">
              Local Commerce Focus
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Built for Local Communities
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
              Aritii strengthens local economies by connecting buyers with sellers in their communities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: AiOutlineShop, title: 'Local Sellers', description: 'Support businesses in your community by shopping from local shops and sellers.' },
              { icon: AiOutlineGlobal, title: 'Local Products', description: 'Discover products made and sourced locally, reducing delivery distances.' },
              { icon: AiOutlineHeart, title: 'Accessible Shopping', description: 'Easy-to-use platform that works for everyone, regardless of technical expertise.' },
              { icon: AiOutlineArrowRight, title: 'Connected Delivery', description: 'Seamless integration with local delivery services for reliable order fulfillment.' },
              { icon: AiOutlineShop, title: 'Trusted Marketplace', description: 'Verified sellers and secure transactions create a safe shopping environment.' },
              { icon: AiOutlineStar, title: 'Growing Businesses', description: 'Tools and insights that help local sellers grow and reach more customers.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-start gap-4 p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                  <span className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#75d04b]/10 flex items-center justify-center text-[#5ac12f]">
                    <Icon size={24} />
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust / Reliability Section */}
      <section className="home-brand-section home-brand-section--trust py-12 md:py-16 bg-[#FDF6EC] dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-12">
            <span className="inline-block px-3 py-1 mb-4 rounded-full bg-[#75d04b]/10 text-[#5ac12f] text-xs font-bold uppercase tracking-wider">
              Why Choose Aritii
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Built on Trust and Reliability
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
              We've designed every part of Aritii to create a reliable, transparent marketplace for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: AiOutlineShop, title: 'Secure Platform', description: 'Secure payments and protected transactions keep everyone safe.' },
              { icon: AiOutlineGlobal, title: 'Clear Order Flow', description: 'Transparent process from order to delivery with status updates.' },
              { icon: AiOutlineStar, title: 'Seller Visibility', description: 'Verified shops with profiles, ratings, and product catalogs.' },
              { icon: AiOutlineArrowRight, title: 'Connected Delivery', description: 'Integrated delivery network with tracking and updates.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="text-center p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                  <span className="inline-flex w-14 h-14 rounded-full bg-[#75d04b]/10 text-[#5ac12f] items-center justify-center mb-4">
                    <Icon size={28} />
                  </span>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="home-brand-section home-brand-section--community py-16 md:py-20 bg-[#FDF6EC] dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to be part of Aritii?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8 text-sm md:text-lg">
            Join thousands of buyers, sellers, and delivery providers who are already part of Ethiopia's growing local commerce platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/marketplace"
              className="px-8 py-4 bg-[#75d04b] hover:bg-[#5ac12f] text-white font-bold rounded-full text-base transition-colors flex items-center justify-center gap-2"
            >
              Shop
            </Link>
            <Link
              to="/sell-on-aritii"
              className="px-8 py-4 bg-[#2f6e4f] hover:bg-[#22462f] text-white font-bold rounded-full text-base transition-colors flex items-center justify-center gap-2"
            >
              Sell
            </Link>
            <Link
              to="/delivery"
              className="px-8 py-4 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold rounded-full text-base transition-colors flex items-center justify-center gap-2"
            >
              Deliver
            </Link>
          </div>
        </div>
      </section>
        </div>
      </div>
    </PublicLayout>
  );
};

export default HomePage;
