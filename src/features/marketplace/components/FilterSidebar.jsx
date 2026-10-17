import React, { useMemo, useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCatalogCategories } from '@/shared/hooks/useCatalogCategories';
import { useShops } from '@/shared/hooks/useShops';
import { useDeliveryLocation } from '@/shared/hooks/useDeliveryLocation';
import { locationService } from '@/services';

/**
 * FilterSidebar - left filter rail for the products page.
 *
 * Groups (all URL-param driven so filters are shareable/bookmarkable):
 *   - Department   -> ?category=<name>
 *   - Reviews      -> ?rating=4  ("4 stars & up")
 *   - Price        -> ?min=&max=
 *   - Brand / Shop -> ?shop=<name>
 *
 * Pure presentation + URL state; it never owns data. Counts are derived from
 * the product list passed in via `products` so they stay live.
 */

function Group({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-left text-sm font-bold text-gray-900 dark:text-white mb-2"
        aria-expanded={open}
      >
        {title}
        <span className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}>⌃</span>
      </button>
      {open && <div className="space-y-1.5">{children}</div>}
    </div>
  );
}

function Stars({ n }) {
  return (
    <span className="text-[#DE7921] tracking-tight" aria-hidden="true">
      {'★'.repeat(n)}<span className="text-gray-300">{'★'.repeat(5 - n)}</span>
    </span>
  );
}

const ZONE_LOADING = 'Loading zones…';

