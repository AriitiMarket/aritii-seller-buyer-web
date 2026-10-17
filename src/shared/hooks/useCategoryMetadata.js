import { useState, useEffect } from 'react';
import { productService } from '@/services';

/**
 * useCategoryMetadata - fetch categories with dynamic product counts from backend
 *
 * This hook fetches category metadata including live product counts,
 * scoped to the user's delivery zone if selected.
 */
export function useCategoryMetadata(zoneId, cityId) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productService.getCategoryMetadata({
          ...(zoneId && { zoneId }),
          ...(cityId && { cityId }),
        });
        if (active) {
          setCategories(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Failed to load categories');
          setCategories([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();
    return () => { active = false; };
  }, [zoneId, cityId]);

  return { categories, loading, error };
}
