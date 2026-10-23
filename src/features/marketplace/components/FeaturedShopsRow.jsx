import React from 'react';
import { Link } from 'react-router-dom';
import { useShops } from '@/shared/hooks/useShops';
import { AiOutlineStar, AiFillStar, AiOutlineEnvironment } from 'react-icons/ai';

/**
 * FeaturedShopsRow - Clean Aritii marketplace row for local Ethiopian shops
 * Limits to top 4 verified shops from the live API with direct detail links to `/shops/:id`
 */
const FeaturedShopsRow = () => {
  const { shops = [], loading } = useShops();

  // Filter approved/active shops and limit to at most 4 top shops
  const realShops = (shops || []).filter(
    (s) => s.showOnPublic !== false && (s.status === 'APPROVED' || s.status === 'ACTIVE' || !s.status)
  );

  const displayShops = realShops.slice(0, 4).map((s, idx) => ({
    _id: s._id,
    name: s.name || 'Local Community Shop',
    description: s.description || 'Verified local marketplace merchant with fast delivery.',
    address: s.address || s.city || 'Addis Ababa',
    rating: s.ratings || 0,
    ratingsCount: s.reviewsCount || s.ratingCount || 0,
    verified: s.isVerified !== false,
    badge: idx === 0 ? 'Featured Store' : 'Verified Merchant',
    image: s.avatar?.url || s.avatar || s.logo || '/assets/images/categories/handcrafts.svg',
  }));

  if (!loading && displayShops.length === 0) {
    return null;
  }

  return (
    <section className="py-8 bg-white dark:bg-[#131921] border-b border-gray-200 dark:border-gray-800 my-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF9900]" />
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F1111] dark:text-white">
                Featured Verified Shops
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#565959] dark:text-gray-400 mt-0.5">
              Support trusted local sellers with direct storefronts and fast delivery
            </p>
          </div>
          <Link
            to="/shops"
            className="text-xs sm:text-sm font-semibold text-[#007185] dark:text-[#42a2b3] hover:text-[#C7511F] hover:underline"
          >
            Explore all shops ({shops.length || '12+'}) →
          </Link>
        </div>

        {/* 4 Clean Shop Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayShops.map((shop) => (
            <div
              key={shop._id}
              className="group flex flex-col justify-between bg-white dark:bg-[#1a222d] border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:shadow-lg transition-all duration-200"
            >
              <div>
                {/* Header: Badge & Status */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FF9900]/15 text-[#E68A00] border border-[#FF9900]/30">
                    {shop.badge}
                  </span>
                  <span className="text-[11px] font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Open Now
                  </span>
                </div>

                {/* Avatar / Store Icon */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-[#F7F7F7] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center p-2 flex-shrink-0 group-hover:scale-105 transition-transform">
                    <img
                      src={shop.image}
                      alt={shop.name}
                      className="max-h-full max-w-full object-contain filter dark:invert"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-[#0F1111] dark:text-white truncate group-hover:text-[#007185] transition-colors">
                      {shop.name}
                    </h3>
                    <p className="text-[11px] text-[#565959] dark:text-gray-400 flex items-center gap-1 mt-0.5">
                      <AiOutlineEnvironment size={12} className="text-[#FF9900] flex-shrink-0" />
                      <span className="truncate">{shop.address}</span>
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-2.5">
                  <div className="flex text-[#FFA41C] text-xs">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>
                        {i < Math.floor(shop.rating) ? <AiFillStar /> : <AiOutlineStar />}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#0F1111] dark:text-white">
                    {shop.rating}
                  </span>
                  <span className="text-[11px] text-[#565959] dark:text-gray-400">
                    ({shop.ratingsCount})
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-[#565959] dark:text-gray-400 line-clamp-2 leading-relaxed mb-4">
                  {shop.description}
                </p>
              </div>

              {/* Direct Link to Storefront Details */}
              <Link
                to={`/shops/${shop._id}`}
                className="w-full py-2 px-3 bg-[#F7F7F7] dark:bg-gray-800 hover:bg-[#FFD814] dark:hover:bg-[#FF9900] hover:text-[#111111] text-[#0F1111] dark:text-white text-xs font-bold rounded text-center border border-gray-300 dark:border-gray-700 transition-colors shadow-xs"
              >
                Visit Storefront →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedShopsRow;
