import React, { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ShopCard from '@/shared/components/ShopCard';
import CategorySidebar from '@/features/marketplace/components/CategorySidebar';
import CatalogPageLayout from '@/features/marketplace/components/CatalogPageLayout';
import Breadcrumbs from '@/shared/components/Breadcrumbs';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import Button from '@/components/common/Button';
import { useShops, filterShops } from '@/shared/hooks/useShops';
import { useAuth } from '@/features/marketplace/hooks/useAuth';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'rating', label: 'Rating (Highest)' },
  { value: 'products', label: 'Most Products' },
  { value: 'newest', label: 'Newest' },
  { value: 'name', label: 'Name: A to Z' },
];

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
    { label: 'Shops' },
  ];
  if (category) {
    breadcrumbItems.push({ label: category });
  } else if (search) {
    breadcrumbItems.push({ label: `Search: "${search}"` });
  }

  const mainContent = (
    <>
      {/* Results header + Sort dropdown */}
      <div className="shops-results-bar mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="shops-results-text">
            <span className="font-semibold text-gray-900 dark:text-white">{data.length}</span>
            <span className="text-gray-600 dark:text-gray-400"> shop{data.length !== 1 ? 's' : ''} found</span>
            {search && <span className="text-gray-600 dark:text-gray-400"> for "{search}"</span>}
            {category && <span className="text-gray-600 dark:text-gray-400"> in {category}</span>}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider hidden sm:inline">Sort:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort shops"
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-[#75d04b]/30 transition-colors"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Button
              onClick={refresh}
              disabled={loading}
              className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 text-sm flex-shrink-0"
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <Loading variant="inline" label="Loading shops…" />
      ) : error ? (
        <EmptyState
          title="Could not load shops"
          description={error}
          action={
            <Button onClick={refresh} className="bg-[#75d04b] hover:bg-[#5ac12f] text-white rounded-lg">
              Try again
            </Button>
          }
        />
      ) : data.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
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
                className="inline-block px-5 py-2.5 bg-[#75d04b] hover:bg-[#5ac12f] text-white rounded-lg font-semibold transition-colors"
              >
                Browse all shops
              </Link>
            ) : null
          }
        />
      )}
    </>
  );

  return (
    <CatalogPageLayout
      breadcrumbItems={breadcrumbItems}
      sidebarContent={<CategorySidebar basePath="/shops" type="business" title="Shop by Business Type" allLabel="All Shops" counts={counts} />}
      mainContent={mainContent}
    />
  );
};

export default ShopsPage;
