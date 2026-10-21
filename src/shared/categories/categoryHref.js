/**
 * categoryHref — builds the filter URL that the Products page reads.
 *
 * The Products page reads `?category=<name>` (URL-encoded category name).
 * This helper keeps every link in the app consistent with that convention.
 *
 * @param {string|{ title?: string, name?: string }} category - category name or object
 * @param {string} [basePath='/products'] - base route to filter on
 * @returns {string} e.g. "/products?category=Electronics"
 */
export function categoryHref(category, basePath = '/products') {
  const name =
    typeof category === 'string' ? category : category?.title || category?.name || '';
  if (!name) return basePath;
  return `${basePath}?category=${encodeURIComponent(name)}`;
}
