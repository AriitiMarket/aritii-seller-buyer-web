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

export default EXPERIENCES;
