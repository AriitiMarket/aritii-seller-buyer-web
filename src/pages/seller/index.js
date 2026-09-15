// Re-export seller pages from the authoritative /src/seller/ directory
// This maintains backward compatibility while organizing pages

export { default as SellerApplicationPage } from './SellerApplicationPage'
export { default as ShopHomePage } from './ShopHomePage'

// These are imported from the /src/seller/ directory
export {
  SellerDashboardPage,
  SellerStoreProfilePage,
  SellerStoreMetricsPage,
  SellerProductsPage,
  SellerCreateProductPage,
  SellerProductDetailPage,
  SellerEditProductPage,
  SellerOrdersPage,
  SellerOrderDetailPage,
  SellerOrderHistoryPage,
  SellerRefundsPage,
  SellerInventoryPage,
  SellerAnalyticsPage,
  SellerInboxPage,
  SellerCreateEventPage,
  SellerEventsPage,
  SellerCouponsPage,
  SellerSettingsPage,
} from '../../seller/index.js'
