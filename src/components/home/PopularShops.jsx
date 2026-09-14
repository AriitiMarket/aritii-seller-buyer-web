import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * PopularShops - Shop cards with ratings and product counts
 * Fetches first 6 shops from Redux state (backend data)
 */

const PopularShops = () => {
  const shopsState = useSelector((state) => state.shops);
  const shops = shopsState?.shops || [];
  const displayShops = shops?.slice(0, 6) || [];
  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#052919]">Popular Shops</h2>
            <p className="text-sm text-gray-500 mt-1">Trusted sellers loved by our community</p>
          </div>
          <Link
            to="/explore/shops"
            className="text-sm font-semibold text-[#E5A93C] hover:text-[#d4922a] flex items-center gap-1 transition-colors"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Shop Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {displayShops.map((shop) => (
            <Link
              to={`/shop/${shop._id}`}
              key={shop._id}
              className="group bg-white rounded-2xl border border-gray-100 hover:border-[#E5A93C]/30 hover:shadow-lg p-4 md:p-5 text-center transition-all duration-300"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 mx-auto rounded-full bg-[#052919]/5 flex items-center justify-center text-2xl md:text-3xl mb-3 group-hover:scale-110 transition-transform overflow-hidden">
                {shop.shopImage ? (
                  <img src={shop.shopImage} alt={shop.shopName} className="w-full h-full object-cover" />
                ) : (
                  <span>🏪</span>
                )}
              </div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <p className="text-xs md:text-sm font-bold text-[#1F2937] truncate">{shop.shopName || shop.name}</p>
                {shop.verified && (
                  <span className="text-[#E5A93C] text-xs">✓</span>
                )}
              </div>
              <div className="flex items-center justify-center gap-1 mb-2">
                <span className="text-yellow-400 text-[10px]">★</span>
                <span className="text-[10px] md:text-xs font-semibold text-[#1F2937]">{(shop.avgRatings || 0).toFixed(1)}</span>
              </div>
              <p className="text-[10px] text-gray-400">{shop.products?.length || 0} products • {shop.followers || '0'} followers</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularShops;
