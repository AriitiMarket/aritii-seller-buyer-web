import React from 'react';
import { Link } from 'react-router-dom';
import beautyIcon from '@/assets/images/categories/beauty.svg';
import electronicsIcon from '@/assets/images/categories/electronics.svg';
import fashionIcon from '@/assets/images/categories/fashion.svg';
import groceriesIcon from '@/assets/images/categories/groceries.svg';
import handcraftsIcon from '@/assets/images/categories/handcrafts.svg';
import homeLivingIcon from '@/assets/images/categories/home-living.svg';
import placeholderIcon from '@/assets/images/placeholders/product-placeholder.svg';
import { useCatalogCategories } from '@/shared/hooks/useCatalogCategories';
import { categoryHref } from '@/shared/categories/categoryHref';

/**
 * AmazonCategoryGrid - Amazon-style 4-quadrant feature card grid
 * Placed overlapping the hero section just like on Amazon.com
 *
 * Category tiles link to the real catalog filter (`/products?category=…`)
 * through `categoryHref`, so they never point at a non-existent route.
 */
const ICON_BY_KEYWORD = [
  { keywords: ['electron', 'phone', 'tech', 'digital'], img: electronicsIcon },
  { keywords: ['fashion', 'apparel', 'wear', 'clothing', 'shoe'], img: fashionIcon },
  { keywords: ['grocer', 'food', 'agric', 'coffee', 'spice'], img: groceriesIcon },
  { keywords: ['home', 'living', 'furniture', 'house'], img: homeLivingIcon },
  { keywords: ['handcraft', 'artisan', 'craft', 'gift', 'traditional'], img: handcraftsIcon },
  { keywords: ['beauty', 'wellness', 'health', 'cosmetic', 'herbal'], img: beautyIcon },
];

const FALLBACK_CATEGORIES = [
  { label: 'Electronics', img: electronicsIcon },
  { label: 'Fashion', img: fashionIcon },
  { label: 'Groceries', img: groceriesIcon },
  { label: 'Home Living', img: homeLivingIcon },
  { label: 'Handcrafts', img: handcraftsIcon },
  { label: 'Beauty & Wellness', img: beautyIcon },
];

const iconFor = (label) => {
  const needle = String(label || '').toLowerCase();
  return ICON_BY_KEYWORD.find((entry) => entry.keywords.some((k) => needle.includes(k)))?.img;
};

const AmazonCategoryGrid = () => {
  const { categories } = useCatalogCategories({ type: 'product' });

  // Real catalog categories when the API answers, marketing labels otherwise.
  const catalogItems = (categories?.length ? categories : FALLBACK_CATEGORIES)
    .slice(0, 8)
    .map((cat) => {
      const label = typeof cat === 'string' ? cat : cat.title || cat.name || '';
      return {
        label,
        img: (typeof cat === 'string' ? null : cat.image) || iconFor(label) || placeholderIcon,
        link: categoryHref(typeof cat === 'string' ? cat : cat, '/products'),
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
          title: 'Sell on Aritii',
          desc: 'Open your digital shop with 0% startup fee.',
          btnText: 'Start Selling',
          link: '/seller-center',
          color: 'bg-[#FF9900] hover:bg-[#E68A00]',
        },
        {
          title: 'Deliver with Us',
          desc: 'Flexible hours, instant payouts & local routes.',
          btnText: 'Earn as Driver',
          link: '/delivery-center',
          color: 'bg-[#00A8E1] hover:bg-[#0087B8]',
        },
      ],
    },
  ];

  return (
    <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 md:-mt-28 mb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            className="flex flex-col justify-between bg-white dark:bg-[#1a222d] border border-gray-200 dark:border-gray-800 rounded-lg p-5 shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <div>
              <h2 className="text-xl font-bold text-[#0F1111] dark:text-white mb-3">
                {card.title}
              </h2>

              {/* 4-quadrant layout for category cards */}
              {card.items && card.items.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {card.items.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.link}
                      className="group flex flex-col items-center bg-[#F7F7F7] dark:bg-gray-800/80 p-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center p-2 mb-1.5 transition-transform group-hover:scale-105">
                        <img
                          src={item.img}
                          alt={item.label}
                          className="w-full h-full object-contain filter dark:invert"
                          loading="lazy"
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-800 dark:text-gray-200 text-center line-clamp-1">
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Special Deal Card layout */}
              {card.isDealCard && (
                <div className="flex flex-col mb-4">
                  <div className="rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 p-4 mb-3">
                    <span className="inline-block px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded bg-red-600 text-white mb-2">
                      {card.badge}
                    </span>
                    <h3 className="text-base font-bold text-[#0F1111] dark:text-white mb-1">
                      {card.headline}
                    </h3>
                    <p className="text-xs text-[#565959] dark:text-gray-400">
                      {card.subText}
                    </p>
                  </div>
                  <Link
                    to="/deals"
                    className="w-full py-2.5 px-4 bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] text-xs font-bold rounded-md shadow-sm text-center transition-colors"
                  >
                    {card.buttonText}
                  </Link>
                </div>
              )}

              {/* Special Role Card layout */}
              {card.isRoleCard && (
                <div className="space-y-3 mb-4">
                  {card.roles.map((role, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#F7F7F7] dark:bg-gray-800/60 rounded-md border border-gray-100 dark:border-gray-800"
                    >
                      <p className="font-bold text-xs text-[#0F1111] dark:text-white">
                        {role.title}
                      </p>
                      <p className="text-[11px] text-[#565959] dark:text-gray-400 mb-2">
                        {role.desc}
                      </p>
                      <Link
                        to={role.link}
                        className={`inline-block w-full py-1.5 px-3 text-center text-xs font-bold text-white rounded transition-colors ${role.color}`}
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
              className="text-xs font-medium text-[#007185] dark:text-[#42a2b3] hover:text-[#C7511F] dark:hover:text-[#FF9900] hover:underline mt-2 inline-flex items-center"
            >
              {card.linkText} →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AmazonCategoryGrid;
