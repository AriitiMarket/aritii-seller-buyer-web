# Routes — Complete Route Ownership Table

> Priority 3 — Updated to reflect actual implementation after Priority 1-3 cleanup.

---

## Public Website Routes

| Route | Page | Layout | Header | Sidebar | Auth | Auth Guard |
|---|---|---|---|---|---|---|
| / | HomePage (via HomeRoute) | PublicLayout | PublicHeader | None | No | None |
| /about | AboutPlatform | PublicLayout | PublicHeader | None | No | None |
| /how-it-works | HowItWorks | PublicLayout | PublicHeader | None | No | None |
| /faq | FAQpage | PublicLayout | PublicHeader | None | No | None |

---

## Marketplace Routes

| Route | Page | Layout | Header | Sidebar | Auth | Auth Guard |
|---|---|---|---|---|---|---|
| /products | ProductsPage | Inline | DiscoveryHeader | None | No | None |
| /best-selling | BestSellingPage | Inline | DiscoveryHeader | None | No | None |
| /events | EventsPage | Inline | DiscoveryHeader | None | No | None |
| /products | ProductsMarketplace | Inline | DiscoveryHeader | None | No | None |
| /shops | ShopsMarketplace | Inline | DiscoveryHeader | None | No | None |
| /categories | CategoriesMarketplace | Inline | DiscoveryHeader | None | No | None |
| /events | EventsMarketplace | Inline | DiscoveryHeader | None | No | None |
| /shops | ShopsPage | Inline | DiscoveryHeader | None | No | None |
| /shops/:id | ShopDetailsPage | Inline | DiscoveryHeader | None | No | None |
| /product/:id | ProductsDetailPage | Inline | DiscoveryHeader | None | No | None |

**REMOVED (conflicting):**
- `/product/:name` → ProductsDetailPage (shadowed by `/product/:id`, removed)

---

## Authentication Routes

| Route | Page | Layout | Header | Sidebar | Auth | Auth Guard |
|---|---|---|---|---|---|---|
| /login | LoginPage | Inline | PublicHeader | None | No | None |
| /sign-up | SignUpPage | Inline | PublicHeader | None | No | None |
| /create-shop | CreateShopPage | Inline | PublicHeader | None | No | None |
| /shop-login | ShopLoginPage | Inline | PublicHeader | None | No | None |
| /sell | SellerApplicationPage | Inline | DiscoveryHeader | None | No | None |
| /seller-application | SellerApplicationPage | Inline | DiscoveryHeader | None | No | None |

---

## Buyer Routes (ProtectedRoute)

| Route | Page | Layout | Header | Sidebar | Auth | Auth Guard |
|---|---|---|---|---|---|---|
| /checkout | CheckoutPage | Inline | BuyerHeader | None | Buyer | ProtectedRoute |
| /payment | PaymentPage | Inline | BuyerHeader | None | Buyer | ProtectedRoute |
| /order/success | OrderSuccessPage | Inline | BuyerHeader | None | Buyer | ProtectedRoute |
| /inbox | UserInbox | Inline | BuyerHeader | None | Buyer | ProtectedRoute |
| /user/order/:id | UserOrderDetailPage | Inline | BuyerHeader | None | Buyer | ProtectedRoute |
| /user/track/order/:id | TrackOrderPage | Inline | BuyerHeader | None | Buyer | ProtectedRoute |
| /my-dashboard | CustomerOverviewPage | CustomerAccountLayout | BuyerHeader | BuyerSidebar | Buyer | ProtectedRoute |
| /my-dashboard/profile | CustomerProfilePage | CustomerAccountLayout | BuyerHeader | BuyerSidebar | Buyer | ProtectedRoute |
| /my-dashboard/orders | CustomerOrdersPage | CustomerAccountLayout | BuyerHeader | BuyerSidebar | Buyer | ProtectedRoute |
| /my-dashboard/addresses | CustomerAddressesPage | CustomerAccountLayout | BuyerHeader | BuyerSidebar | Buyer | ProtectedRoute |
| /my-dashboard/wishlist | CustomerWishlistPage | CustomerAccountLayout | BuyerHeader | BuyerSidebar | Buyer | ProtectedRoute |
| /my-dashboard/reviews | CustomerReviewsPage | CustomerAccountLayout | BuyerHeader | BuyerSidebar | Buyer | ProtectedRoute |
| /my-dashboard/settings | CustomerSettingsPage | CustomerAccountLayout | BuyerHeader | BuyerSidebar | Buyer | ProtectedRoute |
| /my-dashboard/marketplace | DashboardProductsBrowse | CustomerAccountLayout | BuyerHeader | BuyerSidebar | Buyer | ProtectedRoute |
| /my-dashboard/shops | DashboardShopsBrowse | CustomerAccountLayout | BuyerHeader | BuyerSidebar | Buyer | ProtectedRoute |

