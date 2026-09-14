import React from 'react';
import { Link } from 'react-router-dom';

/**
 * SellerCTA - Call to action for sellers
 */

const SellerCTA = () => {
  return (
    <section className="py-10 md:py-14 bg-[#052919]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Left Content */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
              Grow Your Business with
              <span className="block text-[#E5A93C] mt-1">Ariiti Market</span>
            </h2>
            <p className="mt-4 text-sm md:text-base text-white/70 max-w-lg leading-relaxed">
              Join thousands of Ethiopian sellers reaching customers nationwide. Zero commission, free listings, and powerful seller tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center md:justify-start">
              <Link
                to="/sell"
                className="group px-8 py-3.5 bg-[#E5A93C] hover:bg-[#f0b856] text-[#052919] font-bold text-base rounded-xl transition-all duration-300 shadow-lg shadow-[#E5A93C]/20 hover:shadow-xl hover:shadow-[#E5A93C]/40 flex items-center justify-center gap-2"
              >
                <span>Start Selling</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                to="/about"
                className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-base rounded-xl border border-white/20 hover:border-[#E5A93C]/50 transition-all duration-300 flex items-center justify-center"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Stats */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 flex-shrink-0">
            {[
              { value: '10K+', label: 'Active Sellers' },
              { value: '50K+', label: 'Products Listed' },
              { value: '100K+', label: 'Happy Customers' },
              { value: '0%', label: 'Commission Fee' },
            ].map((stat, index) => (
              <div key={index} className="text-center p-4 md:p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-xl md:text-2xl font-extrabold text-[#E5A93C]">{stat.value}</div>
                <div className="text-[10px] md:text-xs text-white/60 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellerCTA;
