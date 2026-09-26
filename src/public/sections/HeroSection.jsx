import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineSearch, AiOutlineArrowDown } from 'react-icons/ai';
import { HeroMain, LOGO_ICON } from '@/assets';
import { useCatalogCategories } from '@/shared/hooks/useCatalogCategories';

/**
 * Hero - Marketplace-focused hero section with prominent search
 */
const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { categories } = useCatalogCategories();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  // Get first 5 categories for quick links
  const quickCategories = categories.slice(0, 5);

  const trustFeatures = [
    {
      icon: '🔒',
      title: 'Secure Payments',
      description: 'Your transactions are protected with industry-standard encryption'
    },
    {
      icon: '🚚',
      title: 'Fast Delivery',
      description: 'Get your orders delivered quickly by trusted local couriers'
    },
    {
      icon: '✓',
      title: 'Verified Sellers',
      description: 'Shop from verified and trusted local businesses'
    },
    {
      icon: '💬',
      title: '24/7 Support',
      description: 'Our team is here to help you anytime you need assistance'
    },
  ];

  return (
    <div className="relative w-full bg-gradient-to-br from-[#75d04b] to-[#5ac12f] overflow-hidden">

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* 3D Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-8 lg:px-12 py-12 sm:py-16 md:py-24">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          
          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg">
            Shop everything from
            <span className="block text-white/95">Ethiopia's local sellers</span>
          </h1>

          {/* Prominent Search Bar */}
          <form onSubmit={handleSearch} className="w-full max-w-3xl mb-6">
            <div className="relative flex items-center bg-white rounded-xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
              <input
                type="search"
                placeholder="Search for products, brands, and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-5 py-4 text-base text-gray-900 placeholder-gray-500 bg-transparent focus:outline-none rounded-l-xl"
                aria-label="Search marketplace"
              />
              <button
                type="submit"
                className="px-6 py-4 bg-[#75d04b] hover:bg-[#5ac12f] text-white font-semibold rounded-r-xl transition-colors"
                aria-label="Search"
              >
                <AiOutlineSearch size={20} />
              </button>
            </div>
          </form>

          {/* Quick Category Links */}
          {quickCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-8">
              {quickCategories.map((cat) => {
                const name = cat.title || cat;
                return (
                  <Link
                    key={cat._id || name}
                    to={`/products?category=${encodeURIComponent(name)}`}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-full transition-all hover:scale-105 backdrop-blur-sm"
                  >
                    {name}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Trust Features - 3D Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mb-8">
            {trustFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="text-3xl mb-2 transform hover:rotate-12 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-white font-semibold text-sm mb-1">{feature.title}</h3>
                <p className="text-white/80 text-xs leading-tight">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-white/80 text-sm">Scroll to explore</span>
            <AiOutlineArrowDown className="text-white/80" size={20} />
          </div>
        </div>
      </div>

      {/* Wave SVG */}
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none">
        <path d="M0,60 C480,20 960,100 1440,60 L1440,120 L0,120 Z" className="fill-white dark:fill-gray-900" />
      </svg>
    </div>
  );
};

export { HeroSection };
export default HeroSection;
