import React from 'react';
import { Link } from 'react-router-dom';
import { ShopImage } from '@/components/common';
import { PlaceholderAvatar } from '@/assets';
import { FiMapPin, FiGrid, FiStar } from 'react-icons/fi';
import { shopLocation, shopVerification } from '../constants';

/**
 * Seller / brand card used by the buyer's seller-selection step.
 *
 * Shows the public, brand-facing facts only (logo, name, blurb, category,
 * location, verification, rating) plus the three actions of the flow:
 * View Shop · View Profile · Request Product.
 */
const SellerCard = ({ shop, highlighted = false }) => {
  if (!shop) return null;
  const id = shop._id || shop.id;
  const name = shop.name || 'Aritii Shop';
  const description = shop.description || '';
  const category = shop.category || 'General';
  const location = shopLocation(shop);
  const verification = shopVerification(shop);
  const rating = Number(shop.ratings || shop.rating || 0);
  const ratingCount = Number(shop.ratingCount || 0);
  const productCount = Number(shop.productCount || 0);

  return (
    <article
      className={`flex flex-col bg-white rounded-2xl border overflow-hidden transition hover:shadow-lg ${
        highlighted ? 'border-brand-primary ring-2 ring-brand-primary/30' : 'border-gray-100'
      }`}
    >
      {/* Brand header */}
      <div className="relative h-20 bg-gradient-to-br from-brand-primary/15 to-brand-primary/5">
        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2">
          <ShopImage
            data={{ avatar: { url: shop.avatar?.url }, image: shop.avatar?.url }}
            fallback={PlaceholderAvatar}
            className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
            alt={`${name} logo`}
          />
        </div>
        {verification && (
          <span
            className={`absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${verification.tone}`}
          >
            &#10003; {verification.label}
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 px-4 pt-10 pb-4 text-center">
        <h3 className="font-semibold text-gray-900 truncate" title={name}>
          {name}
        </h3>

        <div className="flex items-center justify-center gap-1.5 mt-1.5 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1">
            <FiStar size={12} className="text-yellow-400 fill-current" />
            <span className="font-semibold text-gray-700">{rating ? rating.toFixed(1) : '—'}</span>
          </span>
          <span>{ratingCount ? `(${ratingCount} reviews)` : 'No reviews'}</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-[11px] font-medium">
            <FiGrid size={11} />
            {category}
          </span>
          {productCount > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-[11px] font-medium">
              {productCount} {productCount === 1 ? 'product' : 'products'}
            </span>
          )}
        </div>

        {location && (
          <p className="flex items-start justify-center gap-1 mt-2 text-xs text-gray-500">
            <FiMapPin size={12} className="mt-0.5 flex-shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </p>
        )}

        <p
          className={`mt-3 text-sm text-gray-600 line-clamp-3 ${
            description ? '' : 'text-gray-400 italic'
          }`}
        >
          {description || 'No description provided yet.'}
        </p>

        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 grid gap-2">
          <Link
            to={`/my-dashboard/requests/new/${id}`}
            className="inline-flex items-center justify-center h-10 px-4 rounded-full bg-[#75d04b] hover:bg-[#5ac12f] text-white text-sm font-bold shadow-xs transition"
          >
            Request Product
          </Link>
          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/my-dashboard/requests/sellers/${id}`}
              className="inline-flex items-center justify-center h-10 px-3 rounded-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:border-[#75d04b] hover:text-[#75d04b] transition"
            >
              View Profile
            </Link>
            <Link
              to={`/shops/${id}`}
              className="inline-flex items-center justify-center h-10 px-3 rounded-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:border-[#75d04b] hover:text-[#75d04b] transition"
            >
              View Shop
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default SellerCard;
