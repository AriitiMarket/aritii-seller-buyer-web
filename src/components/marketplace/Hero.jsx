import React from "react";
import { Link } from "react-router-dom";

/**
 * Hero Component - Premium Platform Banner
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Aritii Market SVG UX Conversion
 * 
 * Design Features:
 * - Deep dark background (#052919)
 * - Gold accents (#E5A93C)
 * - Glassmorphism effects
 * - NO PRODUCTS - Platform showcase only
 * - Responsive layout
 * - Smooth animations
 */
const Hero = () => {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Main Hero Section - Dark Theme */}
      <div className="relative w-full bg-gradient-to-br from-[#052919] via-[#0a3a2a] to-[#052919] overflow-hidden min-h-[600px] md:min-h-[700px] lg:min-h-[750px]">
        {/* Decorative animated blobs for depth */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#E5A93C]/5 rounded-full blur-3xl opacity-40 animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-32 right-20 w-80 h-80 bg-[#E5A93C]/3 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#0a3a2a]/50 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

        {/* Grid pattern overlay for texture */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
          backgroundImage: "linear-gradient(0deg, transparent 24%, rgba(229, 169, 60, 0.1) 25%, rgba(229, 169, 60, 0.1) 26%, transparent 27%, transparent 74%, rgba(229, 169, 60, 0.1) 75%, rgba(229, 169, 60, 0.1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(229, 169, 60, 0.1) 25%, rgba(229, 169, 60, 0.1) 26%, transparent 27%, transparent 74%, rgba(229, 169, 60, 0.1) 75%, rgba(229, 169, 60, 0.1) 76%, transparent 77%, transparent)",
          backgroundSize: "50px 50px"
        }}></div>

        {/* Content Container */}
        <div className="relative z-10 w-full h-full flex flex-col justify-center">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-16 lg:py-20 w-full">
            
            {/* Navigation Pill with Blur Effect */}
            <div className="flex justify-center mb-8 md:mb-12">
              <div className="backdrop-blur-md bg-[#083B24]/40 border border-[#E5A93C]/30 rounded-full px-6 py-3 inline-flex items-center gap-2 hover:border-[#E5A93C]/50 transition-all">
                <div className="w-2.5 h-2.5 rounded-full bg-[#E5A93C] animate-pulse"></div>
                <span className="text-xs md:text-sm font-semibold text-[#E5A93C] tracking-wider">
                  🚀 Aritii Market - Ethiopia's Commerce Hub
                </span>
              </div>
            </div>

            {/* Main Headline & Description */}
            <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                <span className="block">The Complete</span>
                <span className="block">Commerce Ecosystem for</span>
                <span className="bg-gradient-to-r from-[#E5A93C] via-[#f0b856] to-[#E5A93C] bg-clip-text text-transparent">
                  Riders, Sellers & Buyers
                </span>
              </h1>
              <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                One unified platform connecting logistics providers, product sellers, and conscious buyers. Fast delivery, verified trust, and zero middleman markups.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 md:mb-20">
              <Link
                to="/explore/products"
                className="group px-8 py-4 bg-[#E5A93C] hover:bg-[#f0b856] text-[#052919] font-bold text-base md:text-lg rounded-lg transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-[#E5A93C]/40 hover:scale-105 flex items-center justify-center gap-3 w-full sm:w-auto"
              >
                <span>📦 Browse Products</span>
                <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>

              <Link
                to="/explore/shops"
                className="group px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-base md:text-lg rounded-lg border border-white/30 transition-all duration-300 backdrop-blur-sm hover:border-[#E5A93C]/50 flex items-center justify-center gap-3 w-full sm:w-auto"
              >
                <span>🏪 Browse Shops</span>
                <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 justify-center">
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-300">
                <span className="text-lg">🔒</span>
                <span className="font-medium">CBE Escrow Protected</span>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-300">
                <span className="text-lg">⚡</span>
                <span className="font-medium">24-48hr Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-300">
                <span className="text-lg">✓</span>
                <span className="font-medium">Verified Community</span>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom fade gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#052919] via-[#052919]/50 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

export default Hero;
