import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Categories - Horizontal scrollable category cards
 * Fetches categories from Redux state (backend data)
 */

const Categories = () => {
  const shopsState = useSelector((state) => state.shops);
  const categories = shopsState?.categories || [];
  const displayCategories = categories?.slice(0, 8) || [];
  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#052919]">Browse Categories</h2>
            <p className="text-sm text-gray-500 mt-1">Find what you love from local sellers</p>
          </div>
          <Link
            to="/explore/categories"
            className="text-sm font-semibold text-[#E5A93C] hover:text-[#d4922a] flex items-center gap-1 transition-colors"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Scrollable Cards */}
        <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {displayCategories.map((cat) => (
            <Link
              to={`/explore/categories`}
              key={cat._id || cat.name}
              className="flex-shrink-0 w-28 md:w-32 lg:w-36 group"
            >
              <div className="bg-gray-50 rounded-2xl p-4 md:p-5 text-center border border-gray-100 hover:border-[#E5A93C]/30 hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className="text-3xl md:text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {cat.categoryImage ? (
                    <img src={cat.categoryImage} alt={cat.name} className="w-12 h-12 mx-auto object-cover rounded" />
                  ) : (
                    '📂'
                  )}
                </div>
                <p className="text-xs md:text-sm font-bold text-[#1F2937] truncate">{cat.name}</p>
                <p className="text-[10px] md:text-xs text-gray-400 mt-0.5">{cat.productCount || 0}+ items</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