---

## Business Routes — Unified Dashboard (ProtectedRoute, sidebar delegates to BusinessSidebar)

| Route | Page | Layout | Header | Sidebar | Auth | Auth Guard |
|---|---|---|---|---|---|---|
| /my-dashboard/business/products | BusinessProductsPage | CustomerAccountLayout | BuyerHeader | BusinessSidebar | Seller | ProtectedRoute |
| /my-dashboard/business/products/create | BusinessCreateProductPage | CustomerAccountLayout | BuyerHeader | BusinessSidebar | Seller | ProtectedRoute |
| /my-dashboard/business/orders | BusinessOrdersPage | CustomerAccountLayout | BuyerHeader | BusinessSidebar | Seller | ProtectedRoute |
| /my-dashboard/business/inventory | BusinessInventoryPage | CustomerAccountLayout | BuyerHeader | BusinessSidebar | Seller | ProtectedRoute |
| /my-dashboard/business/analytics | BusinessAnalyticsPage | CustomerAccountLayout | BuyerHeader | BusinessSidebar | Seller | ProtectedRoute |

**Note:** `CustomerAccountSidebar` delegates to `BusinessSidebar` when route starts with `/my-dashboard/business` AND `isSeller === true`. Backend authorization is the real security boundary.

---

## Business Routes — Legacy Seller Portal (ProtectedRoute + SellerAuthRoute)

| Route | Page | Layout | Header | Sidebar | Auth | Auth Guard |
|---|---|---|---|---|---|---|
| /business/dashboard | SellerDashboardPage | SellerLayout | DashboardHeader | SellerSidebar | Seller | ProtectedRoute + SellerAuthRoute |
| /business/profile | SellerStoreProfilePage | SellerLayout | DashboardHeader | SellerSidebar | Seller | ProtectedRoute + SellerAuthRoute |
| /business/products | SellerProductsPage | SellerLayout | DashboardHeader | SellerSidebar | Seller | ProtectedRoute + SellerAuthRoute |
| /business/products/create | SellerCreateProductPage | SellerLayout | DashboardHeader | SellerSidebar | Seller | ProtectedRoute + SellerAuthRoute |
| /business/orders | SellerOrdersPage | SellerLayout | DashboardHeader | SellerSidebar | Seller | ProtectedRoute + SellerAuthRoute |
| /business/analytics | SellerAnalyticsPage | SellerLayout | DashboardHeader | SellerSidebar | Seller | ProtectedRoute + SellerAuthRoute |
| /shop/:id | ShopHomePage | SellerLayout | DashboardHeader | SellerSidebar | Seller | SellerAuthRoute |

---

## Legacy Redirect Routes

