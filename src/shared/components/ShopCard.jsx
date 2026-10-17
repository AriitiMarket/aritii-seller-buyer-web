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
    <div className="w-full market-shop-tile">
      <Link to={shopPath} className="block h-full" aria-label={`Visit ${name} shop`}>
        {/* Shop header with logo */ }
        <div className="relative h-40 bg-market-surface-container-low overflow-hidden">
          <ShopImage
            data={{ avatar: { url: data.avatar?.url }, image: data.avatar?.url, image_Url: data.avatar?.url }}
            fallback={PlaceholderAvatar}
            className="w-full h-full object-cover"
            alt={name}
          />
          {data.avatar?.url && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2">
              <ShopImage
                data={{ avatar: { url: data.avatar?.url }, image: data.avatar?.url, image_Url: data.avatar?.url }}
                fallback={PlaceholderAvatar}
                className="w-16 h-16 rounded-full object-cover border-4 border-surface shadow-md"
                alt={name}
              />
            </div>
          )}
          {/* Verified Badge */}
          {(data.isVerified || data.verified) && (
            <div className="absolute top-2 right-2">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#20305C] text-white text-xs font-semibold rounded-full">
                ✓ Verified
              </span>
            </div>
          )}
        </div>

        {/* Shop Info */}
        <div className="p-3 pt-10 flex-1 flex flex-col">
          <h4 className="text-title-sm font-semibold text-market-on-surface line-clamp-1 text-center mb-2">
            {name}
          </h4>

          {/* Rating */}
          <div className="flex items-center justify-center mt-1 mb-2">
            <Ratings rating={rating} />
            {ratingCount !== undefined && (
              <span className="text-xs text-market-on-surface-variant ml-1.5">
                {ratingCount ? `(${ratingCount})` : "No reviews"}
              </span>
            )}
          </div>

          {/* Location */}
          {safeAddress && (
            <div className="mt-1 text-body-sm text-market-on-surface-variant text-center truncate">
              {safeAddress}
            </div>
          )}

          {/* Product Count */}
          {productCount > 0 && (
            <div className="mt-auto text-center mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-market-surface-container-low rounded-full text-xs text-market-on-surface-variant">
                <span className="font-medium">{productCount}</span>
                <span>{productCount === 1 ? "product" : "products"}</span>
              </span>
            </div>
          )}

          {/* Description */}
          {description && (
            <div className="mt-auto mb-3 text-sm text-market-on-surface-variant line-clamp-2 text-center min-h-[2.5rem]">
              {description}
            </div>
          )}

          {/* Visit Shop Button */}
          <div className="mt-auto">
            <span className="block w-full text-center py-2.5 px-4 bg-market-primary text-market-on-primary hover:bg-market-primary-hover text-sm font-semibold rounded-button transition-colors">
              Visit Shop →
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ShopCard;
