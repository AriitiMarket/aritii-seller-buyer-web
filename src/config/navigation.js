/**
 * Navigation Configuration
 *
 * Single source of truth for the buyer and seller sidebars.
 * 
 * BUYER_SIDEBAR now contains only account management pages.
 * Marketplace shopping (Products, Shops) is in the public marketplace
 * accessible via the MarketplaceHeader.
 */

/**
 * BUYER_SIDEBAR — grouped sections for account management only.
 * Sections: Overview, My Activity, Account.
 * 
 * Note: Products and Shops navigation removed - use public marketplace instead.
 */
export const BUYER_SIDEBAR = [
  { section: 'OVERVIEW' },
  { label: 'Dashboard', to: '/my-dashboard', icon: 'MdDashboard', end: true },
  { section: 'MY ACTIVITY' },
  { label: 'Orders', to: '/my-dashboard/orders', icon: 'MdReceipt', badge: 'orders' },
  { label: 'Saved Items', to: '/my-dashboard/wishlist', icon: 'MdFavoriteBorder', badge: 'wishlist' },
  { label: 'Reviews', to: '/my-dashboard/reviews', icon: 'MdRateReview' },
  { label: 'Messages', to: '/my-dashboard/requests', icon: 'MdHelpOutline' },
  { section: 'PAYMENTS' },
  { label: 'Payment Methods', to: '/payment-methods', icon: 'MdCreditCard' },
  { label: 'Transactions', to: '/transactions', icon: 'MdHistory' },
  { section: 'ACCOUNT' },
  { label: 'Cart', to: '/my-dashboard/cart', icon: 'MdShoppingCart', badge: 'cart' },
  { label: 'Addresses', to: '/my-dashboard/addresses', icon: 'MdLocationOn' },
  { label: 'Settings', to: '/my-dashboard/settings', icon: 'MdSettings' },
  { label: 'Become a Seller', to: '/seller-registration', icon: 'MdStorefront' },
];

/**
 * BUYER_BOTTOM_NAV — 5 items for the mobile bottom navigation bar.
 * Updated to remove product/shop browsing, focus on account.
 */
export const BUYER_BOTTOM_NAV = [
  { label: 'Home', to: '/my-dashboard', icon: 'MdDashboard', end: true },
  { label: 'Orders', to: '/my-dashboard/orders', icon: 'MdReceipt' },
  { label: 'Cart', to: '/my-dashboard/cart', icon: 'MdShoppingCart' },
  { label: 'Wishlist', to: '/my-dashboard/wishlist', icon: 'MdFavoriteBorder' },
  { label: 'Account', to: '/my-dashboard/settings', icon: 'MdPerson' },
];

export const BUYER_PROFILE_DROPDOWN = [
  { type: 'separator' },
  { section: 'ACCOUNT' },
  { label: 'Settings', to: '/my-dashboard/settings', icon: 'MdSettings', end: true },
  { label: 'Orders', to: '/my-dashboard/orders', icon: 'MdReceipt', badge: 'orders' },
  { label: 'Wishlist', to: '/my-dashboard/wishlist', icon: 'MdFavoriteBorder', badge: 'wishlist' },
  { type: 'separator' },
  { type: 'logout' },
];

export const SELLER_SIDEBAR = [
  { section: 'DASHBOARD' },
  { label: 'Dashboard', to: '/business', icon: 'MdDashboard', end: true },
  { section: 'CATALOG' },
  { label: 'Products', to: '/business/products', icon: 'MdInventory' },
  { label: 'Add Product', to: '/business/products/create', icon: 'MdAddBox' },
  { label: 'Inventory', to: '/business/inventory', icon: 'MdShoppingBag' },
  { section: 'SALES' },
  { label: 'Orders', to: '/business/orders', icon: 'MdShoppingCart' },
  { label: 'Refunds', to: '/business/refunds', icon: 'MdReceiptLong' },
  { label: 'Customers', to: '/business/customers', icon: 'MdPerson' },
  { label: 'Product Requests', to: '/business/requests', icon: 'MdHelpOutline' },
  { section: 'GROWTH' },
  { label: 'Analytics', to: '/business/analytics', icon: 'MdAnalytics' },
  { label: 'Reports', to: '/business/reports', icon: 'MdBarChart' },
  { label: 'Promotions', to: '/business/promotions', icon: 'MdLocalOffer' },
  { label: 'Events', to: '/business/events', icon: 'MdEvent' },
  { section: 'FINANCE' },
  { label: 'Finance', to: '/business/finance', icon: 'MdAccountBalanceWallet' },
  { section: 'STORE' },
  { label: 'Store', to: '/business/shops', icon: 'MdStorefront' },
  { label: 'Reviews', to: '/business/reviews', icon: 'MdRateReview' },
  { section: 'SETTINGS' },
  { label: 'Settings', to: '/business/settings', icon: 'MdSettings' },
  { type: 'separator' },
  { type: 'logout' },
];
