/**
 * Marketplace pages barrel.
 *
 * Canonical routes:
 *   /marketplace   -> MarketplaceLandingPage
 *   /products      -> ProductsPage
 *   /product/:id   -> ProductDetailPage
 *   /categories    -> CategoriesPage
 *   /shops         -> ShopsPage
 */
export { default as MarketplaceLandingPage } from './MarketplaceLandingPage';
export { default as ProductsPage } from './Products';
export { default as ProductDetailPage } from './ProductDetail';
export { default as CategoriesPage } from './Categories';
export { default as ShopsPage } from './Shops';
