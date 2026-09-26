import React, { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ShopCard from '@/shared/components/ShopCard';
import CategorySidebar from '@/public/components/CategorySidebar';
import CategorySheet from '@/public/components/CategorySheet';
import Breadcrumb from '@/public/components/Breadcrumb';
import SectionHeader from '@/public/components/SectionHeader';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import Button from '@/components/common/Button';
import { useShops, filterShops } from '@/shared/hooks/useShops';
import { useAuth } from '@/auth/hooks/useAuth';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'rating', label: 'Rating (Highest)' },
  { value: 'products', label: 'Most Products' },
  { value: 'newest', label: 'Newest' },
  { value: 'name', label: 'Name: A to Z' },
];

/**
 * Shops list (canonical route: /shops).
 *
 * Shows business-facing shop information only. Seller account data (email,
 * balance, settings) is never part of a shop card.
 *
 * Categories here are SHOP categories (`type: 'business'` — Retail, Food &
 * Beverage, …), never the product categories the /products sidebar shows.
 */
const ShopsPage = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const [sortBy, setSortBy] = useState('featured');

  const { isAuthenticated } = useAuth();
  const { shops, loading, error, refresh } = useShops();
  const filtered = filterShops(shops, { search, category });

  // Live per-category counts for the sidebar and the mobile rail.
  const counts = useMemo(() => {
    const map = {};
    (shops || []).forEach((s) => {
      const key = String(s.category || '').trim();
      if (key) map[key] = (map[key] || 0) + 1;
    });
    return map;
  }, [shops]);

  const data = useMemo(() => {
    const list = [...filtered];
    switch (sortBy) {
      case 'rating':
        list.sort((a, b) => (b.ratings || 0) - (a.ratings || 0));
        break;
      case 'products':
        list.sort((a, b) => (b.productCount || 0) - (a.productCount || 0));
        break;
      case 'newest':
        list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'name':
        list.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
        break;
      default:
        break;
    }
    return list;
  }, [filtered, sortBy]);

  const heading = search ? `Search: "${search}"` : category || 'All Shops';

  const breadcrumbItems = [
    { label: 'Home', to: '/' },
    { label: 'Shops', to: '/shops' },
  ];
  if (category) {
    breadcrumbItems.push({ label: category });
  } else if (search) {
    breadcrumbItems.push({ label: `Search: "${search}"` });
  }

  return (
    <>
      {/* <1024px — the sidebar is desktop-only, so small screens get the sheet */}
      <CategorySheet
        basePath="/shops"
        type="business"
        title="Business Type"
        allLabel="All Shops"
        counts={counts}
        className="mb-4"
      />

      <div className="flex gap-6 lg:gap-8">
        {/* Far-left SHOP-category sidebar (collapsible icon rail) */}
        <CategorySidebar
          basePath="/shops"
          type="business"
          title="Shop by Business Type"
          allLabel="All Shops"
          counts={counts}
        />

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <Breadcrumb items={breadcrumbItems} />

          <SectionHeader
            title={heading}
            description={!loading && !error ? `${data.length} shop${data.length === 1 ? '' : 's'} found` : undefined}
          />

          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort shops"
                className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#75d04b]"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <Button
              onClick={refresh}
              disabled={loading}
              className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 text-sm flex-shrink-0"
            >
              Refresh
            </Button>
          </div>

          {loading ? (
            <Loading variant="inline" label="Loading shops…" />
          ) : error ? (
            <EmptyState
              title="Could not load shops"
              description={error}
              action={
                <Button onClick={refresh} className="bg-brand-primary text-white">
                  Try again
                </Button>
              }
            />
          ) : data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {data.map((shop, index) => (
                <ShopCard data={shop} key={shop._id || index} variant={isAuthenticated ? 'default' : 'public'} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={
                category
                  ? `No shops in ${category} yet`
                  : search
                    ? 'No shops match your search'
                    : 'No shops available yet'
              }
              description={
                category
                  ? 'No shop has chosen this business type yet — pick another one to keep browsing.'
                  : search
                    ? 'Try different keywords or browse all shops.'
                    : 'Be the first to sell on Aritii Market.'
              }
              action={
                search || category ? (
                  <Link
                    to="/shops"
                    className="inline-block px-5 py-2.5 bg-brand-primary text-white rounded-lg font-semibold hover:opacity-90 transition"
                  >
                    Browse all shops
                  </Link>
                ) : null
              }
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ShopsPage;
