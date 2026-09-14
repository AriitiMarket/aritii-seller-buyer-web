import React from 'react';
import { Link } from 'react-router-dom';

/**
 * HeroBanner Component
 * Modern SVG UX design replacement for static hero SVG
 * Features:
 * - Green gradient background (#0A4230 primary)
 * - Golden accent badge
 * - Modern typography and spacing
 * - Responsive design
 * - Call-to-action buttons
 */
const HeroBanner = () => {
  return (
    <div className="relative w-full bg-gradient-to-br from-green-900 via-green-800 to-green-950 overflow-hidden">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      {/* Decorative grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Left content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400/20 rounded-full border border-amber-400/40 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-amber-400"></div>
              <span className="text-sm font-semibold text-amber-300">Premium Marketplace</span>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                Aritii
                <br />
                <span className="bg-gradient-to-r from-amber-300 to-amber-200 bg-clip-text text-transparent">Market</span>
              </h1>
              <p className="text-xl text-green-100 leading-relaxed max-w-2xl">
                Discover premium products from trusted sellers. Shop with confidence backed by our secure marketplace.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/products"
                className="px-8 py-3.5 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
              >
                Explore Products
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                to="/sell"
                className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-all duration-200 backdrop-blur-sm"
              >
                Start Selling
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
              <div>
                <div className="text-3xl font-bold text-amber-300">500+</div>
                <div className="text-sm text-green-200">Trusted Sellers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-300">50K+</div>
                <div className="text-sm text-green-200">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-300">10K+</div>
                <div className="text-sm text-green-200">Products</div>
              </div>
            </div>
          </div>

          {/* Right side - Visual element */}
          <div className="relative h-96 md:h-full flex items-center justify-center">
            {/* Floating product cards simulation */}
            <div className="relative w-full max-w-md aspect-square">
              
              {/* Card 1 - Electronics */}
              <div className="absolute top-0 right-0 w-48 h-40 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 hover:bg-white/20 transition-all duration-300 shadow-2xl hover:shadow-amber-400/30">
                <div className="w-full h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg mb-3 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 4a1 1 0 011-1h8a1 1 0 011 1v12a1 1 0 01-1 1H8a1 1 0 01-1-1V4z"/>
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-sm">Electronics</h3>
                <p className="text-amber-300 text-xs">Latest tech deals</p>
              </div>

              {/* Card 2 - Fashion */}
              <div className="absolute top-24 left-0 w-48 h-40 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 hover:bg-white/20 transition-all duration-300 shadow-2xl hover:shadow-pink-400/30">
                <div className="w-full h-24 bg-gradient-to-br from-pink-400 to-red-500 rounded-lg mb-3 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 5h2v3H5V5m4 0h2v3H9V5m4 0h2v3h-2V5M3 14h2v3H3v-3m4 0h2v3H7v-3m4 0h2v3h-2v-3m4 0h2v3h-2v-3M2 3h20v2H2z"/>
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-sm">Fashion</h3>
                <p className="text-amber-300 text-xs">Trending styles</p>
              </div>

              {/* Card 3 - Home */}
              <div className="absolute bottom-0 right-12 w-48 h-40 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 hover:bg-white/20 transition-all duration-300 shadow-2xl hover:shadow-yellow-400/30">
                <div className="w-full h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg mb-3 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-sm">Home & Living</h3>
                <p className="text-amber-300 text-xs">Quality products</p>
              </div>

              {/* Center glow effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/50 to-transparent rounded-full blur-3xl opacity-50"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent opacity-5"></div>
    </div>
  );
};

export default HeroBanner;
