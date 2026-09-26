/**
 * Navigation Configuration
 *
 * Single source of truth for the buyer and seller sidebars.
 * The public header keeps its own hand-placed nav (it interleaves the
 * Discover dropdown), so there is no unused public list here any more.
 */

/**
 * BUYER_SIDEBAR — grouped sections for the modern sidebar.
 * Sections: Browse, My Activity, Account.
 */
export const BUYER_SIDEBAR = [
  { section: 'BROWSE' },
  { label: 'Overview', to: '/my-dashboard', icon: 'MdDashboard', end: true },
  { label: 'Products', to: '/my-dashboard/marketplace', icon: 'MdShoppingBag' },
  { label: 'Shops', to: '/my-dashboard/shops', icon: 'MdStorefront' },
  { section: 'MY ACTIVITY' },
  { label: 'Cart', to: '/my-dashboard/cart', icon: 'MdShoppingCart', badge: 'cart' },
  { label: 'Orders', to: '/my-dashboard/orders', icon: 'MdReceipt', badge: 'orders' },
  { label: 'Saved items', to: '/my-dashboard/wishlist', icon: 'MdFavoriteBorder', badge: 'wishlist' },
  { label: 'Reviews', to: '/my-dashboard/reviews', icon: 'MdRateReview' },
  { label: 'Product Requests', to: '/my-dashboard/requests', icon: 'MdHelpOutline' },
  { section: 'ACCOUNT' },
  { label: 'Addresses', to: '/my-dashboard/addresses', icon: 'MdLocationOn' },
  { label: 'Settings', to: '/my-dashboard/settings', icon: 'MdSettings' },
  { label: 'Become a Seller', to: '/seller-registration', icon: 'MdStorefront' },
];

/**
 * BUYER_BOTTOM_NAV — 5 items for the mobile bottom navigation bar.
 */
export const BUYER_BOTTOM_NAV = [
  { label: 'Home', to: '/my-dashboard', icon: 'MdDashboard', end: true },
  { label: 'Products', to: '/my-dashboard/marketplace', icon: 'MdShoppingBag' },
  { label: 'Shops', to: '/my-dashboard/shops', icon: 'MdStorefront' },
  { label: 'Orders', to: '/my-dashboard/orders', icon: 'MdReceipt' },
  { label: 'More', to: null, icon: 'MdMoreHoriz', action: 'openDrawer' },
];

export const BUYER_ACCOUNT_TABS = [
  { label: 'Overview', to: '/my-dashboard', end: true },
  { label: 'Orders', to: '/my-dashboard/orders' },
  { label: 'Saved items', to: '/my-dashboard/wishlist' },
  { label: 'Addresses', to: '/my-dashboard/addresses' },
  { label: 'Reviews', to: '/my-dashboard/reviews' },
  { label: 'Settings', to: '/my-dashboard/settings' },
];

export const BUYER_PROFILE_DROPDOWN = [
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
  { label: 'Revenue', to: '/business/revenue', icon: 'MdMoreHoriz' },
  { label: 'Transactions', to: '/business/transactions', icon: 'MdReceipt' },
  { label: 'Payment account application', to: '/business/settings?section=payments', icon: 'MdAccountBalanceWallet' },
  { section: 'STORE' },
  { label: 'Shops', to: '/business/shops', icon: 'MdStorefront' },
  { label: 'Reviews', to: '/business/reviews', icon: 'MdRateReview' },
  { section: 'SETTINGS' },
  { label: 'Settings', to: '/business/settings', icon: 'MdSettings' },
  { type: 'separator' },
  { type: 'logout' },
];