const FilterSidebar = ({ products = [], basePath = '/products' }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories } = useCatalogCategories({ type: 'product' });
  const { shops } = useShops();
  const { zoneId: selectedZoneId, cityId: selectedCityId, zoneName, cityName, setLocation, clearLocation } = useDeliveryLocation();
  const [zones, setZones] = useState([]);
  const [zonesLoading, setZonesLoading] = useState(false);

  const category = searchParams.get('category') || '';
  const shop = searchParams.get('shop') || '';
  const rating = searchParams.get('rating') || '';
  const min = searchParams.get('min') || '';
  const max = searchParams.get('max') || '';
  const urlZoneId = searchParams.get('zoneId') || '';
  const urlCityId = searchParams.get('cityId') || '';

  // Load zones when the sidebar mounts
  useEffect(() => {
    let active = true;
    const load = async () => {
      setZonesLoading(true);
      try {
        const zoneList = await locationService.listZones();
        if (active) setZones(zoneList);
      } catch {
        if (active) setZones([]);
      } finally {
        if (active) setZonesLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  // Sync selected delivery location to URL params when the header changes it
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (selectedZoneId) {
      next.set('zoneId', selectedZoneId);
    } else {
      next.delete('zoneId');
    }
    if (selectedCityId) {
      next.set('cityId', selectedCityId);
    } else {
      next.delete('cityId');
    }
    // Only update if different to avoid loops
    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
  }, [selectedZoneId, selectedCityId, searchParams, setSearchParams]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === '' || value == null) next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  // Live per-category counts from the current product set.
  const categoryCounts = useMemo(() => {
    const map = {};
    (products || []).forEach((p) => {
      const key = String(p.category || '').trim();
      if (key) map[key] = (map[key] || 0) + 1;
    });
    return map;
  }, [products]);

  const priceRanges = [
    { label: 'Under ETB 500', min: '', max: '500' },
    { label: 'ETB 500 – 2,000', min: '500', max: '2000' },
    { label: 'ETB 2,000 – 10,000', min: '2000', max: '10000' },
    { label: 'ETB 10,000 – 50,000', min: '10000', max: '50000' },
    { label: 'Over ETB 50,000', min: '50000', max: '' },
  ];

  const activeRange = priceRanges.find((r) => r.min === min && r.max === max);

  return (
    <aside className="w-full" aria-label="Product filters">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Filters</h2>
          {(category || shop || rating || min || max || urlZoneId) && (
            <Link
              to={basePath}
              className="text-xs text-[#007185] hover:text-[#C7511F] hover:underline"
            >
              Clear all
            </Link>
          )}
        </div>
        {/* Delivery Zone */}
        <Group title="Delivery Zone" defaultOpen={false}>
          {zonesLoading ? (
            <button type="button" className="flex items-center gap-2 w-full text-left text-sm text-[#9aa6b2] disabled:opacity-50" disabled>
              {ZONE_LOADING}
            </button>
          ) : zones.length === 0 ? (
            <button type="button" className="flex items-center gap-2 w-full text-left text-sm text-[#9aa6b2]" disabled>
              No zones available
            </button>
          ) : (
            <>
              {zones.map((zone) => {
                const active = String(urlZoneId || selectedZoneId) === String(zone._id || zone.id);
                return (
                  <label
                    key={zone._id || zone.id}
                    className={`flex items-center gap-2 text-sm ${active ? 'font-bold text-[#DE7921]' : 'text-gray-600 dark:text-gray-300 hover:text-[#DE7921]'}`}>
                    <input
                      type="radio"
                      name="delivery-zone"
                      checked={active}
                      onChange={() => {
                        setLocation({
                          zoneId: String(zone._id || zone.id),
                          zoneName: zone.name || '',
                          cityId: zone.cityId || null,
                          cityName: zone.cityName || '',
                        });
                        setParam('zoneId', String(zone._id || zone.id));
                        setParam('cityId', zone.cityId || '');
                      }}
                      className="accent-[#DE7921]"
                    />
                    <span className={active ? 'font-bold text-[#DE7921]' : 'text-gray-600 dark:text-gray-300'}>
                      {zone.name}
                      {zone.cityName && <span className="text-[10px] text-[#6b7280] ml-auto">{zone.cityName}</span>}
                    </span>
                  </label>
                );
              })}
              {selectedZoneId && (
                <button
                  type="button"
                  onClick={() => {
                    clearLocation();
                    setParam('zoneId', '');
                    setParam('cityId', '');
                  }}
                  className="flex items-center gap-2 w-full text-left text-sm text-[#de7921] hover:text-[#f0a851] mt-2 border-t border-gray-200/50 pt-2"
                >
                  Clear zone
                </button>
              )}
            </>
          )}
        </Group>

        {/* Department */}
        <Group title="Department">
          <Link
            to={basePath}
            className={`block text-sm ${!category ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:text-[#C7511F]'}`}
          >
            All Products
          </Link>
          {(categories || []).map((cat) => {
            const name = cat.title || cat.name || cat;
            const count = categoryCounts[name] ?? cat.productCount ?? 0;
            const active = category.toLowerCase() === String(name).toLowerCase();
            return (
              <Link
                key={cat._id || name}
                to={`${basePath}?category=${encodeURIComponent(name)}`}
                className={`block text-sm ${active ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:text-[#C7511F]'}`}
              >
                {name}{count > 0 && <span className="text-gray-400"> ({count})</span>}
              </Link>
            );
          })}
        </Group>

        {/* Customer Reviews */}
        <Group title="Customer Reviews">
          {[4, 3, 2].map((n) => {
            const active = rating === String(n);
            return (
              <button
                key={n}
                type="button"
                onClick={() => setParam('rating', active ? '' : String(n))}
                className={`flex items-center gap-2 w-full text-left text-sm ${active ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:text-[#C7511F]'}`}
              >
                <Stars n={n} />
                <span>& Up</span>
              </button>
            );
          })}
        </Group>

        {/* Price */}
        <Group title="Price">
          {priceRanges.map((r) => {
            const active = activeRange === r;
            return (
              <button
                key={r.label}
                type="button"
                onClick={() => {
                  if (active) {
                    setParam('min', '');
                    setParam('max', '');
                  } else {
                    setParam('min', r.min);
                    setParam('max', r.max);
                  }
                }}
                className={`block w-full text-left text-sm ${active ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:text-[#C7511F]'}`}
              >
                {r.label}
              </button>
            );
          })}
        </Group>

        {/* Brands / Shops */}
        {(shops || []).length > 0 && (
          <Group title="Brands" defaultOpen={false}>
            {(shops || []).slice(0, 12).map((s) => {
              const name = s.name;
              const active = shop.toLowerCase() === String(name).toLowerCase();
              return (
                <label key={s._id || name} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => setParam('shop', active ? '' : name)}
                    className="accent-[#DE7921]"
                  />
                  <span className={active ? 'font-bold text-gray-900 dark:text-white' : ''}>{name}</span>
                </label>
              );
            })}
          </Group>
        )}
      </div>
    </aside>
  );
};

export default FilterSidebar;

