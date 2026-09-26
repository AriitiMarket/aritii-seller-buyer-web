/**
 * useCategories — the single source of truth for category data across the app.
 *
 * Re-exports the shared hook which reads from Redux state.shop.categories
 * (seeded via shopThunks → catalogService → GET /category/get-all-categories).
 * All components — public, buyer, seller, landing — use this hook.
 */
export { useCatalogCategories as default, useCatalogCategories as useCategories } from '@/shared/hooks/useCatalogCategories';
