// Auth Pages
import LoginPage from '../pages/auth/Login.jsx'
import SignUpPage from '../pages/auth/SignUp.jsx'
import CreateShopPage from '../pages/auth/CreateShopPage.jsx'
import ShopLoginPage from '../pages/auth/ShopLoginPage.jsx'

// Public Marketplace Pages
import { HomePage, NotFound } from '../pages/public/index.js'

// Common Marketplace Pages (shared by all users)
import {
  ProductsPage,
  BestSellingPage,
  ProductsDetailPage,
  ShopDetailsPage,
  EventsPage,
  FAQpage,
  AboutPlatform,
  HowItWorks,
  ProductsMarketplace,
  ShopsMarketplace,
  CategoriesMarketplace,
  EventsMarketplace,
  ProductDetailPage,
  ShopDetailPage,
} from '../pages/common/index.js'

// Buyer Pages
import {
  CheckoutPage,
  PaymentPage,
  OrderSuccessPage,
  UserOrderDetailPage,
  TrackOrderPage,
  UserInbox,
} from '../pages/buyer/index.js'

// Legacy exports (ProfilePage kept for backward compatibility)
import ProfilePage from '../pages/customer/ProfilePage.jsx'

export {
  // Auth
  LoginPage,
  SignUpPage,
  CreateShopPage,
  ShopLoginPage,

  // Public
  HomePage,
  NotFound,

  // Common Marketplace
  ProductsPage,
  BestSellingPage,
  ProductsDetailPage,
  ShopDetailsPage,
  EventsPage,
  FAQpage,
  AboutPlatform,
  HowItWorks,
  ProductDetailPage,
  ShopDetailPage,
  ProductsMarketplace,
  ShopsMarketplace,
  CategoriesMarketplace,
  EventsMarketplace,

  // Buyer
  CheckoutPage,
  PaymentPage,
  OrderSuccessPage,
  UserOrderDetailPage,
  TrackOrderPage,
  UserInbox,

  // Legacy
  ProfilePage,
}
