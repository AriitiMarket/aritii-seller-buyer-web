import React from "react";
import { Link } from "react-router-dom";
import { ShopImage } from "@/components/common/ImageWithFallback";
import Ratings from "@/components/common/Ratings";
import { PlaceholderAvatar } from "@/assets";

/**
 * Public marketplace Shop Card.
 *
 * Renders ONLY the business-facing fields of a shop. Private/internal
 * seller account data (ownerId, email, balances, transactions) is never
 * rendered here — the shop is a public business profile.
 */
const ShopCard = ({ data, variant = 'default', basePath = '' }) => {
  if (!data) return null;

  const isPublic = variant === 'public';
  
  const name = data.name || "Aritii Shop";
  const id = data._id || data.id;
  const address = data.address || "";
  const zipCode = data.zipCode || "";
  
  const rawProductCount = data.productCount ?? data.noOfProducts;
  const productCount = rawProductCount ?? 0;
  
  const rating = data.ratings || data.rating || 0;
  const rawRatingCount = data.ratingCount;
  const ratingCount = rawRatingCount ?? 0;
  
  const description = data.description || "";

  const safeAddress = address && zipCode ? `${address}, ${zipCode}` : address;

  const shopPath = basePath ? `${basePath}/shops/${id}` : `/shops/${id}`;

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <Link to={shopPath} className="block h-full" aria-label={`Visit ${name} shop`}>
        {/* Shop Header with Image */}
        <div className="relative h-24 bg-gradient-to-br from-[#75d04b]/10 to-[#5ac12f]/10 flex items-center justify-center">
          <div className="absolute top-4 left-1/2 -translate-x-1/2">
            <ShopImage
              data={{ avatar: { url: data.avatar?.url }, image: data.avatar?.url, image_Url: data.avatar?.url }}
              fallback={PlaceholderAvatar}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white shadow-md"
              alt={name}
            />
          </div>
          {/* Verified Badge */}
          {data.isVerified || data.verified && (
            <div className="absolute top-2 right-2">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#75d04b] text-white text-xs font-semibold rounded-full">
                ✓ Verified
              </span>
            </div>
          )}
        </div>

        {/* Shop Info */}
        <div className="p-4 pt-12">
          <h4 className="text-gray-900 dark:text-white font-semibold text-base sm:text-lg truncate text-center">
            {name}
          </h4>

          {/* Rating */}
          <div className="flex items-center justify-center mt-2">
            <Ratings rating={rating} />
            {ratingCount !== undefined && (
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1.5">
                {ratingCount ? `(${ratingCount})` : "No reviews"}
              </span>
            )}
          </div>

          {/* Location */}
          {safeAddress && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center truncate">
              {safeAddress}
            </div>
          )}

          {/* Product Count */}
          {productCount > 0 && (
            <div className="mt-3 text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-300">
                <span className="font-medium">{productCount}</span>
                <span>{productCount === 1 ? "product" : "products"}</span>
              </span>
            </div>
          )}

          {/* Description */}
          {description && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2 text-center min-h-[2.5rem]">
              {description}
            </div>
          )}

          {/* Visit Shop Button */}
          <div className="mt-4">
            <span className="block w-full text-center py-2.5 px-4 bg-[#75d04b] hover:bg-[#5ac12f] text-white text-sm font-semibold rounded-lg transition-colors">
              Visit Shop →
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ShopCard;