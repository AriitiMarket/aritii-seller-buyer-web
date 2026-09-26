import ENV from '@/app/config/env';

export { ENV };

/**
 * App configuration — non-secret, app-wide constants shared by every domain.
 * Domain-specific constants belong inside their feature folder instead.
 */
export const APP = Object.freeze({
  name: ENV.APP_NAME,
  currency: 'ETB',
  defaultLocale: 'en-ET',
});

/** Query defaults used by marketplace/shop/order list services. */
export const PAGINATION = Object.freeze({
  defaultPage: 1,
  defaultLimit: 12,
  categoryLimit: 8,
});

/** Feature flags. Coupons are explicitly OUT of the MVP (see docs/MARKETPLACE.md). */
export const FEATURES = Object.freeze({
  coupons: false,
  promotions: true,
  events: true,
  delivery: true,
  reviews: true,
  requests: true,
});

/**
 * Delivery providers supported by the independent Delivery domain.
 * The UI must never assume a single provider.
 */
export const DELIVERY_PROVIDERS = Object.freeze({
  ARITII: 'ARITII',
  EXTERNAL: 'EXTERNAL',
});

export const DELIVERY_PROVIDER_LABELS = Object.freeze({
  [DELIVERY_PROVIDERS.ARITII]: 'Aritii Delivery',
  [DELIVERY_PROVIDERS.EXTERNAL]: 'External Delivery Provider',
});

/**
 * Order lifecycle statuses shared by buyer tracking, business orders and delivery.
 *
 * NOTE: this legacy list is NOT the order state machine. The authoritative
 * statuses + legal transitions live in `@/shared/utils/orderStatus`
 * (mirroring the Commerce Service's constants/orderStatuses.js) — use
 * `normalizeStatus` from there instead of comparing against these strings.
 */
export const ORDER_STATUSES = Object.freeze([
  'Pending',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
]);

export default { APP, ENV, PAGINATION, FEATURES, DELIVERY_PROVIDERS, ORDER_STATUSES };