import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPublicShops } from '@/store/slices/shopThunks';
import { useDeliveryLocation } from '@/shared/hooks/useDeliveryLocation';

/**
 * useShops - the single way screens read shops.
 *
 * Canonical source of truth: `state.shop.shops` (store/slices/shopSlice); the
 * hook seeds it through shopThunks -> shop service -> API client. Dispatches the
 * public thunk for guests and the authenticated thunk for logged-in users.
 */
export function useShops({ auto = true, filters = {} } = {}) {
  const dispatch = useDispatch();
  const { regionId, cityId, zoneId } = useDeliveryLocation();
  const { shops = [], shopsLoading: loading, error } = useSelector(
    (state) => state.shop || {}
  );

  // Callers may pass a fresh `filters` object on every render, so the
  // effective filters are keyed by their serialised form. That keeps the
  // memoised filter object (and the `refresh` callback below) stable as long
  // as the filter *values* do not change.
  const filterSignature = JSON.stringify({
    ...filters,
    regionId: !filters.regionId && regionId ? regionId : undefined,
    cityId: !filters.cityId && cityId ? cityId : undefined,
    zoneId: !filters.zoneId && zoneId ? zoneId : undefined,
  });
  const appliedFilters = useMemo(() => JSON.parse(filterSignature), [filterSignature]);

  const requestedSignature = useRef(null);
  const refresh = useCallback(() => {
    // Marketplace discovery always uses the public, server-filtered shop list
    // so signed-in buyers see the same approved locations as guests.
    dispatch(getPublicShops(appliedFilters));
  }, [dispatch, appliedFilters]);

  useEffect(() => {
    if (!auto) return;
    if (requestedSignature.current === filterSignature) return;
    requestedSignature.current = filterSignature;
    refresh();
  }, [auto, filterSignature, refresh]);

  return { shops, loading, error, refresh };
}

/** Filter shops by search text and/or a shop category (type 'business'). */
export function filterShops(shops, { search, category } = {}) {
  let filtered = Array.isArray(shops) ? [...shops] : [];

  if (search?.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter((shop) => {
      const name = (shop.name || '').toLowerCase();
      const description = (shop.description || '').toLowerCase();
      const type = (shop.category || '').toLowerCase();
      return name.includes(q) || description.includes(q) || type.includes(q);
    });
  }

  if (category) {
    filtered = filtered.filter(
      (shop) => String(shop.category || '').trim().toLowerCase() === category.trim().toLowerCase()
    );
  }

  return filtered;
}

/** Filter shops by delivery location (zoneId / cityId / regionId). */
export function filterShopsByLocation(shops, { zoneId, cityId, regionId } = {}) {
  if (!zoneId && !cityId && !regionId) return shops;
  let filtered = Array.isArray(shops) ? [...shops] : [];
  if (zoneId) {
    filtered = filtered.filter(
      (shop) => String(shop.zoneId || shop.deliveryZoneId || '').toLowerCase() === String(zoneId).toLowerCase()
    );
  }
  if (cityId) {
    filtered = filtered.filter(
      (shop) => String(shop.cityId || shop.deliveryCityId || '').toLowerCase() === String(cityId).toLowerCase()
    );
  }
  if (regionId) {
    filtered = filtered.filter(
      (shop) => String(shop.regionId || shop.deliveryRegionId || '').toLowerCase() === String(regionId).toLowerCase()
    );
  }
  return filtered;
}

export default useShops;
