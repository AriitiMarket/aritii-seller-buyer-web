import React from "react";
import { Link } from "react-router-dom";
import { ShopImage } from "../common/ImageWithFallback";
import Ratings from "../common/Ratings";
import { PlaceholderAvatar } from "../../assets";

/**
 * Public marketplace Shop Card.
 *
 * Renders ONLY the business-facing fields of a shop. Private/internal
 * seller account data (ownerId, email, balances, transactions) is never
 * rendered here — the shop is a public business profile.
 */
const ShopCard = ({ data }) => {
  if (!data) return null;

  const name = data.name || "Aritii Shop";
  const id = data._id || data.id;
  const address = data.address || "";
  const zipCode = data.zipCode || "";
  const productCount = data.productCount || data.noOfProducts || 0;
  const rating = data.ratings || data.rating || 0;
  const ratingCount = data.ratingCount || 0;
  const description = data.description || "";

  const safeAddress = address && zipCode ? `${address}, ${zipCode}` : address;

  return (
    <div className="w-full bg-white rounded-xl border border-brand-border border-2 shadow-sm p-4 hover:shadow-md transition-shadow">
      <Link to={`/shops/${id}`} className="block">
        <div className="w-full h-[64px] flex items-center justify-center">
          <ShopImage
            data={{ avatar: { url: data.avatar?.url }, image: data.avatar?.url, image_Url: data.avatar?.url }}
            fallback={PlaceholderAvatar}
            className="w-[56px] h-[56px] rounded-full object-cover"
            alt={name}
          />
        </div>

        <h4 className="mt-2 text-brand-charcoal font-semibold text-[16px] truncate">
          {name}
        </h4>

        <div className="flex items-center mt-1">
          <Ratings rating={rating} />
          <span className="text-xs text-brand-muted ml-1">
            {ratingCount ? `(${ratingCount})` : "No reviews yet"}
          </span>
        </div>

        <div className="mt-1 text-sm text-brand-muted truncate">
          {description || (safeAddress ? safeAddress : `Shop on Aritii Market`)}
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-brand-muted font-medium">
            {productCount} {productCount === 1 ? "product" : "products"}
          </span>
          <span className="text-brand-primary text-sm font-semibold">
            Visit Shop →
          </span>
        </div>
      </Link>
    </div>
  );
};

export default ShopCard;