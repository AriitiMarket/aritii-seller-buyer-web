import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineStar, AiFillStar } from 'react-icons/ai';
import { useProducts } from '@/shared/hooks/useProducts';
import { ProductImage } from '@/components/common/ImageWithFallback';

/**
 * TrendingProducts - Highlights top 5 items for the public landing page.
 * Displays real products from the catalog (limited to top 5).
 * All items link directly to their marketplace product page (/product/:id).
 */
export const TrendingProducts = () => {
  const { products = [], loading } = useProducts();

  // Strictly limit to 5 real products so page remains crisp and clean
  const displayList = (products || []).slice(0, 5).map((p, i) => ({
    _id: p._id,
    name: p.name || 'Featured Product',
    price: p.discountPrice || p.price || 0,
    originalPrice: p.originalPrice || (p.discountPrice && p.price ? p.price : null),
    rating: p.ratings || 0,
    reviewsCount: p.numOfReviews || 0,
    badge: i === 0 ? 'Best Seller' : i === 1 ? 'Top Rated' : 'Popular',
    delivery: 'Local Delivery',
    // The raw product is kept so the image goes through the shared
    // resolver — a stored "/uploads/…" reference must be joined onto the
    // gateway origin, not the storefront origin.
    product: p,
  }));

  if (!loading && displayList.length === 0) {
    return null;
  }

  return (
    <section className="py-8 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#75d04b]" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Featured Products & Deals
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Handpicked selections from verified local merchants with direct details
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-semibold text-[#75d04b] hover:underline"
          >
            Shop all products →
          </Link>
        </div>

        {/* 5-item grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {displayList.map((item) => {
            const discountPct = item.originalPrice && item.originalPrice > item.price
              ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
              : null;

            return (
              <div
                key={item._id}
                className="group flex flex-col justify-between bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-md p-3.5 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300"
              >
                <div>
                  {/* Badge & Discount */}
                  <div className="flex items-center justify-between mb-2">
                    {item.badge && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-white">
                        {item.badge}
                      </span>
                    )}
                    {discountPct && (
                      <span className="text-[11px] font-extrabold text-red-600 dark:text-red-400 ml-auto">
                        -{discountPct}%
                      </span>
                    )}
                  </div>

                  {/* Image container */}
                  <Link
                    to={`/product/${item._id}`}
                    className="w-full h-36 sm:h-44 flex items-center justify-center p-3 mb-3 bg-gray-50 dark:bg-gray-700/50 rounded-md overflow-hidden group-hover:opacity-95 transition-opacity"
                  >
                    <ProductImage
                      data={item.product}
                      alt={item.name}
                      objectFit="contain"
                      className="max-h-full max-w-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Title */}
                  <Link
                    to={`/product/${item._id}`}
                    className="block text-xs sm:text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 hover:text-[#75d04b] transition-colors mb-1.5"
                    title={item.name}
                  >
                    {item.name}
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex text-amber-400 text-xs">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>
                          {i < Math.floor(item.rating) ? <AiFillStar /> : <AiOutlineStar />}
                        </span>
                      ))}
                    </div>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">
                      ({item.reviewsCount})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                      {Number(item.price).toLocaleString()} <span className="text-xs font-normal">ETB</span>
                    </span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-xs text-gray-400 line-through">
                        {Number(item.originalPrice).toLocaleString()} ETB
                      </span>
                    )}
                  </div>

                  {/* Fast Delivery Badge */}
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-3">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {item.delivery}
                    </span>
                  </p>
                </div>

                {/* View Details CTA Button */}
                <Link
                  to={`/product/${item._id}`}
                  className="w-full py-2 px-3 bg-[#75d04b] hover:brightness-95 text-white text-xs font-semibold rounded-full text-center shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <span>View Details</span>
                  <span className="text-xs">→</span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;
