import React from 'react';
import { Link } from 'react-router-dom';

/**
 * MarketplaceCTA - Call to action to explore the marketplace.
 *
 * Public website → Marketplace handoff. The public site never renders the full
 * catalog; it sends visitors into the marketplace discovery experience.
 */
const MarketplaceCTA = () => {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-[#75d04b] to-[#5ac12f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
            Explore the Full Marketplace
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto text-base md:text-lg">
            Browse products from verified Ethiopian sellers and shops across the platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              to="/products"
              className="px-8 py-3.5 bg-white text-[#75d04b] hover:bg-gray-100 font-semibold rounded-lg transition-colors text-base"
            >
              Browse Products
            </Link>
            <Link
              to="/shops"
              className="px-8 py-3.5 bg-[#141414] text-white hover:bg-gray-900 font-semibold rounded-lg border border-white/20 hover:border-white/40 transition-colors text-base"
            >
              Browse Shops
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export { MarketplaceCTA };
export default MarketplaceCTA;
