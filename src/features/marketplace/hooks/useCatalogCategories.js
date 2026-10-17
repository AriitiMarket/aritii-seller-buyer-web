/**
 * Marketplace Categories Hook
 *
 * Thin re-export of the canonical categories hook in
 * `@/shared/hooks/useCatalogCategories` (per-type cache in
 * `state.shop.categoriesByType`, so product and business categories never
 * overwrite each other).
 */
export { useCatalogCategories } from '@/shared/hooks/useCatalogCategories';