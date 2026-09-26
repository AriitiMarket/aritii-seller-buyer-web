import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategories } from '@/store/slices/shopThunks';

/**
 * useCatalogCategories - the single way screens read categories.
 *
 * Categories are cached PER TYPE in `state.shop.categoriesByType` (seeded
 * through shopThunks -> catalog service -> GET /category/active/:type), so the
 * products sidebar can show product categories while the shops sidebar shows
 * business (shop) categories — one type never overwrites the other.
 *
 * @param {Object} options
 * @param {boolean} options.auto - Auto-fetch on mount (default: true)
 * @param {string} options.type - 'product' | 'business' | 'shop' | 'event' (default: 'product')
 */
export function useCatalogCategories({ auto = true, type = 'product' } = {}) {
  const dispatch = useDispatch();

  const categories = useSelector((state) => state.shop?.categoriesByType?.[type] ?? []);
  const fetching = useSelector((state) => Boolean(state.shop?.categoriesLoadingByType?.[type]));
  const loaded = useSelector((state) => Boolean(state.shop?.categoriesLoadedByType?.[type]));
  const error = useSelector((state) => state.shop?.categoriesErrorByType?.[type] ?? null);

  const refresh = useCallback(() => dispatch(getAllCategories(type)), [dispatch, type]);

  useEffect(() => {
    if (!auto || loaded || fetching) return;
    dispatch(getAllCategories(type));
  }, [auto, loaded, fetching, dispatch, type]);

  // Treat "requested but not answered yet" as loading so callers can render a
  // skeleton instead of an empty (jumping) layout.
  const loading = fetching || (auto && !loaded);

  return { categories, loading, error, refresh };
}

export default useCatalogCategories;
