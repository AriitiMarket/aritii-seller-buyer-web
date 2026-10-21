import React, { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ShopCard from '@/shared/components/ShopCard';
import CategorySidebar from '@/features/marketplace/components/CategorySidebar';
import CatalogPageLayout from '@/features/marketplace/components/CatalogPageLayout';
import CatalogSortSelect from '@/features/marketplace/components/CatalogSortSelect';
import CatalogErrorState from '@/features/marketplace/components/CatalogErrorState';
import DeliveryZoneSelector from '@/features/marketplace/components/DeliveryZoneSelector';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import Button from '@/components/common/Button';
import { useShops, filterShops } from '@/shared/hooks/useShops';
import { useAuth } from '@/auth/hooks/useAuth';
import { useDeliveryLocation } from '@/shared/hooks/useDeliveryLocation';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'rating', label: 'Rating (Highest)' },
  { value: 'products', label: 'Most Products' },
  { value: 'newest', label: 'Newest' },
  { value: 'name', label: 'Name: A to Z' },
];

const ShopsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const zoneId = searchParams.get('zoneId') || '';
  const cityId = searchParams.get('cityId') || '';
  const regionId = searchParams.get('regionId') || '';
  const { regionId: savedRegionId, regionName: savedRegionName, cityId: savedCityId, cityName: savedCityName, zoneId: savedZoneId, zoneName: savedZoneName, setLocation } = useDeliveryLocation();
  const selectedRegionId = regionId || savedRegionId || '';
  const selectedCityId = cityId || savedCityId || '';
  const selectedZoneId = zoneId || savedZoneId || '';
  const [sortBy, setSortBy] = useState('featured');

  const { isAuthenticated } = useAuth();
  const { shops, loading, error, refresh } = useShops({
    auto: true,
    filters: { zoneId: selectedZoneId, cityId: selectedCityId, regionId: selectedRegionId },
  });
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


  const breadcrumbItems = [
    { label: 'Home', to: '/' },
    { label: 'Shops', to: '/shops' },
  ];

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
            {selectedRegionId && <span className="text-gray-600 dark:text-gray-400"> in {searchParams.get('regionName') || savedRegionName || 'selected region'}</span>}
            {selectedCityId && <span className="text-gray-600 dark:text-gray-400">, {searchParams.get('cityName') || savedCityName || 'selected city'}</span>}
            {selectedZoneId && <span className="text-gray-600 dark:text-gray-400">, delivering to {searchParams.get('zoneName') || savedZoneName || 'selected zone'}</span>}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider hidden sm:inline">Sort:</label>
            <CatalogSortSelect
              value={sortBy}
              onChange={setSortBy}
              options={SORT_OPTIONS}
              ariaLabel="Sort shops"
            />
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
        <CatalogErrorState
          title="Could not load shops"
          description={error}
          onRetry={refresh}
        />
      ) : data.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
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
      sidebarContent={(
        <>
          <CategorySidebar basePath="/shops" type="business" title="Shop by Business Type" allLabel="All Shops" counts={counts} />
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <DeliveryZoneSelector
            mode="zone"
            initialValues={{
              regionId: selectedRegionId,
              regionName: searchParams.get('regionName') || savedRegionName || '',
              cityId: selectedCityId,
              cityName: searchParams.get('cityName') || savedCityName || '',
              zoneId: selectedZoneId,
              zoneName: searchParams.get('zoneName') || savedZoneName || '',
            }}
            label="Deliver to"
            onSelect={(selection) => {
              const next = new URLSearchParams(searchParams);
              for (const key of ['regionId', 'regionName', 'cityId', 'cityName', 'zoneId', 'zoneName']) {
                if (selection[key]) next.set(key, selection[key]); else next.delete(key);
              }
              setSearchParams(next, { replace: true });
              setLocation(selection);
            }}
          />
          </div>
        </>
      )}
      mainContent={mainContent}
    />
  );
};

export default ShopsPage;
