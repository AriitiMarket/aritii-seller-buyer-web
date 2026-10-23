import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategorySidebar from '@/features/marketplace/components/CategorySidebar';
import DeliveryZoneSelector from '@/features/marketplace/components/DeliveryZoneSelector';
import FilterGroup from '@/features/marketplace/components/FilterGroup';
import { useDeliveryLocation } from '@/shared/hooks/useDeliveryLocation';

/**
 * FilterSidebar - Aritii-style filter sidebar for Products page.
 *
 * Filters:
 *   - Categories (from CategorySidebar with expandable subcategories and product counts)
 *   - Delivery Zone
 *   - Price Range
 *   - Ratings
 *
 * Features:
 *   - Category sidebar with product counts and subcategories
 *   - Mobile: Drawer, not visible by default
 *   - Desktop: Fixed left sidebar
 *   - Consistent styling with Categories and Shops pages
 *   - Aritii branding (#75d04b green, #131921 dark headers)
 *   - Show "X categories selected" counter
 *   - Clear all button
 */

/**
 * Write (or clear) one filter parameter on the current URL.
 * Shared by the price and rating filters — they used to carry identical
 * copies of this helper.
 */
function setFilterParam(searchParams, setSearchParams, key, value) {
  const next = new URLSearchParams(searchParams);
  if (value === '' || value == null) {
    next.delete(key);
  } else {
    next.set(key, String(value));
  }
  setSearchParams(next, { replace: true });
}

function PriceRangeFilter({ searchParams, setSearchParams }) {
  const min = searchParams.get('min') ? Number(searchParams.get('min')) : null;
  const max = searchParams.get('max') ? Number(searchParams.get('max')) : null;

  const setParam = (key, value) =>
    setFilterParam(searchParams, setSearchParams, key, value);

  return (
    <div className="space-y-2 pt-1">
      <div className="flex items-center gap-1.5">
        <div className="relative flex-1">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">ETB</span>
          <input
            type="number"
            placeholder="Min"
            value={min ?? ''}
            onChange={(e) => setParam('min', e.target.value)}
            className="w-full pl-9 pr-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600]"
          />
        </div>
        <span className="text-gray-400 text-xs">–</span>
        <div className="relative flex-1">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">ETB</span>
          <input
            type="number"
            placeholder="Max"
            value={max ?? ''}
            onChange={(e) => setParam('max', e.target.value)}
            className="w-full pl-9 pr-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600]"
          />
        </div>
      </div>
    </div>
  );
}

function RatingFilter({ searchParams, setSearchParams }) {
  const rating = searchParams.get('rating') ? Number(searchParams.get('rating')) : null;

  const setParam = (key, value) =>
    setFilterParam(searchParams, setSearchParams, key, value);

  function Stars({ n }) {
    return (
      <span className="text-[#de7921] tracking-tight text-sm" aria-hidden="true">
        {'★'.repeat(n)}<span className="text-gray-300 dark:text-gray-600">{'★'.repeat(5 - n)}</span>
      </span>
    );
  }

  return (
    <div className="space-y-1 pt-1">
      {[4, 3, 2, 1].map((n) => {
        const active = rating === n;
        return (
          <button
            key={n}
            type="button"
            onClick={() => setParam('rating', active ? '' : String(n))}
            className={`flex items-center gap-2 w-full text-left text-xs py-1 px-1 rounded transition-colors ${
              active
                ? 'font-bold text-[#e77600] bg-orange-50/50'
                : 'text-[#0f1111] dark:text-gray-300 hover:text-[#e77600]'
            }`}
          >
            <Stars n={n} />
            <span className="text-xs">& Up</span>
          </button>
        );
      })}
    </div>
  );
}


