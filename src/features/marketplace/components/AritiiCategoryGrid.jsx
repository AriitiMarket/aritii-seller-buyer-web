import React from 'react';
import { Link } from 'react-router-dom';
import beautyIcon from '@/assets/images/categories/beauty.svg';
import electronicsIcon from '@/assets/images/categories/electronics.svg';
import fashionIcon from '@/assets/images/categories/fashion.svg';
import groceriesIcon from '@/assets/images/categories/groceries.svg';
import handcraftsIcon from '@/assets/images/categories/handcrafts.svg';
import homeLivingIcon from '@/assets/images/categories/home-living.svg';
import { useCatalogCategories } from '@/shared/hooks/useCatalogCategories';
import { categoryHref } from '@/shared/categories/categoryHref';
import CategoryIcon from '@/features/marketplace/components/CategoryIcon';

/**
 * AritiiCategoryGrid - 4-quadrant feature card grid overlapping the hero section.
 *
 * Modernized tokens:
 * - Cards: rounded-md bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:scale-[1.02]
 * - Primary accent: #75d04b
 * - Pill buttons: rounded-full
 * - Semantic portal roles: amber for seller, sky for delivery
 */
const ICON_BY_KEYWORD = [
  { keywords: ['electron', 'phone', 'tech', 'digital', 'device'], img: electronicsIcon },
  { keywords: ['fashion', 'apparel', 'wear', 'clothing', 'shoe'], img: fashionIcon },
  { keywords: ['grocer', 'food', 'agric', 'coffee', 'spice'], img: groceriesIcon },
  { keywords: ['home', 'living', 'furniture', 'house'], img: homeLivingIcon },
  { keywords: ['handcraft', 'artisan', 'craft', 'gift', 'traditional'], img: handcraftsIcon },
  { keywords: ['beauty', 'wellness', 'health', 'cosmetic', 'herbal'], img: beautyIcon },
];

const FALLBACK_CATEGORIES = [
  { label: 'Electronics', img: electronicsIcon },
  { label: 'Fashion', img: fashionIcon },
  { label: 'Home & Living', img: homeLivingIcon },
  { label: 'Beauty & Personal Care', img: beautyIcon },
  { label: 'Groceries & Food', img: groceriesIcon },
  { label: 'Handcrafts & Local Products', img: handcraftsIcon },
];

const iconFor = (label) => {
  const needle = String(label || '').toLowerCase();
  return ICON_BY_KEYWORD.find((entry) => entry.keywords.some((k) => needle.includes(k)))?.img;
};

