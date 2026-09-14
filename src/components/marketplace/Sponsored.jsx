import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ShopImage } from '../common/ImageWithFallback';
import { PlaceholderShop } from '../../assets';
import { AiFillStar } from 'react-icons/ai';

/**
 * Sponsored Component - Featured sellers showcase
 * Features:
 * - Shop cards with cover images and avatars
 * - Shop ratings and product counts
 * - Responsive grid layout
 * - Visit shop buttons
 */
const Sponsored = () => {
  const { shops, isLoading, error } = useSelector((state) => state.shop);

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                Featured Sellers
              </h2>
            </div>
            <p className="text-gray-600 text-sm md:text-base mt-2">
              Trusted local businesses, ready to serve you
            </p>
          </div>
        </div>

        {/* Shops Grid */}
        {isLoading && shops.length === 0 ? (
          <div className="grid grid-cols-1 gap-4 md:gap-5 lg:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 animate-pulse">
                <div className="w-full h-24 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : shops && shops.length !== 0 ? (
          <div className="grid grid-cols-1 gap-4 md:gap-5 lg:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {shops.map((shop) => (
              <Link
                key={shop._id}
                to={`/shops/${shop._id}`}
                className="group block rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden hover:border-green-300"
              >
                {/* Cover Image */}
                <div className="relative w-full h-28 bg-gradient-to-b from-gray-100 to-gray-50 overflow-hidden">
                  <ShopImage
                    data={shop}
                    alt={shop.name}
                    fallback={PlaceholderShop}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Shop Avatar - Positioned over cover */}
                <div className="relative px-5 -mt-7 mb-4">
                  <div className="w-16 h-16 rounded-full border-4 border-white shadow-md bg-white overflow-hidden group-hover:shadow-lg transition-shadow">
                    <ShopImage
                      data={shop}
                      alt={shop.name}
                      fallback={PlaceholderShop}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Shop Info */}
                <div className="px-5 pb-4">
                  {/* Name */}
                  <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-1">
                    {shop.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {shop.description || shop.address || "Local seller on Aritii Market"}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-600">
                    <span className="flex items-center gap-1 font-semibold">
                      <AiFillStar className="text-amber-400" size={14} />
                      {shop.ratings ? Number(shop.ratings).toFixed(1) : "0.0"}
                    </span>
                    <span className="text-gray-500">
                      {shop.productCount != null ? shop.productCount : 0} products
                    </span>
                  </div>

                  {/* Visit Button */}
                  <button className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-xs font-semibold rounded-lg transition-all duration-300 hover:shadow-md transform group-hover:scale-105">
                    Visit Shop
                  </button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-gray-500 text-lg font-medium">No sellers available yet</p>
              <p className="text-gray-400 text-sm mt-1">
                {error ? "Unable to load sellers right now." : "Check back soon for featured sellers"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sponsored;