const FilterSidebar = ({ products = [], basePath = '/products' }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { regionId, regionName, cityId, cityName, zoneId, zoneName, hasLocation, setLocation } = useDeliveryLocation();

  // Count active filters (not including category as it's handled by CategorySidebar)
  const activeFilters = useMemo(() => {
    let count = 0;
    if (searchParams.get('category')) count++;
    if (searchParams.get('regionId') || searchParams.get('cityId') || searchParams.get('zoneId') || hasLocation) count++;
    if (searchParams.get('min') || searchParams.get('max')) count++;
    if (searchParams.get('rating')) count++;
    return count;
  }, [searchParams, hasLocation]);

  // Clear all filters
  const handleClearAll = () => {
    const next = new URLSearchParams();
    // Preserve search terms
    if (searchParams.get('search')) {
      next.set('search', searchParams.get('search'));
    }
    setSearchParams(next, { replace: true });
    setLocation({ regionId: null, regionName: null, cityId: null, cityName: null, zoneId: null, zoneName: null });
  };

  // Ensure products always reflects current filtered state on both mobile and desktop
  // This prevents stale product counts
  const currentProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    return products;
  }, [products]);

  return (
    <aside className="w-full" aria-label="Product filters">
      <div className="space-y-0">
        {/* Clear All Button — shown when filters are active */}
        {activeFilters > 0 && (
          <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#131921] dark:text-white">
                {activeFilters} filter{activeFilters === 1 ? '' : 's'} applied
              </span>
              <button
                type="button"
                onClick={handleClearAll}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-white bg-[#75d04b] hover:bg-[#5ac12f] rounded-lg transition-colors min-h-[32px]"
                aria-label="Clear all filters"
              >
                ✕ Clear All
              </button>
            </div>
          </div>
        )}

        {/* Category Sidebar with 100% dynamic backend categories */}
        <CategorySidebar products={currentProducts} basePath={basePath} type="product" />

        {/* Availability & Delivery Program */}
        <FilterGroup title="Availability & Programs" defaultOpen={false}>
          <div className="space-y-2 pt-1 text-xs text-gray-700 dark:text-gray-300">
            <label className="flex items-center gap-2 cursor-pointer hover:text-[#131921] dark:hover:text-white">
              <input
                type="checkbox"
                checked={searchParams.get('inStock') === 'true'}
                onChange={(e) => {
                  const next = new URLSearchParams(searchParams);
                  if (e.target.checked) next.set('inStock', 'true');
                  else next.delete('inStock');
                  setSearchParams(next, { replace: true });
                }}
                className="rounded border-gray-300 text-[#75d04b] focus:ring-[#75d04b]"
              />
              <span>In Stock Only</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:text-[#131921] dark:hover:text-white">
              <input
                type="checkbox"
                checked={searchParams.get('deal') === 'true'}
                onChange={(e) => {
                  const next = new URLSearchParams(searchParams);
                  if (e.target.checked) next.set('deal', 'true');
                  else next.delete('deal');
                  setSearchParams(next, { replace: true });
                }}
                className="rounded border-gray-300 text-[#75d04b] focus:ring-[#75d04b]"
              />
              <span className="flex items-center gap-1">
                <span>Special Deals & Offers</span>
                <span className="text-[10px] px-1 bg-red-100 text-red-600 rounded font-bold">Sale</span>
              </span>
            </label>
          </div>
        </FilterGroup>

        {/* Delivery Location Filter (Region → City → Zone) via DeliveryZoneSelector */}
        <FilterGroup title="Delivery Location" defaultOpen={false} revealOnOpen>
          <DeliveryZoneSelector
            mode="zone"
            initialValues={{
              regionId: searchParams.get('regionId') || regionId || '',
              regionName: searchParams.get('regionName') || regionName || '',
              cityId: searchParams.get('cityId') || cityId || '',
              cityName: searchParams.get('cityName') || cityName || '',
              zoneId: searchParams.get('zoneId') || zoneId || '',
              zoneName: searchParams.get('zoneName') || zoneName || '',
            }}
            onSelect={(sel) => {
              const next = new URLSearchParams(searchParams);
              for (const key of ['regionId', 'regionName', 'cityId', 'cityName', 'zoneId', 'zoneName']) {
                if (sel[key]) next.set(key, sel[key]); else next.delete(key);
              }
              setSearchParams(next, { replace: true });
              setLocation(sel);
            }}
            label="Deliver to"
          />
        </FilterGroup>

        {/* Price Range Filter */}
        <FilterGroup title="Price Range" defaultOpen={false}>
          <PriceRangeFilter searchParams={searchParams} setSearchParams={setSearchParams} />
        </FilterGroup>

        {/* Rating Filter */}
        <FilterGroup title="Minimum Rating" defaultOpen={false}>
          <RatingFilter searchParams={searchParams} setSearchParams={setSearchParams} />
        </FilterGroup>
      </div>
    </aside>
  );
};

export default FilterSidebar;
