# Domain Structure — Complete File-to-Domain Mapping

> Priority 3 — Updated to reflect actual implementation after Priority 1-3 cleanup.

---

## Public Website

**Purpose:** Landing page, marketing, curated discovery, marketplace entry point.
**Folder (target):** `src/public/`
**Accessible to:** Anyone (guests + authenticated users)
**Layout:** PublicLayout
**Header:** PublicHeader
**Footer:** Footer (shared)

### Pages

| File | Route | Function |
|---|---|---|
| `pages/home/HomePage.jsx` | / | Landing — hero, teasers, CTA |
| `pages/common/AboutPlatform.jsx` | /about | Platform info, mission, stats |
| `pages/common/HowItWorks.jsx` | /how-it-works | Role-tabbed guide |
| `pages/common/FAQpage.jsx` | /faq | FAQ accordion |
| `pages/public/NotFound.jsx` | * | 404 catch-all |

**REMOVED (dead duplicates):**
- `pages/public/HomePage.jsx` — merged into `pages/home/HomePage.jsx`
- `pages/common/FAQPage.jsx` — duplicate of FAQpage
- `pages/common/NotFound.jsx` — use `pages/public/NotFound.jsx`

### Components (homepage sections)

| File | Function |
|---|---|
| `components/home/Hero.jsx` | Animated hero with stats and CTAs |
| `components/home/Categories.jsx` | Horizontal category teaser |
| `components/home/FeaturedProducts.jsx` | 6-product teaser |
| `components/home/PopularShops.jsx` | 6-shop teaser |
| `components/home/Promotions.jsx` | Static deal cards |
| `components/home/PromoBanner.jsx` | Scrolling promo banner |

**REMOVED (dead):**
- `components/home/HowItWorks.jsx` — unimported
- `components/home/SellerCTA.jsx` — unimported

### Layouts & Headers

| File | Purpose |
|---|---|
| `components/layout/PublicLayout.jsx` | PublicHeader + Footer wrapper |
| `components/layout/PublicHeader.jsx` | Landing navigation |
| `components/layout/Footer.jsx` | Shared footer |

### Owns

- Landing page content
- Curated categories display
- Featured products display (top 6)
- Popular shops display
- Promotions/advertisements
- About content
- FAQ content
- Platform statistics

### Must NOT Own

