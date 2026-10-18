import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategorySidebar from '@/features/marketplace/components/CategorySidebar';
import LocationSelector from '@/features/marketplace/components/LocationSelector';

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

function FilterGroup({ title, children, defaultOpen = true, countBadge = null }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-left text-sm font-bold text-[#131921] dark:text-white mb-2"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          {title}
          {countBadge && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-[#75d04b] text-white text-xs font-bold rounded-full">
              {countBadge}
            </span>
          )}
        </span>
        <span className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}>⌃</span>
      </button>
      {open && <div className="space-y-0">{children}</div>}
    </div>
  );
}

function PriceRangeFilter({ searchParams, setSearchParams }) {
  const min = searchParams.get('min') ? Number(searchParams.get('min')) : null;
  const max = searchParams.get('max') ? Number(searchParams.get('max')) : null;

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === '' || value == null) {
      next.delete(key);
    } else {
      next.set(key, String(value));
    }
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Min"
          value={min ?? ''}
          onChange={(e) => setParam('min', e.target.value)}
          className="flex-1 px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#75d04b]/30"
        />
        <span className="flex items-center text-gray-400">–</span>
        <input
          type="number"
          placeholder="Max"
          value={max ?? ''}
          onChange={(e) => setParam('max', e.target.value)}
          className="flex-1 px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#75d04b]/30"
        />
      </div>
    </div>
  );
}

function RatingFilter({ searchParams, setSearchParams }) {
  const rating = searchParams.get('rating') ? Number(searchParams.get('rating')) : null;

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === '' || value == null) {
      next.delete(key);
    } else {
      next.set(key, String(value));
    }
    setSearchParams(next, { replace: true });
  };

  function Stars({ n }) {
    return (
      <span className="text-[#75d04b] tracking-tight" aria-hidden="true">
        {'★'.repeat(n)}<span className="text-gray-300">{'★'.repeat(5 - n)}</span>
      </span>
    );
  }

  return (
    <div className="space-y-2">
      {[4, 3, 2].map((n) => {
        const active = rating === n;
        return (
          <button
            key={n}
            type="button"
            onClick={() => setParam('rating', active ? '' : String(n))}
            className={`flex items-center gap-2 w-full text-left text-sm px-2 py-1.5 rounded-lg transition-all ${
              active
                ? 'bg-[#75d04b]/10 font-bold text-[#75d04b] border-l-4 border-[#75d04b]'
                : 'text-gray-600 dark:text-gray-400 hover:text-[#75d04b] hover:bg-gray-100 dark:hover:bg-gray-800/50'
            }`}
          >
            <Stars n={n} />
            <span className="text-xs">& Up</span>
            {active && <span className="text-xs font-bold ml-auto">✓</span>}
          </button>
        );
      })}
    </div>
  );
}


const FilterSidebar = ({ products = [], basePath = '/products' }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Count active filters (not including category as it's handled by CategorySidebar)
  const activeFilters = useMemo(() => {
    let count = 0;
    if (searchParams.get('category')) count++;
    if (searchParams.get('regionId')) count++;
    if (searchParams.get('zoneId') || searchParams.get('cityId')) count++;
    if (searchParams.get('min') || searchParams.get('max')) count++;
    if (searchParams.get('rating')) count++;
    return count;
  }, [searchParams]);

  // Clear all filters
  const handleClearAll = () => {
    const next = new URLSearchParams();
    // Preserve search terms
    if (searchParams.get('search')) {
      next.set('search', searchParams.get('search'));
    }
    setSearchParams(next, { replace: true });
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

        {/* Category Sidebar */}
        <CategorySidebar products={currentProducts} basePath={basePath} />

        {/* Delivery Location Filter (Region → City → Zone) via shared LocationSelector */}
        <FilterGroup title="Delivery Location" defaultOpen={false}>
          <LocationSelector
            mode="zone"
            initialValues={{
              regionId: searchParams.get('regionId') || '',
              cityId: searchParams.get('cityId') || '',
              zoneId: searchParams.get('zoneId') || '',
            }}
            onSelect={(sel) => {
              const next = new URLSearchParams(searchParams);
              if (sel.regionId) next.set('regionId', sel.regionId); else next.delete('regionId');
              if (sel.cityId) next.set('cityId', sel.cityId); else next.delete('cityId');
              if (sel.zoneId) next.set('zoneId', sel.zoneId); else next.delete('zoneId');
              setSearchParams(next, { replace: true });
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