| Legacy Route | Redirects To | Domain |
|---|---|---|
| /dashboard | /my-dashboard | Buyer |
| /dashboard-create-product | /my-dashboard/business/products/create | Business |
| /dashboard-products | /my-dashboard/business/products | Business |
| /dashboard-product/:id | /my-dashboard/business/products | Business |
| /dashboard-edit-product/:id | /my-dashboard/business/products | Business |
| /dashboard-create-event | /my-dashboard | Buyer |
| /dashboard-events | /my-dashboard | Buyer |
| /dashboard-promotions | /my-dashboard | Buyer |
| /dashboard-coupons | /my-dashboard | Buyer |
| /dashboard-orders | /my-dashboard/business/orders | Business |
| /dashboard-refunds | /my-dashboard/business/orders | Business |
| /order/:id | /my-dashboard/orders | Buyer |
| /settings | /my-dashboard/settings | Buyer |
| /dashboard-messages | /inbox | Buyer |
| /dashboard-store-profile | /my-dashboard/business/products | Business |
| /dashboard-store-metrics | /my-dashboard/business/analytics | Business |
| /dashboard-order-history | /my-dashboard/orders | Buyer |
| /dashboard-inventory | /my-dashboard/business/inventory | Business |
| /dashboard-analytics | /my-dashboard/business/analytics | Business |
| /create-shop | /sell | Auth |
| /shop-login | /login | Auth |
| /profile | /my-dashboard/profile | Buyer |

---

## 404

| Route | Page | Layout | Header | Auth |
|---|---|---|---|---|
| * | NotFound (pages/public/NotFound.jsx) | PublicLayout | PublicHeader | No |

---

## Route Count Summary

| Domain | Active Routes | Legacy Redirects | Dead/Removed |
|---|---|---|---|
| Public Website | 4 | 0 | 3 (HomePage dup, NotFound dup, FAQPage dup) |
| Marketplace | 11 | 0 | 2 (ProductDetailPage, ShopDetailPage) |
| Auth | 6 | 2 (create-shop→sell, shop-login→login) | 0 |
| Buyer | 15 | 0 | 0 |
| Business (Unified) | 5 | 0 | 0 |
| Business (Legacy) | 7 | 0 | 0 |
| 404 | 1 | 0 | 0 |
| **Total** | **~42** | **~21** | **~5 removed** |

---

## Conflict Resolution Summary

| Conflict | Resolution |
|---|---|
| Product detail `/product/:id` vs `/product/:name` | Kept `/product/:id` → ProductsDetailPage. Removed `/product/:name` route. ProductsDetailPage now uses `const { id } = useParams()` |
| HomePage duplicates | Kept `pages/home/HomePage.jsx` (active). Removed `pages/public/HomePage.jsx` (dead) |
| NotFound duplicates | Kept `pages/public/NotFound.jsx` (routed). Removed `pages/common/NotFound.jsx` (dead) |
| FAQ duplicates | Kept `FAQpage.jsx` (lowercase, routed). Removed `FAQPage.jsx` (dead) |
| SellerApplicationPage duplicates | Both `/sell` and `/seller-application` route to same page — kept both for UX |
| Shop detail `/shops/:id` vs `/shop/:id` | Different auth: `/shops/:id` public (ShopDetailsPage), `/shop/:id` seller-only (ShopHomePage) — kept both |
| Legacy `/dashboard-*` routes | All redirected to `/my-dashboard/*` equivalents |
| Legacy `/business/*` routes | Kept working via legacy seller portal (SellerLayout + SellerAuthRoute) |

---

## Route Ownership by Domain

| Domain | Routes Count | Primary Header | Primary Sidebar | Primary Layout |
|---|---|---|---|---|
| Public | 4 | PublicHeader | — | PublicLayout |
| Marketplace | 11 | DiscoveryHeader | — | Inline (DiscoveryHeader + Footer) |
| Auth | 6 | PublicHeader/DiscoveryHeader | — | Inline |
| Buyer | 15 | BuyerHeader | BuyerSidebar | CustomerAccountLayout |
| Business (Unified) | 5 | BuyerHeader | BusinessSidebar | CustomerAccountLayout |
| Business (Legacy) | 7 | DashboardHeader | SellerSidebar | SellerLayout |
| **Total** | **~47** | | | |
## Delivery boundary

The customer frontend does not expose rider/provider delivery routes yet. Buyer delivery visibility is limited to `/user/track/order/:id`; delivery operations belong to a future feature or separate application.
