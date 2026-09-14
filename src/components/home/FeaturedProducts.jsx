import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * FeaturedProducts - Product cards with images, prices, ratings
 * Fetches first 6 products from Redux state (backend data)
 */

const FeaturedProducts = () => {
  const productsState = useSelector((state) => state.products);
  const allProducts = productsState?.allProducts || [];
  const products = allProducts?.slice(0, 6) || [];
  return (
    <section className="py-10 md:py-14 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#052919]">Featured Products</h2>
            <p className="text-sm text-gray-500 mt-1">Handpicked items from top sellers</p>
          </div>
          <Link
            to="/explore/products"
            className="text-sm font-semibold text-[#E5A93C] hover:text-[#d4922a] flex items-center gap-1 transition-colors"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {products.map((product) => (
            <Link
              to="/explore/products"
              key={product.id}
              className="group bg-white rounded-2xl border border-gray-100 hover:border-[#E5A93C]/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              {/* Image */}
              <div className="relative bg-gray-50 p-6 md:p-8 flex items-center justify-center overflow-hidden">
                {product.images && product.images[0] ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-32 md:h-40 object-cover group-hover:scale-110 transition-transform"
                  />
                ) : (
                  <span className="text-5xl md:text-6xl group-hover:scale-110 transition-transform">📦</span>
                )}
              </div>

              {/* Info */}
              <div className="p-3 md:p-4">
                <p className="text-[10px] md:text-xs text-gray-400 mb-1">{product.shop?.shopName || 'Shop'}</p>
                <p className="text-xs md:text-sm font-bold text-[#1F2937] line-clamp-2 leading-snug mb-2">{product.name}</p>
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-yellow-400 text-xs">★</span>
                  <span className="text-xs font-semibold text-[#1F2937]">{(product.rating || 0).toFixed(1)}</span>
                  <span className="text-[10px] text-gray-400">({product.reviews || 0})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm md:text-base font-extrabold text-[#052919]">ETB {product.price}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
