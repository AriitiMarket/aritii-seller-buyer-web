/**
 * Shared product normalisation + sorting for the public catalog pages
 * (Products, Best Sellers, Deals, Marketplace landing).
 *
 * Every public catalog page used to carry its own copy of this logic, and the
 * copies disagreed: /products sorted on `discountPrice` only (so full-price
 * products compared as 0 and floated to the top of "Price: Low to High"),
 * while /best-selling used the correct `discountPrice ?? price` fallback.
 * One implementation keeps the pages in sync.
 */

/** Effective selling price — the discounted price when present, else the list price. */
export const productPrice = (product) => product?.discountPrice ?? product?.price ?? 0;

/** The "was" price — the list price a discount is measured against. */
export const productListPrice = (product) => product?.originalPrice ?? product?.price ?? 0;

/** Units sold — the public and store APIs use different field names. */
export const productUnitsSold = (product) =>
  product?.unitsSold ?? product?.sold_out ?? product?.total_sell ?? 0;

/** Amount taken off the list price (0 when the product is not discounted). */
export const productDiscountAmount = (product) =>
  Math.max(0, productListPrice(product) - productPrice(product));

/** Discount as a percentage of the list price. */
export const productDiscountPercent = (product) => {
  const list = productListPrice(product);
  if (!list) return 0;
  return Math.round((productDiscountAmount(product) / list) * 100);
};

/** Average customer rating. */
export const productRating = (product) => product?.ratings ?? product?.rating ?? 0;

/** Creation timestamp as a comparable number. */
export const productCreatedAt = (product) =>
  new Date(product?.createdAt ?? product?.created_at ?? 0).getTime();

/**
 * The category of a product as a plain string.
 *
 * The public payload returns the category either as a title string or as an
 * object (`{ name | title | id }`), so every page that compares categories
 * needs this normalisation — otherwise `product.category.toLowerCase()`
 * throws on the object shape.
 */
export const productCategoryTitle = (product) => {
  const category = product?.category;
  if (!category) return '';
  if (typeof category === 'string') return category;
  return category.name || category.title || category.id || '';
};

/** Canonical sort vocabulary shared by every catalog page. */
export const PRODUCT_SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Avg. Customer Review' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'best-sellers', label: 'Best Sellers' },
];

/**
 * Sort a product list by one of the canonical sort values.
 * Returns a new array; the input is not mutated.
 */
export function sortProducts(products, sortBy = 'featured') {
  const list = [...(products || [])];

  switch (sortBy) {
    case 'price-low':
      list.sort((a, b) => productPrice(a) - productPrice(b));
      break;
    case 'price-high':
      list.sort((a, b) => productPrice(b) - productPrice(a));
      break;
    case 'rating':
      list.sort((a, b) => productRating(b) - productRating(a));
      break;
    case 'newest':
      list.sort((a, b) => productCreatedAt(b) - productCreatedAt(a));
      break;
    case 'best-sellers':
      list.sort((a, b) => productUnitsSold(b) - productUnitsSold(a));
      break;
    default:
      break;
  }

  return list;
}

export default sortProducts;