- Full product catalog (that's Marketplace)
- Product detail logic
- Shop detail logic
- Shopping cart
- User accounts
- Business management

---

## Marketplace

**Purpose:** Product/shop/category/event discovery and catalog experience.
**Folder (target):** `src/marketplace/`
**Accessible to:** Full catalog = authenticated buyers; Curated = guests
**Layout:** DiscoveryHeader + Footer (inline per page)
**Header:** DiscoveryHeader
**Sidebar:** None

### Pages

| File | Route | Function |
|---|---|---|
| `pages/common/ProductsPage.jsx` | /products | Product listing with search+filters |
| `pages/common/ProductsMarketplace.jsx` | /explore/products | Product listing (Redux, sort, chips) |
| `pages/common/BestSellingPage.jsx` | /best-selling | Products sorted by sold count |
| `pages/common/ShopsPage.jsx` | /shops | Shop listing (API + Redux fallback) |
| `pages/common/ShopsMarketplace.jsx` | /explore/shops | Shop listing (Redux, sort) |
| `pages/common/ShopDetailsPage.jsx` | /shops/:id | Shop detail (API, grouped products) |
| `pages/common/CategoriesMarketplace.jsx` | /explore/categories | Category grid (real data from Redux) |
| `pages/common/EventsPage.jsx` | /events | Events (Redux, real data) |
| `pages/common/EventsMarketplace.jsx` | /explore/events | Events (real data from Redux) |
| `pages/common/ProductsDetailPage.jsx` | /product/:id | Rich detail (active, uses productService) |

**REMOVED (dead/broken):**
- `pages/common/ProductDetailPage.jsx` — broken, wrong Redux slice, unimported Header
- `pages/common/ShopDetailPage.jsx` — simple version, buggy
- `pages/common/CategoriesMarketplace.jsx` — was using mock data, now real
- `pages/common/EventsMarketplace.jsx` — was using mock data, now real

### Components

| File | Function | Domain |
|---|---|---|
| `components/marketplace/ProductCard.jsx` | Product card | Shared |
| `components/marketplace/ShopCard.jsx` | Shop card | Shared |
| `components/marketplace/ProductDetailsCard.jsx` | Quick-view modal | Shared |
| `components/marketplace/ProductDetail.jsx` | Full detail content | Marketplace |
| `components/marketplace/SuggestedProducts.jsx` | Related products | Marketplace |
| `components/marketplace/EventCard.jsx` | Event card | Marketplace |
| `components/marketplace/CountDown.jsx` | Event timer | Marketplace |

**REMOVED (dead/unimported):**
- `components/marketplace/FeaturedProducts.jsx`
- `components/marketplace/Categories.jsx`
- `components/marketplace/Events.jsx`
- `components/marketplace/Sponsored.jsx`
- `components/marketplace/BusinessModes.jsx`
- `components/marketplace/BusinessShowcase.jsx`
- `components/marketplace/MarketplaceBenefits.jsx`
- `components/marketplace/PlatformServices.jsx`
- `components/marketplace/Hero.jsx`
- `components/marketplace/HeroBanner.jsx`
- `components/marketplace/BestDeals.jsx`

### Owns

- Product listing and search
- Shop listing and discovery
- Category browsing
- Event browsing
- Product detail page
- Shop detail page
- Product quick-view modal
- Related product suggestions
- Product filtering and sorting

### Must NOT Own

- Cart management (Buyer)
- Order processing (Buyer)
- Product creation (Business)
- Shop creation (Business)
- Promotions/Deals creation (Business)
- Business analytics (Business)

---

## Buyer

**Purpose:** Authenticated customer experience — account, shopping, orders, profile.
**Folder (target):** `src/buyer/`
**Accessible to:** Authenticated buyers only
**Layout:** CustomerAccountLayout
**Header:** BuyerHeader
**Sidebar:** BuyerSidebar (via CustomerAccountSidebar delegate)

### Pages

| File | Route | Function |
|---|---|---|
| `pages/buyer/dashboard/CustomerAccountLayout.jsx` | /my-dashboard | Dashboard layout shell |
| `pages/buyer/dashboard/CustomerAccountSidebar.jsx` | /my-dashboard | Navigation sidebar (delegates) |
| `pages/buyer/dashboard/CustomerOverviewPage.jsx` | /my-dashboard | Dashboard home |
| `pages/buyer/profile/CustomerProfilePage.jsx` | /my-dashboard/profile | Profile editor |
| `pages/buyer/orders/CustomerOrdersPage.jsx` | /my-dashboard/orders | Order list |
| `pages/buyer/addresses/CustomerAddressesPage.jsx` | /my-dashboard/addresses | Address manager |
| `pages/buyer/wishlist/CustomerWishlistPage.jsx` | /my-dashboard/wishlist | Wishlist → cart |
| `pages/buyer/reviews/CustomerReviewsPage.jsx` | /my-dashboard/reviews | Reviews page |
| `pages/buyer/settings/CustomerSettingsPage.jsx` | /my-dashboard/settings | Settings |
| `pages/buyer/marketplace/DashboardProductsBrowse.jsx` | /my-dashboard/marketplace | Dashboard product browser |
| `pages/buyer/marketplace/DashboardShopsBrowse.jsx` | /my-dashboard/shops | Dashboard shop browser |
| `pages/buyer/checkout/CheckoutPage.jsx` | /checkout | Checkout form |
| `pages/buyer/checkout/OrderSuccessPage.jsx` | /order/success | Success page |
| `pages/buyer/payment/PaymentPage.jsx` | /payment | Payment processing |
| `pages/buyer/inbox/UserInbox.jsx` | /inbox | Messaging |
| `pages/buyer/order-tracking/UserOrderDetailPage.jsx` | /user/order/:id | Order detail |
| `pages/buyer/order-tracking/TrackOrderPage.jsx` | /user/track/order/:id | Order tracking |

### Key Components

| File | Function |
|---|---|
| `components/checkout/Checkout.jsx` | Checkout form with shipping + summary |
| `components/checkout/CheckOutSteps.jsx` | Step indicator |
| `components/payment/Payment.jsx` | Payment — uses orderService.createOrder() |
| `components/profile/ProfileContent.jsx` | Profile, orders, refunds, track, addresses |
| `components/profile/ProfileSidebar.jsx` | Profile sidebar navigation |
| `components/profile/TrackOrder.jsx` | Order status tracker |
| `components/profile/UserOrderDetailComponent.jsx` | Order detail view |
| `components/common/LocationSelector.jsx` | Region/City/Sector selector |

**REMOVED (dead):**
- `components/checkout/CheckOutSteps.jsx` — unimported

### Owns

- Buyer account management
- Shopping cart (Redux)
- Checkout process
- Payment initiation
- Order history and tracking
- Wishlist
- Reviews written by buyer
- Delivery addresses
- Profile and settings
- Messaging/inbox

### Must NOT Own

- Product management
- Inventory management
- Shop management
- Business analytics
- Seller operations
- Delivery operations
- Admin features

---

## Business / Seller

**Purpose:** Authenticated seller/business management — products, inventory, orders, analytics.
**Folder (target):** `src/business/`
**Accessible to:** Approved sellers only
**Layout:** CustomerAccountLayout (unified) + SellerLayout (legacy)
**Header:** BuyerHeader (unified) + DashboardHeader (legacy)
**Sidebar:** BusinessSidebar (unified) + SellerSidebar (legacy)

### Active Pages (Unified Dashboard — /my-dashboard/business/*)

| File | Route | Function |
|---|---|---|
| `pages/customer/account/business/BusinessProductsPage.jsx` | /my-dashboard/business/products | Shop products (thin wrapper) |
| `pages/customer/account/business/BusinessCreateProductPage.jsx` | /my-dashboard/business/products/create | Create product |
| `pages/customer/account/business/BusinessOrdersPage.jsx` | /my-dashboard/business/orders | Shop orders |
| `pages/customer/account/business/BusinessInventoryPage.jsx` | /my-dashboard/business/inventory | Inventory management |
| `pages/customer/account/business/BusinessAnalyticsPage.jsx` | /my-dashboard/business/analytics | Analytics dashboard |

### Active Pages (Legacy Seller Portal — /business/*)

| File | Route | Function |
|---|---|---|
| `seller/SellerLayout.jsx` | Seller pages | Seller layout shell |
| `seller/dashboard/SellerDashboardPage.jsx` | /business/dashboard | Seller dashboard |
| `seller/store/SellerStoreProfilePage.jsx` | /business/profile | Store profile editor |
| `seller/store/SellerStoreMetricsPage.jsx` | (indirect) | Store analytics |
| `seller/products/SellerProductsPage.jsx` | /business/products | Product list |
| `seller/products/SellerCreateProductPage.jsx` | /business/products/create | Create product |
| `seller/orders/SellerOrdersPage.jsx` | /business/orders | Order list |
| `seller/analytics/SellerAnalyticsPage.jsx` | /business/analytics | Analytics |
| `seller/sidebar/SellerSidebar.jsx` | Seller pages | Navigation sidebar |

### Seller Application

| File | Route | Function |
|---|---|---|
| `pages/seller/SellerApplicationPage.jsx` | /sell, /seller-application | Apply to become seller |

### Components

| File | Function |
|---|---|
| `seller/sidebar/SellerSidebar.jsx` | Active seller navigation |
| `components/seller/AllProductsOfASingleShop.jsx` | Shop product list with CRUD |
| `components/seller/AllOrdersOfASingleShop.jsx` | Shop order list |
| `components/seller/AllRefundOrders.jsx` | Refund order list |
| `components/seller/ShopInfo.jsx` | Shop info display |
| `components/seller/ShopProfileData.jsx` | Shop profile data |
| `components/seller/ShopSettings.jsx` | Shop settings |
| `components/seller/DashboardHero.jsx` | Dashboard stats hero |
| `components/seller/OrderDetails.jsx` | Order detail modal |
| `components/seller/DashboardMessages.jsx` | Seller messages |
| `components/seller/ShopSettings.jsx` | Shop settings |
| `components/seller/AllCoupouns.jsx` | Coupons list |
| `components/seller/CreateProduct.jsx` | Create product form |
| `components/seller/CreateEvent.jsx` | Create event form |
| `components/seller/AllEvents.jsx` | Events list |

**REMOVED (dead/duplicates):**
- `components/seller/SellerLayout.jsx` — duplicate of `src/seller/SellerLayout.jsx`
- `components/seller/DashboardSideBar.jsx` — unused duplicate sidebar
- All `pages/seller/` directory files except `SellerApplicationPage.jsx` and `ShopHomePage.jsx`

### Owns

- Business profile management
- Shop management (currently 1 shop per business — planned: multiple)
- Product management (CRUD)
- Inventory tracking
- Business orders
- Promotions and events
- Business analytics
- Business messages
- Business settings

### Must NOT Own

- Buyer account management
- Buyer cart/checkout
- Buyer order history (except business orders)
- Buyer wishlist
- Buyer reviews (can respond, not manage)
- Delivery operations
- Admin features

---

## Delivery

**Purpose:** Fulfillment — riders, assignments, tracking, zones.
**Folder (target):** `src/delivery/`
**Accessible to:** Admin + dispatchers (via Aritii-admin-web)
**Frontend UI:** NONE in frontend/ — managed by backend + admin web

### Current Delivery Code in Frontend

| File | Function |
|---|---|
| `services/location.service.js` | Delivery zone/location API calls |
| `services/address.service.js` | Buyer delivery addresses |
| `data/mockData.js` | Mock rider ecosystem stats |

### Delivery Domain (Backend)

| Service | Location | Handles |
|---|---|---|
| delivery-service | `services/delivery-service/` | Zones, routes, assignments, tracking, riders |
| api-gateway | `api-gateway/` | Routes delivery requests |

### Delivery Admin UI

| App | Location | Pages |
|---|---|---|
| Aritii-admin-web | `Aritii-admin-web/src/pages/delivery/` | Overview, Assignments, Assignment Detail, Routes, Zones |
| Aritii-admin-web | `Aritii-admin-web/src/pages/riders/` | Riders, Pending Riders, Rider Detail |

### Owns

- Delivery zone/location management
- Rider/actor management
- Order assignment to riders
- Real-time tracking
- Delivery history
- Provider configuration

### Must NOT Own

- User authentication
- Product management
- Shop management
- Buyer dashboard
- Payment processing
- Order creation (receives order ID only)
- Business analytics

---

## Shared Components

**Purpose:** Genuinely reusable functionality used across multiple domains.
**Folder (target):** `src/shared/`

### Current Shared Components (in components/common/)

| File | Used By | Domain |
|---|---|---|
| `BrandLogo.jsx` | All headers | Shared |
| `Loader.jsx` | App, HomeRoute | Shared |
| `ImageWithFallback.jsx` | Many components | Shared |
| `Ratings.jsx` | ShopCard, ProductCard, etc. | Shared |
| `ErrorBoundary.jsx` | App.jsx | Shared |
| `LocationSelector.jsx` | Checkout, SellerApplication | Shared (Buyer + Business) |

**REMOVED (dead):**
- `UnifiedHero.jsx` — unimported
- `UnifiedBusinessShowcase.jsx` — unimported

### Shared Services (in services/)

All services are shared by design — they serve all domains:
- `api.js` — core HTTP
- `auth.service.js` — authentication
- `product.service.js` — products (Marketplace + Business)
- `shop.service.js` — shops (Marketplace + Business)
- `order.service.js` — orders (Buyer + Business)
- `catalog.service.js` — categories, events (Public + Marketplace)
- `seller.service.js` — seller ops (Business)
- `address.service.js` — addresses (Buyer)
- `location.service.js` — delivery zones (Checkout + Delivery)

### Shared State (Redux slices)

- `user` — Buyer auth/session
- `seller` — Business auth/session
- `products` — Marketplace data
- `events` — Marketplace data
- `shop` — Marketplace data (separate shopsLoading/categoriesLoading)
- `cart` — Buyer shopping (uses `qty` not `quantity`)
- `wishlist` — Buyer wishlist
- `order` — Buyer/Business orders (separate buyerOrdersLoading/sellerOrdersLoading)

### Classification Rules

- A component is SHARED if 2+ unrelated domains use it
- Domain-specific components stay in their domain
- ProductCard is used by Marketplace + Buyer dashboard → Shared
- ShopCard is shared similarly
- BusinessProductCard (different display) → Business domain only

---

## File Count Summary

| Domain | Active Files | Removed/Deleted | Total |
|---|---|---|---|
| Public Website | ~20 | 3 | ~23 |
| Marketplace | ~35 | 15 | ~50 |
| Buyer | ~30 | 0 | ~30 |
| Business | ~35 | 25 | ~60 |
| Delivery | 2 (services only) | 0 | 2 |
| Shared | ~8 | 2 | ~10 |
| **Total** | **~130** | **~45** | **~175** |

Note: ~45 dead/duplicate files removed during Priority 1-3 cleanup.

---

## Final Architecture Summary

### Domain Separation Achieved

| Domain | Routes | Header | Sidebar | Layout |
|---|---|---|---|---|
| Public | `/`, `/about`, `/how-it-works`, `/faq` | PublicHeader | — | PublicLayout |
| Marketplace | `/products`, `/shops`, `/explore/*`, `/product/:id` | DiscoveryHeader | — | Inline |
| Buyer | `/my-dashboard/*`, `/checkout`, `/payment`, `/inbox`, `/user/order/*` | BuyerHeader | BuyerSidebar | CustomerAccountLayout |
| Business (Unified) | `/my-dashboard/business/*` | BuyerHeader | BusinessSidebar | CustomerAccountLayout |
| Business (Legacy) | `/business/*` | DashboardHeader | SellerSidebar | SellerLayout |
| Delivery | (none) | — | — | — |

### Authorization Enforcement

| Route Pattern | Guard |
|---|---|
| `/my-dashboard/*` | `ProtectedRoute` (requires auth) |
| `/checkout`, `/payment`, `/inbox`, `/user/order/*` | `ProtectedRoute` |
| `/my-dashboard/business/*` | `ProtectedRoute` + sidebar shows BusinessSidebar if `isSeller` |
| `/business/*` | `ProtectedRoute` + `SellerAuthRoute` (requires `isSeller`) |
| `/sell`, `/seller-application` | Public (leads to Business) |

### Header Ownership (No Cross-Domain Usage)

| Domain | Header | Routes |
|---|---|---|
| Public | PublicHeader | `/`, `/about`, `/how-it-works`, `/faq` |
| Marketplace | DiscoveryHeader | `/products`, `/shops`, `/explore/*`, `/product/:id`, `/events`, `/best-selling` |
| Buyer | BuyerHeader | `/my-dashboard/*`, `/checkout`, `/payment`, `/inbox`, `/user/order/*` |
| Business (Unified) | BuyerHeader | `/my-dashboard/business/*` |
| Business (Legacy) | DashboardHeader | `/business/*`, `/shop/:id` |
| Delivery | (none yet) | — |

### Sidebar Ownership (No Cross-Domain Usage)

| Domain | Sidebar | Routes |
|---|---|---|
| Buyer | BuyerSidebar | `/my-dashboard` (non-business routes) |
| Business (Unified) | BusinessSidebar | `/my-dashboard/business/*` |
| Business (Legacy) | SellerSidebar | `/business/*` |

---

**ADMIN WAS NOT TOUCHED** — `Aritii-admin-web/` remains completely separate.

---

**Last Updated:** September 2025  
**Priority 1-3 Complete**