/**
 * Experience design tokens — the single source of truth for the three public
 * Aritii experiences (Marketplace / Seller / Delivery).
 *
 * Every public page reads its accent, badge and page-header treatment from
 * here so the platform reads as ONE brand: same header structure, typography,
 * buttons, radii and interaction patterns — only the accent shifts to signal
 * which experience you are in.
 *
 *   Marketplace → brand green (shopping/product-focused)
 *   Seller      → deep forest (business/selling-focused)
 *   Delivery    → logistics slate-teal (fulfillment-focused)
 */

export const BRAND = Object.freeze({
  primary: '#75d04b',
  primaryDark: '#5ac12f',
  primaryDeep: '#4a8f28',
  ink: '#141414',
});

export const EXPERIENCES = Object.freeze({
  marketplace: {
    key: 'marketplace',
    label: 'Marketplace',
    tagline: 'Shop local products',
    base: '/',
    accent: '#75d04b',
    accentDark: '#5ac12f',
    accentDeep: '#4a8f28',
    accentSoft: 'bg-[#75d04b]/10',
    accentText: 'text-[#5ac12f]',
    badge: 'bg-[#75d04b]/10 text-[#5ac12f]',
    button: 'bg-[#75d04b] hover:bg-[#5ac12f] text-white',
    border: 'hover:border-[#75d04b]',
    ring: 'focus-visible:ring-[#75d04b]',
  },
  seller: {
    key: 'seller',
    label: 'Sell on Aritii',
    tagline: 'Grow your business',
    base: '/sell-on-aritii',
    accent: '#2f6e4f',
    accentDark: '#22462f',
    accentDeep: '#1f5539',
    accentSoft: 'bg-[#2f6e4f]/10',
    accentText: 'text-[#2f6e4f]',
    badge: 'bg-[#2f6e4f]/10 text-[#2f6e4f] dark:text-[#7fd0a2]',
    button: 'bg-[#2f6e4f] hover:bg-[#22462f] text-white',
    border: 'hover:border-[#2f6e4f]',
    ring: 'focus-visible:ring-[#2f6e4f]',
  },
  delivery: {
    key: 'delivery',
    label: 'Delivery',
    tagline: 'Orders to every door',
    base: '/delivery',
    accent: '#2563eb',
    accentDark: '#1d4ed8',
    accentDeep: '#1e40af',
    accentSoft: 'bg-[#2563eb]/10',
    accentText: 'text-[#2563eb] dark:text-[#7ab2ff]',
    badge: 'bg-[#2563eb]/10 text-[#2563eb] dark:text-[#7ab2ff]',
    button: 'bg-[#2563eb] hover:bg-[#1d4ed8] text-white',
    border: 'hover:border-[#2563eb]',
    ring: 'focus-visible:ring-[#2563eb]',
  },
});

/** Brand platform strip — used where all three experiences are summarized. */
export const PLATFORM_EXPERIENCES = Object.freeze([
  EXPERIENCES.marketplace,
  EXPERIENCES.seller,
  EXPERIENCES.delivery,
]);

/**
 * Sub-navigation (secondary header) per experience.
 *
 * Rendered by ExperienceSubNav under the main header. `match` is the pathname
 * prefix that marks the item active (so /product/:id highlights "All Products"
 * and /shops/:id highlights "Shops"). `hash` items scroll to a section id on
 * the page. `cta` items are the experience's primary action.
 */
export const EXPERIENCE_SUBNAV = Object.freeze({
  marketplace: Object.freeze([
    { label: 'Overview', to: '/marketplace' },
    { label: 'All Products', to: '/products', match: '/products' },
    { label: 'Categories', to: '/categories' },
    { label: 'Shops', to: '/shops', match: '/shops' },
    { label: "Today's Deals", to: '/deals' },
    { label: 'Best Selling', to: '/best-selling' },
    { label: 'How Shopping Works', to: '/how-it-works#shopping', hash: 'shopping' },
    { label: 'Events', to: '/events' },
  ]),
  seller: Object.freeze([
    { label: 'Overview', to: '/sell-on-aritii' },
    { label: 'Benefits', to: '/sell-on-aritii#benefits', hash: 'benefits' },
    { label: 'Seller Workspace', to: '/sell-on-aritii#seller-workspace', hash: 'seller-workspace' },
    { label: 'How to Start', to: '/sell-on-aritii#how-it-works', hash: 'how-it-works' },
    { label: 'Start Selling', to: '/seller-sign-up', match: '/seller-sign-up', cta: true },
  ]),
  delivery: Object.freeze([
    { label: 'Overview', to: '/delivery' },
    { label: 'How It Works', to: '/delivery#how-it-works', hash: 'how-it-works' },
    { label: 'Capabilities', to: '/delivery#delivery-capabilities', hash: 'delivery-capabilities' },
    { label: 'Provider Network', to: '/delivery#providers', hash: 'providers' },
    { label: 'Tracking', to: '/delivery#tracking', hash: 'tracking' },
    { label: 'Join Delivery', to: '/delivery-sign-up', cta: true },
  ]),
});

/**
 * Mobile drawer — primary level ONLY. The drawer shows these five rows first
 * (plus Sign In / Create Account, appended by the header); tapping an
 * experience row expands its sub-items inline (accordion), sourced from
 * EXPERIENCE_SUBNAV so mobile mirrors the desktop sub-header exactly.
 */
export const MOBILE_NAV_PRIMARY = Object.freeze([
  Object.freeze({ to: '/', label: 'Home' }),
  Object.freeze({ to: '/marketplace', label: 'Marketplace', experienceKey: 'marketplace' }),
  Object.freeze({ to: '/sell-on-aritii', label: 'Sell on Aritii', experienceKey: 'seller' }),
  Object.freeze({ to: '/delivery', label: 'Delivery', experienceKey: 'delivery' }),
]);

/**
 * Resolve the experience for a pathname. Used by the public header (sub-brand
 * label + active accent) and by page headers (badge treatment).
 */
export function experienceForPath(pathname) {
  const path = String(pathname || '/');
  if (path.startsWith('/sell-on-aritii') || path.startsWith('/become-a-seller')) {
    return EXPERIENCES.seller;
  }
  if (path.startsWith('/delivery')) {
    return EXPERIENCES.delivery;
  }
  return EXPERIENCES.marketplace;
}

export default EXPERIENCES;
