import React from 'react';
import { Link } from 'react-router-dom';

/**
 * SellerCTA - Call to action for sellers
 */

const BusinessCTA = () => {
  return (
    <section className="py-12 md:py-16 bg-[#141414]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Left Content */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
              Grow Your Business with
              <span className="block text-[#75d04b] mt-1">Ariiti Market</span>
            </h2>
            <p className="mt-4 text-sm md:text-base text-white/70 max-w-lg leading-relaxed">
              Join Ethiopian sellers reaching customers nationwide. List your products and start selling today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center md:justify-start">
              <Link
                to="/become-a-seller"
                className="group px-8 py-3.5 bg-[#75d04b] hover:bg-[#5ac12f] text-white rounded-full font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>Start Selling</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                to="/about"
                className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-base rounded-full border border-white/20 hover:border-white/50 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1 flex justify-center">
            <div className="text-8xl md:text-9xl">🏪</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { BusinessCTA };
export default BusinessCTA;
