import React from "react";
import { Link } from "react-router-dom";

/**
 * MarketplaceBenefits Component - Why shop/sell on Aritii
 * Features:
 * - Customer benefits section
 * - Seller CTA with gradient background
 * - Modern card design
 * - Responsive layout
 */
const MarketplaceBenefits = () => {
  const benefits = [
    {
      icon: (
        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m7.5-1.75A9.75 9.75 0 1012.75 2.75A9.74 9.74 0 0121.5 12.25z" />
        </svg>
      ),
      title: "Shop from trusted sellers",
      desc: "Every product comes from a verified seller shop on Aritii Market.",
    },
    {
      icon: (
        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      title: "Discover real businesses",
      desc: "Browse a growing marketplace of local and regional shops.",
    },
    {
      icon: (
        <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      title: "One marketplace, endless options",
      desc: "Electronics, fashion, home essentials and unique local crafts.",
    },
  ];

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        {/* Benefits Section */}
        <div className="mb-12 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Why Shop on Aritii Market
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            A marketplace built for both customers and the businesses that serve them.
          </p>
        </div>

        {/* Benefits Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg p-6 md:p-8 transition-all duration-300 hover:border-green-300"
            >
              <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {benefit.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {benefit.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Seller CTA Section */}
        <div className="rounded-2xl bg-gradient-to-r from-green-600 via-green-700 to-green-800 overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="1" fill="white"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>
          </div>

          <div className="relative px-6 md:px-12 py-12 md:py-16 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm mb-6">
                <svg className="w-4 h-4 text-amber-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span className="text-sm font-semibold text-white">Start Growing Today</span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Grow your business on Aritii Market
              </h2>
              <p className="text-white/90 text-base md:text-lg mb-8 leading-relaxed">
                Create your own shop, add your products, and reach customers across the marketplace. Build your brand, manage orders, and scale your business.
              </p>

              <Link
                to="/sell"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-600 font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <span>Start Selling Today</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceBenefits;