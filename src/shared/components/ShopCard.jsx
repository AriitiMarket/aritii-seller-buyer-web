import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShopImage } from "@/components/common/ImageWithFallback";
import Ratings from "@/components/common/Ratings";
import { PlaceholderAvatar } from "@/assets";
import { AiOutlineHeart, AiOutlinePlus } from "react-icons/ai";

/**
 * Aritii Enhanced Shop Card.
 *
 * Features:
 * - Banner image (16:9 aspect ratio)
 * - Shop name with seller badge (Verified/Trusted)
 * - Rating with stars + count
 * - Product count
 * - Location/delivery zones
 * - Large green visit shop button (#75d04b)
 * - Action buttons: Follow, Compare
 * - Trust indicators (reviews, sales)
 * - Responsive grid: 1 col mobile → 2 col tablet → 3 col desktop
 */
const ShopCard = ({ data, variant = 'default', basePath = '' }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isComparing, setIsComparing] = useState(false);

  if (!data) return null;

  const isPublic = variant === 'public';

  const name = data.name || "Aritii Shop";
  const id = data._id || data.id;
  const address = data.address || "";
  const zipCode = data.zipCode || "";
  const city = data.city || data.cityName || "";
  const zone = data.zone || data.zoneName || "";

  const rawProductCount = data.productCount ?? data.noOfProducts;
  const productCount = rawProductCount ?? 0;

  const rating = data.ratings || data.rating || 0;
  const rawRatingCount = data.ratingCount;
  const ratingCount = rawRatingCount ?? 0;

  const isVerified = data.isVerified || data.verified || false;
  const isTrusted = data.isTrusted || data.trusted || false;
  const totalSales = data.totalSales || data.salesCount || 0;

  const shopPath = basePath ? `${basePath}/shops/${id}` : `/shops/${id}`;

  // Build location display
  const locationParts = [];
  if (city) locationParts.push(city);
  if (zone) locationParts.push(zone);
  if (address && !city && !zone) locationParts.push(address);
  const locationDisplay = locationParts.join(", ") || "Ethiopia";

  // Format rating display
  const ratingDisplay = rating ? `${rating}★ (${ratingCount} ${ratingCount === 1 ? 'review' : 'reviews'})` : 'No ratings';

  return (
    <article className="aritii-shop-card h-full flex flex-col bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Banner Image: 16:9 aspect ratio */}
      <Link to={shopPath} className="block relative bg-gray-100 dark:bg-gray-800 overflow-hidden" aria-label={`Visit ${name} shop`}>
        <div className="relative w-full aspect-video">
          <ShopImage
            data={{ 
              avatar: { url: data.avatar?.url }, 
              image: data.avatar?.url, 
              image_Url: data.avatar?.url 
            }}
            fallback={PlaceholderAvatar}
            className="w-full h-full object-cover"
            alt={name}
          />
          
          {/* Overlay gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          {/* Seller Badge - Top Right */}
          {(isVerified || isTrusted) && (
            <div className="absolute top-2 right-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#75d04b] text-white text-xs font-semibold rounded-full shadow-md">
                ✓ {isVerified ? 'Verified' : 'Trusted'}
              </span>
            </div>
          )}

          {/* Trust Badge - Top Left */}
          {totalSales > 0 && (
            <div className="absolute top-2 left-2">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-900/80 text-white text-xs font-medium rounded-full">
                ⭐ {totalSales} sales
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-4">
        {/* Shop Name + Badge */}
        <div className="mb-2">
          <Link to={shopPath} className="block">
            <h3 className="font-bold text-[#131921] dark:text-white text-base sm:text-lg line-clamp-2 hover:text-[#75d04b] transition-colors">
              {name}
            </h3>
          </Link>
        </div>

        {/* Seller Badge (Secondary - if not shown on banner) */}
        {!isVerified && !isTrusted && totalSales === 0 && (
          <div className="mb-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">
              New Seller
            </span>
          </div>
        )}

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1.5 mb-3">
            <Ratings rating={rating} size="sm" />
            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{ratingDisplay}</span>
          </div>
        )}

        {/* Location */}
        <div className="mb-3">
          <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
            <span>📍</span>
            <span className="line-clamp-1">{locationDisplay}</span>
          </p>
        </div>

        {/* Product Count */}
        {productCount > 0 && (
          <div className="mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-full text-xs text-blue-700 dark:text-blue-300 font-medium">
              <span>📦</span>
              <span>{productCount} {productCount === 1 ? "product" : "products"}</span>
            </span>
          </div>
        )}

        {/* Spacer for flex layout */}
        <div className="flex-1" />

        {/* Visit Shop Button - Large, Green (#75d04b) with 44px min height */}
        <Link
          to={shopPath}
          className="w-full px-4 py-3 mb-3 bg-[#75d04b] hover:bg-[#5ac12f] text-white font-bold rounded-lg text-center transition-colors duration-200 transform hover:scale-105 active:scale-95 min-h-[44px] flex items-center justify-center"
        >
          Visit Shop
        </Link>

        {/* Action Buttons - 44px minimum height */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsFollowing(!isFollowing)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors duration-200 min-h-[44px] ${
              isFollowing
                ? 'bg-[#75d04b] text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            title={isFollowing ? 'Following' : 'Follow this shop'}
          >
            <AiOutlineHeart size={18} />
            <span className="hidden sm:inline">Follow</span>
          </button>
          <button
            type="button"
            onClick={() => setIsComparing(!isComparing)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors duration-200 min-h-[44px] ${
              isComparing
                ? 'bg-[#75d04b] text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            title={isComparing ? 'Comparing' : 'Compare with other shops'}
          >
            <AiOutlinePlus size={18} />
            <span className="hidden sm:inline">Compare</span>
          </button>
        </div>

        {/* Trust Indicators */}
        {(ratingCount > 0 || totalSales > 0) && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            {ratingCount > 0 && <span>✓ {ratingCount} verified reviews</span>}
            {totalSales > 0 && ratingCount > 0 && <span>•</span>}
            {totalSales > 0 && <span>✓ {totalSales} successful sales</span>}
          </div>
        )}
      </div>
    </article>
  );
};

export default ShopCard;
