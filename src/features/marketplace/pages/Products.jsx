/**
 * Marketplace Products Page
 *
 * Canonical route: /products
 *
 * Guests see publicly permitted catalog items;
 * authenticated buyers hit the same endpoint and the backend applies their full
 * authorization (frontend filtering is never the security boundary).
 *
 * Uses the marketplace feature's own hooks and components.
 */
import React, { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductListItem from '@/features/marketplace/components/ProductListItem';
import ProductCard from '@/shared/components/ProductCard';
import FilterSidebar from '@/features/marketplace/components/FilterSidebar';
import CatalogPageLayout from '@/features/marketplace/components/CatalogPageLayout';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import Button from '@/components/common/Button';
import { useProducts, useFilteredProducts } from '@/shared/hooks/useProducts';
import { useAuth } from '@/features/marketplace/hooks/useAuth';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Avg. Customer Review' },
  { value: 'newest', label: 'Newest Arrivals' },
];

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid'); // 'list' | 'grid'
  const category = searchParams.get('category') || '';
  const shop = searchParams.get('shop') || '';
  const search = searchParams.get('search') || '';
  const rating = Number(searchParams.get('rating') || 0);
  const min = searchParams.get('min') ? Number(searchParams.get('min')) : null;
  const max = searchParams.get('max') ? Number(searchParams.get('max')) : null;
  const zoneId = searchParams.get('zoneId') || '';
  const cityId = searchParams.get('cityId') || '';

  const { isAuthenticated } = useAuth();
  const { zoneId: selectedZoneId, cityId: selectedCityId, cityName: selectedCityName, zoneName: selectedZoneName, hasZone, setLocation } = useDeliveryLocation();
  const { products, loading, error, refresh } = useProducts({ auto: true, zoneId: hasZone ? selectedZoneId : undefined, cityId: hasZone ? selectedCityId : undefined });

  // Sync URL zone params into Redux state so the cart/checkout share the same zone.
  // URL params are bookmarkable: ?zoneId=xxx&cityId=yyy
  useEffect(() => {
    if (zoneId || cityId) {
      setLocation({
        zoneId: zoneId || selectedZoneId,
        zoneName: searchParams.get('zoneName') || selectedZoneName,
        cityId: cityId || selectedCityId,
        cityName: searchParams.get('cityName') || selectedCityName,
      });
    }
  }, [zoneId, cityId, selectedZoneId, selectedZoneName, selectedCityName, setLocation, searchParams]);
  const baseFiltered = useFilteredProducts(products, { category, shop, search });

  // Apply the sidebar rating + price filters on top of the URL search filters.
  const data = useMemo(() => {
    let list = baseFiltered;
    if (rating) {
      list = list.filter((p) => Number(p.ratings || p.rating || 0) >= rating);
    }
    if (min != null) {
      list = list.filter((p) => Number(p.discountPrice ?? p.price ?? 0) >= min);
    }
    if (max != null) {
      list = list.filter((p) => Number(p.discountPrice ?? p.price ?? 0) <= max);
    }
    return list;
  }, [baseFiltered, rating, min, max]);

  const heading = search ? `Search: "${search}"` : category || shop || 'All Products';
  const zoneHint = hasZone
    ? `Delivering to ${selectedZoneName}${selectedCityName ? `, ${selectedCityName}` : ''}`
    : 'All zones';

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  // Apply the selected sort to the filtered list.
  const sortedData = useMemo(() => {
    const list = [...data];
    switch (sortBy) {
      case 'price-low':
        list.sort((a, b) => (a.discountPrice || 0) - (b.discountPrice || 0));
        break;
      case 'price-high':
        list.sort((a, b) => (b.discountPrice || 0) - (a.discountPrice || 0));
        break;
      case 'rating':
        list.sort((a, b) => (b.ratings || 0) - (a.ratings || 0));
        break;
      case 'newest':
        list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      default:
        break;
    }
    return list;
  }, [data, sortBy]);

  const breadcrumbItems = [
    { label: 'Home', to: '/' },
    { label: 'Products' },
  ];
  if (category) {
    breadcrumbItems.push({ label: category });
  } else if (shop) {
    breadcrumbItems.push({ label: shop });
  } else if (search) {
    breadcrumbItems.push({ label: `Search: "${search}"` });
  }

  const mainContent = (
    <>
      {/* Amazon-style results header: "1–24 of over 2,000 results for ..." */}
      {!loading && !error && (
        <div className="market-results-bar">
          <div className="market-results-text">
            <span className="market-results-count">1–{Math.min(data.length, 24)}</span>{' '}
            of <span className="market-results-count">{data.length}</span> results
            {search ? (
              <span> for "{search}"</span>
            ) : null}
            {category ? (
              <span> in {category}</span>
            ) : null}
            {shop ? (
              <span> from {shop}</span>
            ) : null}
            {hasZone && (
              <span> • delivering to {zoneHint}</span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 lg:gap-3">
            <div className="flex items-center gap-1 bg-market-surface-container-low rounded-button p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 text-sm rounded-button transition-colors ${viewMode === 'list' ? 'bg-market-surface text-market-on-surface shadow-sm' : 'text-market-on-surface-variant hover:text-market-on-surface hover:bg-market-surface-container'}`}
                aria-label="List view"
                aria-pressed={viewMode === 'list'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 text-sm rounded-button transition-colors ${viewMode === 'grid' ? 'bg-market-surface text-market-on-surface shadow-sm' : 'text-market-on-surface-variant hover:text-market-on-surface hover:bg-market-surface-container'}`}
                aria-label="Grid view"
                aria-pressed={viewMode === 'grid'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" /></svg>
              </button>
            </div>
            <span className="text-xs font-semibold text-market-on-surface-variant uppercase tracking-wider hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              aria-label="Sort products"
              className="px-3 py-1.5 text-sm border border-market-border rounded-button bg-market-surface text-market-on-surface focus:outline-none focus:ring-2 focus:ring-market-primary/30"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {loading ? (
        <Loading variant="inline" label="Loading products…" />
      ) : error ? (
        <EmptyState
          title="Could not load products"
          description={error}
          action={
            <Button onClick={refresh} className="bg-[#75d04b] hover:bg-[#5ac12f] text-white">
              Try again
            </Button>
          }
        />
      ) : data.length > 0 ? (
        <div
          className={
            viewMode === 'list'
              ? 'bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700'
              : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6'
          }
        >
          {sortedData.map((product, index) => (
            viewMode === 'list' ? (
              <ProductListItem data={product} key={product._id || index} variant={isAuthenticated ? 'default' : 'public'} />
            ) : (
              <ProductCard data={product} key={product._id || index} variant={isAuthenticated ? 'default' : 'public'} />
            )
          ))}
        </div>
      ) : (
        <EmptyState
          title={
            search
              ? 'No products match your search'
              : category
                ? `No products in ${category} yet`
                : 'No products found'
          }
          description={
            search
              ? 'Try different keywords or browse all products.'
              : category
                ? 'This category is empty right now — pick another one to keep browsing.'
                : 'Check back later for new products.'
          }
          action={
            search || category ? (
              <Link
                to="/products"
                className="inline-block px-5 py-2.5 bg-[#75d04b] hover:bg-[#5ac12f] text-white rounded-lg font-semibold transition-colors"
              >
                Browse all products
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
      sidebarContent={<FilterSidebar products={products} basePath="/products" />}
      mainContent={mainContent}
    />
  );
};

export default ProductsPage;
