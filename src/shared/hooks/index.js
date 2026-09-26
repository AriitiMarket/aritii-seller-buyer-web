/**
 * App-level hooks barrel.
 *
 * Domain-specific hooks live inside their feature folder:
 *   src/features/<domain>/hooks/
 * Only hooks reused by more than one domain belong here.
 */
export { useDebounce } from '@/shared/hooks/useDebounce';
export {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
} from '@/shared/hooks/useMediaQuery';
export { useProducts, useFilteredProducts } from '@/shared/hooks/useProducts';
export { useShops, filterShops } from '@/shared/hooks/useShops';
export { useCatalogCategories } from '@/shared/hooks/useCatalogCategories';
export { usePromotions } from '@/shared/hooks/usePromotions';
