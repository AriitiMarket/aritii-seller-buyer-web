/**
 * Marketplace Product Hook
 *
 * Thin re-export of the canonical catalog hook in `@/shared/hooks/useProducts`.
 * All screens read the catalog through that hook (Redux-backed: loading, error,
 * refresh and `state.products.allProducts`), so the public marketplace pages,
 * the buyer dashboard and the header search suggestions share ONE data source.
 *
 * Usage:
 *   const { products, loading, error, refresh } = useProducts();
 *   const filtered = useFilteredProducts(products, { category, shop, search });
 */
export { useProducts, useFilteredProducts } from '@/shared/hooks/useProducts';