import React from 'react';
import { Link } from 'react-router-dom';

export const BuyerPopularShops = ({ topShops = [] }) => {
  if (topShops.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Popular Shops</h2>
        <Link to="/my-dashboard/shops" className="text-sm font-semibold text-[#75d04b] hover:underline transition">
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {topShops.map((shop) => (
          <Link
            key={shop._id}
            to={`/my-dashboard/shops/${shop._id || shop.slug}`}
            className="flex items-center gap-3 p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[#75d04b]/50 hover:shadow-md transition"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#75d04b]/10 dark:bg-[#75d04b]/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {shop.avatar ? (
                <img src={shop.avatar} alt={shop.name || 'Shop'} className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm sm:text-lg font-bold text-[#75d04b]">{(shop.name || 'S').charAt(0)}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate">{shop.name || 'Shop'}</p>
              <div className="flex items-center gap-1 mt-0.5">
                {shop.ratings > 0 && (
                  <>
                    <span className="text-yellow-500 text-[10px]">★</span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{Number(shop.ratings || 0).toFixed(1)}</span>
                  </>
                )}
              </div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{shop.productCount || shop.products?.length || 0} products</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BuyerPopularShops;