const AritiiCategoryGrid = () => {
  const { categories } = useCatalogCategories({ type: 'product' });

  const realList = (categories || []).map((cat) => (typeof cat === 'string' ? { title: cat } : cat));
  const combined = [...realList];
  FALLBACK_CATEGORIES.forEach((fb) => {
    if (!combined.some((c) => (c.title || c.name || '').toLowerCase() === fb.label.toLowerCase())) {
      combined.push({ title: fb.label, image: fb.img });
    }
  });

  const catalogItems = combined
    .slice(0, 8)
    .map((cat) => {
      const label = cat.title || cat.name || '';
      return {
        label,
        img: cat.image || iconFor(label) || null,
        link: categoryHref(cat, '/products'),
      };
    })
    .filter((item) => item.label);

  const cards = [
    {
      id: 'popular-categories',
      title: 'Shop by Category',
      linkText: 'Explore all categories',
      linkTo: '/categories',
      items: catalogItems.slice(0, 4),
    },
    {
      id: 'local-artisans',
      title: 'Authentic Local Crafts',
      linkText: 'Discover Ethiopian artisans',
      linkTo: '/categories',
      items: catalogItems.slice(4, 8),
    },
    {
      id: 'top-deals',
      title: 'Deals & Daily Promotions',
      linkText: 'See all deals & discounts',
      linkTo: '/deals',
      isDealCard: true,
      headline: 'Up to 40% off local favorites',
      badge: 'Limited Time Deal',
      subText: 'Save big on selected community merchants this week.',
      buttonText: 'Shop Deals Now',
    },
    {
      id: 'sell-deliver',
      title: 'Sell & Deliver on Aritii',
      linkText: 'Learn about business opportunities',
      linkTo: '/seller-center',
      isRoleCard: true,
      roles: [
        {
          icon: '🏪',
          title: 'Sell on Aritii',
          desc: 'Open your digital shop with 0% startup fee.',
          btnText: 'Start Selling Today',
          link: '/seller-center',
          color: 'bg-amber-500 hover:bg-amber-600',
        },
        {
          icon: '🚚',
          title: 'Deliver with Us',
          desc: 'Flexible hours, instant payouts & local routes.',
          btnText: 'Join Delivery Fleet',
          link: '/delivery-center',
          color: 'bg-sky-500 hover:bg-sky-600',
        },
      ],
    },
  ];

  return (
    <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-24 lg:-mt-28 mb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {cards.map((card) => (
          <div
            key={card.id}
            className="flex flex-col justify-between rounded-md bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 sm:p-5 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300"
          >
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2.5">
                {card.title}
              </h2>

              {/* 4-quadrant layout for category cards */}
              {card.items && card.items.length > 0 && (
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5 mb-3">
                  {card.items.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.link}
                      className="group flex flex-col items-center bg-gray-50 dark:bg-gray-700/50 p-2 sm:p-2.5 rounded-md hover:bg-[#f3ffee] dark:hover:bg-[#75d04b]/10 transition-colors"
                    >
                      <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center p-1.5 mb-1 transition-transform group-hover:scale-105">
                        {item.img ? (
                          <img
                            src={item.img}
                            alt={item.label}
                            className="w-full h-full object-contain filter dark:invert"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.parentElement?.querySelector('.icon-fallback');
                              if (fallback) fallback.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`icon-fallback ${item.img ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}>
                          <CategoryIcon title={item.label} size={24} />
                        </div>
                      </div>
                      <span className="text-[11px] sm:text-xs font-medium text-gray-800 dark:text-gray-200 text-center line-clamp-1 group-hover:text-[#75d04b]">
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Special Deal Card layout */}
              {card.isDealCard && (
                <div className="flex flex-col mb-3">
                  <div className="rounded-md bg-[#f3ffee] dark:bg-[#75d04b]/10 border border-[#75d04b]/30 p-3 mb-2.5">
                    <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-[#75d04b] text-white mb-1.5">
                      {card.badge}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                      {card.headline}
                    </h3>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400">
                      {card.subText}
                    </p>
                  </div>
                  <Link
                    to="/deals"
                    className="w-full py-2 px-3 bg-[#75d04b] hover:brightness-95 text-white text-xs font-semibold rounded-full shadow-sm text-center transition-all"
                  >
                    {card.buttonText}
                  </Link>
                </div>
              )}

              {/* Special Role Card layout */}
              {card.isRoleCard && (
                <div className="space-y-2 mb-3">
                  {card.roles.map((role, idx) => (
                    <div
                      key={idx}
                      className="p-2 sm:p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-md border border-gray-100 dark:border-gray-700"
                    >
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-xs sm:text-sm">{role.icon}</span>
                        <p className="font-bold text-xs text-gray-900 dark:text-white">
                          {role.title}
                        </p>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                        {role.desc}
                      </p>
                      <Link
                        to={role.link}
                        className={`inline-block w-full py-1.5 px-2.5 text-center text-[11px] sm:text-xs font-semibold text-white rounded-full transition-colors shadow-xs ${role.color}`}
                      >
                        {role.btnText}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link
              to={card.linkTo}
              className="text-xs font-medium text-[#75d04b] hover:underline mt-1 inline-flex items-center"
            >
              {card.linkText} →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AritiiCategoryGrid;
