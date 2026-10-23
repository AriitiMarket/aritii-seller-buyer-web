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
import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductListItem from '@/features/marketplace/components/ProductListItem';
import ProductCard from '@/shared/components/ProductCard';
import FilterSidebar from '@/features/marketplace/components/FilterSidebar';
import CatalogPageLayout from '@/features/marketplace/components/CatalogPageLayout';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import { useProducts } from '@/shared/hooks/useProducts';
import { useDeliveryLocation } from '@/shared/hooks/useDeliveryLocation';
import { useAuth } from '@/auth/hooks/useAuth';
import { PRODUCT_SORT_OPTIONS, sortProducts } from '@/features/marketplace/utils/sortProducts';
import CatalogSortSelect from '@/features/marketplace/components/CatalogSortSelect';
import CatalogErrorState from '@/features/marketplace/components/CatalogErrorState';

const sortOptions = PRODUCT_SORT_OPTIONS.filter(
  (option) => option.value !== 'best-sellers'
);

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState(
    () => searchParams.get('sort') || 'featured'
  );
  const [viewMode, setViewMode] = useState('grid'); // 'list' | 'grid'
  const category = searchParams.get('category') || '';
  const subcategory = searchParams.get('subcategory') || '';
  const shop = searchParams.get('shop') || '';
  const search = searchParams.get('search') || '';
  const rating = Number(searchParams.get('rating') || 0);
  const min = searchParams.get('min') ? Number(searchParams.get('min')) : null;
  const max = searchParams.get('max') ? Number(searchParams.get('max')) : null;
  const zoneId = searchParams.get('zoneId') || '';
  const cityId = searchParams.get('cityId') || '';
  const regionId = searchParams.get('regionId') || '';

  const { isAuthenticated } = useAuth();
  const { regionName: selectedRegionName, cityName: selectedCityName, zoneName: selectedZoneName, hasLocation, setLocation } = useDeliveryLocation();

  // Build filter object for backend
  const filters = {
    ...(category && { category }),
    ...(subcategory && { subcategory }),
    ...(shop && { shop }),
    ...(search && { search }),
    ...(regionId && { regionId }),
    ...(cityId && { cityId }),
    ...(zoneId && { zoneId }),
    ...(rating && { rating }),
    ...(min !== null && { minPrice: min }),
    ...(max !== null && { maxPrice: max }),
  };

  // Pass filters to backend via useProducts
  const { products, loading, error, refresh } = useProducts({ 
    auto: true,
    filters,
  });

  // Sync URL zone params into Redux state so the cart/checkout share the same zone.
  useEffect(() => {
    if (zoneId || cityId || regionId) {
      setLocation({
        regionId: regionId || undefined,
        regionName: searchParams.get('regionName') || undefined,
        zoneId: zoneId || undefined,
        zoneName: searchParams.get('zoneName') || undefined,
        cityId: cityId || undefined,
        cityName: searchParams.get('cityName') || undefined,
      });
    }
  }, [zoneId, cityId, regionId, setLocation, searchParams]);

  const inStockFilter = searchParams.get('inStock') === 'true';
  const dealFilter = searchParams.get('deal') === 'true';

  // Frontend-side data is filtered by backend, plus quick client toggles
  const data = useMemo(() => {
    let list = products || [];
    if (inStockFilter) {
      list = list.filter((p) => {
        const units = p.available ?? p.stock ?? 0;
        return Number(units) > 0;
      });
    }
    if (dealFilter) {
      list = list.filter((p) => {
        return p.discountPrice && p.price && Number(p.discountPrice) < Number(p.price);
      });
    }
    return list;
  }, [products, inStockFilter, dealFilter]);

  const zoneHint = hasLocation
    ? `Delivering to ${selectedZoneName || selectedCityName || selectedRegionName || 'your selected area'}`
    : 'All zones';

  const handleSortChange = (value) => {
    setSortBy(value);
    // Keep the sort in the URL so shared/linked views (/new-arrivals) can
    // preselect it.
    const next = new URLSearchParams(searchParams);
    if (value === 'featured') next.delete('sort');
    else next.set('sort', value);
    setSearchParams(next, { replace: true });
  };

  // Apply the selected sort to the filtered list.
  const sortedData = useMemo(() => sortProducts(data, sortBy), [data, sortBy]);

  const breadcrumbItems = [
    { label: 'Home', to: '/' },
    { label: 'Products', to: '/products' },
    ...(category ? [{ label: category }] : []),
  ];

  const mainContent = (
    <>
      {/* Results header: "1–24 of over 2,000 results for ..." */}
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
            {hasLocation && (
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
            <CatalogSortSelect
              value={sortBy}
              onChange={handleSortChange}
              options={sortOptions}
              ariaLabel="Sort products"
            />
          </div>
        </div>
      )}

      {loading ? (
        <Loading variant="inline" label="Loading products…" />
      ) : error ? (
        <CatalogErrorState
          title="Could not load products"
          description={error}
          onRetry={refresh}
        />
      ) : data.length > 0 ? (
        <div
          className={
            viewMode === 'list'
              ? 'bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700'
              : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-5'
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
