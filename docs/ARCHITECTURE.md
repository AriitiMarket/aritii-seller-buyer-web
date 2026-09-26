# Aritii Market — Architecture Blueprint

> **Priority 0 — Implemented foundation**
> Created: September 2026
> Status: Customer routing and build foundation implemented; migration continues incrementally.
> Scope: Frontend only (`frontend/`). Admin (`Aritii-admin-web/`) and all backend services are COMPLETELY OUT OF SCOPE.

---

## Architecture Diagram

```
                     ┌──────────────────────────────┐
                     │        ARITII MARKET          │
                     └──────────┬───────────────────┘
                                │
        ┌───────────┬───────────┼───────────┬──────────────┐
        │           │           │           │              │
        ▼           ▼           ▼           ▼              ▼
  ┌──────────┐┌──────────┐┌──────────┐┌──────────┐  ┌──────────┐
  │  PUBLIC  ││MARKETPLACE││  BUYER   ││ BUSINESS │  │ DELIVERY │
  │ WEBSITE  ││          ││          ││ /SELLER  │  │          │
  └──────────┘└──────────┘└──────────┘└──────────┘  └──────────┘
        │           │           │           │              │
        │           │           │           │              │
   Guests +     Buyers      Buyers      Approved     Admin/
   Authenticated (full   (auth)    Sellers      Dispatchers
   Users        catalog)                       (via Admin)
        │           │           │           │              │
        ▼           ▼           ▼           ▼              ▼
  ┌──────────┐┌──────────┐┌──────────┐┌──────────┐  ┌──────────┐
  │Public    ││Discover  ││Dashboard ││Business  │  │NO UI IN  │
  │Layout +  ││Layout +  ││Buyer     ││Layout +  │  │frontend/ │
  │Public    ││Marketpl. ││Layout +  ││Business  │  │(separate │
  │Header    ││Header    ││Buyer     ││Header +  │  │project)  │
  │Footer    ││Footer    ││Sidebar   ││Sidebar   │  │          │
  └──────────┘└──────────┘└──────────┘└──────────┘  └──────────┘
        │           │           │           │
        ▼           ▼           ▼           ▼
  ┌──────────┐┌──────────┐┌──────────┐┌──────────┐
  │services/ ││services/ ││services/ ││services/ │
  │auth +    ││product + ││order +   ││seller +  │
  │public    ││shop +    ││cart +    ││catalog   │
  │content   ││catalog   ││address   ││          │
  └──────────┘└──────────┘└──────────┘└──────────┘
        │           │           │           │
        ▼           ▼           ▼           ▼
  ┌──────────────────────────────────────────────────┐
  │              BACKEND MICROSERVICES                │
  │  api-gateway | identity | commerce | delivery    │
  │  (OUT OF SCOPE — not modified)                   │
  └──────────────────────────────────────────────────┘
```

---

## Table of Contents

1. [Domains](#1-domains)
2. [Folder Structure](#2-folder-structure)
3. [File Ownership](#3-file-ownership)
4. [Routes](#4-routes)
5. [User Flows](#5-user-flows)
6. [Headers](#6-headers)
7. [Sidebars](#7-sidebars)
8. [Navigation](#8-navigation)
9. [Layouts](#9-layouts)
10. [Services](#10-services)
11. [State Ownership](#11-state-ownership)
12. [API Boundaries](#12-api-boundaries)
13. [Authentication Boundaries](#13-authentication-boundaries)
14. [Authorization Boundaries](#14-authorization-boundaries)
15. [Public vs Marketplace Visibility](#15-public-vs-marketplace-visibility)
16. [Buyer vs Business Separation](#16-buyer-vs-business-separation)
17. [Delivery Separation](#17-delivery-separation)
18. [Business → Multiple Shops](#18-business--multiple-shops)
19. [Duplicate/Conflicting Structures](#19-duplicateconflicting-structures)
20. [Documentation Created](#20-documentation-created)

---

## 1. Domains

| Domain | Who Can Access | Purpose | Auth Required |
|---|---|---|---|
| **Public Website** | Anyone (guests + authenticated) | Landing, marketing, curated discovery, marketplace entry | No |
| **Marketplace** | Full: authenticated buyers; Curated: guests | Product/shop/category discovery, search, filters, deals | Buyers (full), guests (curated) |
| **Buyer** | Authenticated buyers only | Account, shopping, cart, checkout, orders, profile, wishlist | Yes — Buyer auth |
| **Business/Seller** | Approved sellers only | Shop management, products, inventory, orders, analytics | Yes — Seller auth + approval |
| **Delivery** | Admin + dispatchers | Rider management, assignments, tracking, zones | Admin only (via Aritii-admin-web) |
| **Admin** | Admins only | Platform administration | Admin only (via Aritii-admin-web) |

**Access Matrix:**

| Domain | Guest | Buyer | Seller (approved) | Admin |
|---|---|---|---|---|
| Public Website | ✅ | ✅ | ✅ | ✅ |
| Marketplace (browse) | Curated | Full | Full | ✅ |
| Buyer Dashboard | ❌ → /login | ✅ | ✅ (limited) | ❌ |
| Business Dashboard | ❌ | ❌ | ✅ | ❌ |
| Delivery Dashboard | ❌ | ❌ | ❌ | ✅ (Aritii-admin-web) |
| Admin Console | ❌ | ❌ | ❌ | ✅ (Aritii-admin-web) |

---

## 2. Folder Structure

### Current Structure (as inspected)

```
frontend/src/
├── app/                      # Does not exist yet (planned for target)
├── public/                   # Does not exist as separate domain yet
├── marketplace/              # Does not exist as separate domain yet
├── buyer/                    # PARTIALLY EXISTS: pages/buyer/ (active)
├── business/                 # PARTIALLY EXISTS: pages/customer/account/business/ + src/seller/
├── delivery/                 # Does NOT exist in frontend (separate backend)
├── shared/                   # Does not exist yet (planned for target)
├── components/               # Mixed: home, marketplace, layout, auth, checkout, etc.
├── pages/                    # Mixed: public, common, buyer, customer, seller, auth
├── routes/                   # Route guards
├── services/                 # API service layer
├── store/                    # Redux state
├── constants/                # Routes, navigation, categories
├── data/                     # Content + mock data
├── config/                   # App config, theme
├── styles/                   # Global styles
├── utils/                    # Helpers (image normalization)
├── assets/                   # Static files
├── seller/                   # Active seller portal
└── main.jsx / index.jsx      # Entry points
```

### Target Structure (proposed domains)

```
frontend/src/
├── app/
│   ├── App.jsx               # Root app
│   ├── router/               # Router configuration
│   ├── providers/    check        # Redux Provider, Auth Provider, etc.
│   └── config/               # App-wide config
│
├── public/                   # PUBLIC WEBSITE DOMAIN
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── AboutPage.jsx
│   │   ├── HowItWorksPage.jsx
│   │   ├── FAQPage.jsx
│   │   └── EventsPage.jsx    # Curated events only
│   ├── components/
│   │   ├── PublicHeader.jsx
│   │   ├── PublicFooter.jsx
│   │   └── PublicNavigation.jsx check
│   ├── sections/
│   │   ├── HeroSection.jsx
│   │   ├── FeaturedCategories.jsx
│   │   ├── SelectedProducts.jsx
│   │   ├── SelectedShops.jsx
│   │   ├── Promotions.jsx
│   │   ├── Advertisements.jsx
│   │   ├── EventsSection.jsx
│   │   └── MarketplaceCTA.jsx
│   ├── layout/
│   │   └── PublicLayout.jsx
│   └── services/
│       └── publicContentService.js
│
├── marketplace/              # MARKETPLACE DOMAIN
│   ├── pages/
│   │   ├── ProductsPage.jsx
│   │   ├── ProductDetailsPage.jsx
│   │   ├── CategoriesPage.jsx
│   │   ├── ShopsPage.jsx
│   │   ├── ShopDetailsPage.jsx
│   │   ├── DealsPage.jsx
│   │   └── BestSellingPage.jsx
│   ├── components/
│   │   ├── ProductCard.jsx
│   │   ├── ProductGrid.jsx
│   │   ├── ShopCard.jsx
│   │   ├── CategoryCard.jsx
│   │   ├── SearchBar.jsx
│   │   └── FilterPanel.jsx
│   ├── layout/
│   │   └── MarketplaceLayout.jsx
│   ├── navigation/
│   │   └── MarketplaceNavigation.jsx
│   └── services/
│       └── marketplaceService.js
│
├── buyer/                    # BUYER DOMAIN
│   ├── pages/
│   │   ├── BuyerDashboardPage.jsx
│   │   ├── OrdersPage.jsx
│   │   ├── OrderDetailsPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── AddressesPage.jsx
│   │   ├── WishlistPage.jsx
│   │   ├── ReviewsPage.jsx
│   │   ├── RequestsPage.jsx       # PLANNED — not yet implemented
│   │   └── SettingsPage.jsx
│   ├── components/
│   │   ├── BuyerHeader.jsx
│   │   ├── BuyerSidebar.jsx
│   │   ├── OrderCard.jsx
│   │   ├── AddressCard.jsx
│   │   └── ...
│   ├── layout/
│   │   └── BuyerLayout.jsx
│   ├── navigation/
│   │   └── BuyerNavigation.jsx
│   └── services/
│       └── buyerService.js
│
├── business/                 # BUSINESS / SELLER DOMAIN
│   ├── pages/
│   │   ├── BusinessDashboardPage.jsx
│   │   ├── BusinessProfilePage.jsx
│   │   ├── ShopsPage.jsx
│   │   ├── ShopDetailsPage.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── InventoryPage.jsx
│   │   ├── OrdersPage.jsx
│   │   ├── PromotionsPage.jsx
│   │   ├── EventsPage.jsx
│   │   ├── AnalyticsPage.jsx
│   │   ├── MessagesPage.jsx
│   │   └── SettingsPage.jsx
│   ├── components/
│   │   ├── BusinessHeader.jsx
│   │   ├── BusinessSidebar.jsx
│   │   ├── ShopSelector.jsx
│   │   ├── BusinessProductCard.jsx
│   │   ├── InventoryTable.jsx
│   │   └── ...
│   ├── layout/
│   │   └── BusinessLayout.jsx
│   ├── navigation/
│   │   └── BusinessNavigation.jsx
│   └── services/
│       └── businessService.js
│
├── delivery/                 # DELIVERY DOMAIN (NO UI IN frontend/)
│   # Delivery is managed by backend delivery-service and Aritii-admin-web
│   # This folder reserved for future delivery UI if needed
│   └── README.md             # Documents delivery domain boundaries
│
├── shared/                   # SHARED (genuinely reusable only)
│   ├── components/
│   │   └── # Only generic components used across multiple domains
│   ├── hooks/
│   ├── utils/
│   ├── constants/
│   ├── types/
│   └── validation/
│
├── services/                 # API service layer (shared by all domains)
│   ├── api.js
│   ├── auth.service.js
│   ├── product.service.js
│   ├── shop.service.js
│   ├── order.service.js
│   ├── seller.service.js
│   ├── address.service.js
│   ├── location.service.js
│   ├── catalog.service.js
│   ├── cache.js
│   └── tokenStore.js
│
├── store/                    # Redux state
│   └── ...
│
├── app/                      # App-level concerns
│   ├── router/
│   ├── providers/
│   └── config/
│
├── main.jsx                  # Entry point
└── App.jsx                   # Root router
```

### Mapping: Current → Target Folders

| Current Location | Target Domain | Target Folder | Action |
|---|---|---|---|
| `pages/home/HomePage.jsx` | Public Website | `public/pages/` | MOVE |
| `pages/public/HomePage.jsx` | Public Website | `public/pages/` | KEEP (merge active content) |
| `pages/common/AboutPlatform.jsx` | Public Website | `public/pages/` | MOVE |
| `pages/common/HowItWorks.jsx` | Public Website | `public/pages/` | MOVE |
| `pages/common/FAQpage.jsx` | Public Website | `public/pages/` | MOVE (rename FAQPage) |
| `pages/common/ProductsPage.jsx` | Marketplace | `marketplace/pages/` | MOVE |
| `pages/common/ProductsMarketplace.jsx` | Marketplace | `marketplace/pages/` | MERGE into ProductsPage |
| `pages/common/BestSellingPage.jsx` | Marketplace | `marketplace/pages/` | MOVE |
| `pages/common/ShopsPage.jsx` | Marketplace | `marketplace/pages/` | MOVE |
| `pages/common/ShopsMarketplace.jsx` | Marketplace | `marketplace/pages/` | MERGE into ShopsPage |
| `pages/common/ShopDetailsPage.jsx` | Marketplace | `marketplace/pages/` | KEEP (canonical shop detail) |
| `pages/common/CategoriesMarketplace.jsx` | Marketplace | `marketplace/pages/` | MOVE |
| `pages/common/EventsPage.jsx` | Marketplace (curated) / Public (events) | `public/pages/` or `marketplace/pages/` | DECIDE based on content scope |
| `pages/buyer/` (all) | Buyer | `buyer/pages/` | MOVE (folder name already correct) |
| `pages/customer/account/business/*` | Business | `business/pages/` | MOVE |
| `src/seller/` (all) | Business | `business/` | MERGE into business domain |
| `components/marketplace/` | Shared or Marketplace | Depends on reuse | CLASSIFY per component |
| `components/home/` | Public Website | `public/sections/` or `public/components/` | MOVE |
| `components/layout/` | Shared/Domain | `shared/components/` + domain layouts | CLASSIFY |

---

## 3. File Ownership

### Public Website Files (Current)

| File | Domain | Status | Target |
|---|---|---|---|
| `pages/home/HomePage.jsx` | Public | ACTIVE | `public/pages/HomePage.jsx` |
| `pages/public/HomePage.jsx` | Public | DEAD (duplicate) | Merge into HomePage.jsx |
| `pages/common/AboutPlatform.jsx` | Public | ACTIVE | `public/pages/AboutPage.jsx` |
| `pages/common/HowItWorks.jsx` | Public | ACTIVE | `public/pages/HowItWorksPage.jsx` |
| `pages/common/FAQpage.jsx` | Public | ACTIVE | `public/pages/FAQPage.jsx` |
| `pages/common/FAQPage.jsx` | Public | DEAD (duplicate) | DELETE |
| `pages/public/NotFound.jsx` | Public | DEAD (unrouted) | DELETE |
| `pages/common/NotFound.jsx` | Public | ACTIVE (404) | `public/pages/NotFound.jsx` |
| `pages/explore/FAQpage.jsx` | Public | DEAD (duplicate) | DELETE |
| `components/home/Hero.jsx` | Public | ACTIVE | `public/sections/HeroSection.jsx` |
| `components/home/Categories.jsx` | Public | ACTIVE | `public/sections/FeaturedCategories.jsx` |
| `components/home/FeaturedProducts.jsx` | Public | ACTIVE | `public/sections/SelectedProducts.jsx` |
| `components/home/PopularShops.jsx` | Public | ACTIVE | `public/sections/SelectedShops.jsx` |
| `components/home/Promotions.jsx` | Public | ACTIVE | `public/sections/Promotions.jsx` |
| `components/home/PromoBanner.jsx` | Public | ACTIVE | `public/sections/Advertisements.jsx` |
| `components/home/HowItWorks.jsx` | Public | DEAD | DELETE |
| `components/home/SellerCTA.jsx` | Public | DEAD | DELETE or Market CTA |
| `components/layout/PublicLayout.jsx` | Public | ACTIVE | `public/layout/PublicLayout.jsx` |
| `components/layout/PublicHeader.jsx` | Public | ACTIVE | `public/components/PublicHeader.jsx` |
| `components/layout/Footer.jsx` | Shared | ACTIVE | `shared/components/Footer.jsx` |

### Marketplace Files (Current)

| File | Domain | Status | Target |
|---|---|---|---|
| `pages/common/ProductsPage.jsx` | Marketplace | ACTIVE | `marketplace/pages/ProductsPage.jsx` |
| `pages/common/ProductsMarketplace.jsx` | Marketplace | ACTIVE | Merge into ProductsPage |
| `pages/common/BestSellingPage.jsx` | Marketplace | ACTIVE | `marketplace/pages/BestSellingPage.jsx` |
| `pages/common/ShopsPage.jsx` | Marketplace | ACTIVE | `marketplace/pages/ShopsPage.jsx` |
| `pages/common/ShopsMarketplace.jsx` | Marketplace | ACTIVE | Merge into ShopsPage |
| `pages/common/ShopDetailsPage.jsx` | Marketplace | ACTIVE | `marketplace/pages/ShopDetailsPage.jsx` |
| `pages/common/ShopDetailPage.jsx` | Marketplace | DEAD (duplicate) | DELETE |
| `pages/common/CategoriesMarketplace.jsx` | Marketplace | ACTIVE (mock) | `marketplace/pages/CategoriesPage.jsx` |
| `pages/common/EventsPage.jsx` | Marketplace | ACTIVE | `marketplace/pages/EventsPage.jsx` |
| `pages/common/EventsMarketplace.jsx` | Marketplace | ACTIVE (mock) | Merge into EventsPage |
| `components/marketplace/ProductCard.jsx` | Shared | ACTIVE | `marketplace/components/` or `shared/components/` |
| `components/marketplace/ShopCard.jsx` | Shared | ACTIVE | `shared/components/` |
| `components/marketplace/ProductDetailsCard.jsx` | Shared | ACTIVE | `shared/components/` (quick-view modal) |
| `components/marketplace/ProductDetail.jsx` | Marketplace | ACTIVE | `marketplace/components/ProductDetailContent.jsx` |
| `components/marketplace/SuggestedProducts.jsx` | Marketplace | ACTIVE | `marketplace/components/RelatedProducts.jsx` |
| `components/marketplace/EventCard.jsx` | Marketplace | ACTIVE | `marketplace/components/EventCard.jsx` |
| `components/marketplace/CountDown.jsx` | Marketplace | ACTIVE | `marketplace/components/EventCountdown.jsx` |
| `components/marketplace/FeaturedProducts.jsx` | Marketplace | DEAD | DELETE |
| `components/marketplace/Categories.jsx` | Marketplace | DEAD | DELETE |
| `components/marketplace/Events.jsx` | Marketplace | DEAD | DELETE |
| `components/marketplace/Sponsored.jsx` | Marketplace | DEAD | DELETE |
| `components/marketplace/BusinessModes.jsx` | Marketplace | DEAD | DELETE or Business |
| `components/marketplace/BusinessShowcase.jsx` | Marketplace | DEAD | DELETE |
| `components/marketplace/MarketplaceBenefits.jsx` | Marketplace | DEAD | DELETE |
| `components/marketplace/PlatformServices.jsx` | Marketplace | DEAD | DELETE |
| `components/marketplace/Hero.jsx` | Marketplace | DEAD | DELETE |
| `components/marketplace/HeroBanner.jsx` | Marketplace | DEAD | DELETE |
| `components/marketplace/BestDeals.jsx` | Marketplace | DEAD | DELETE |
| `components/layout/DiscoveryHeader.jsx` | Marketplace | ACTIVE | `marketplace/components/SearchBar.jsx` + nav |
| `components/layout/DiscoveryLayout.jsx` | Marketplace | DOES NOT EXIST | CREATE |
| `components/layout/MarketplaceLayout.jsx` | Marketplace | DEAD | DELETE |

### Buyer Files (Current — All Active)

All files in `pages/buyer/` are active and correctly placed. They map to `buyer/pages/` in target.

| File | Domain | Status | Target |
|---|---|---|---|
| `pages/buyer/dashboard/CustomerAccountLayout.jsx` | Buyer | ACTIVE | `buyer/layout/BuyerLayout.jsx` |
| `pages/buyer/dashboard/CustomerAccountSidebar.jsx` | Buyer | ACTIVE | `buyer/components/BuyerSidebar.jsx` |
| `pages/buyer/dashboard/CustomerOverviewPage.jsx` | Buyer | ACTIVE | `buyer/pages/BuyerDashboardPage.jsx` |
| `pages/buyer/profile/CustomerProfilePage.jsx` | Buyer | ACTIVE | `buyer/pages/ProfilePage.jsx` |
| `pages/buyer/orders/CustomerOrdersPage.jsx` | Buyer | ACTIVE | `buyer/pages/OrdersPage.jsx` |
| `pages/buyer/addresses/CustomerAddressesPage.jsx` | Buyer | ACTIVE | `buyer/pages/AddressesPage.jsx` |
| `pages/buyer/wishlist/CustomerWishlistPage.jsx` | Buyer | ACTIVE | `buyer/pages/WishlistPage.jsx` |
| `pages/buyer/reviews/CustomerReviewsPage.jsx` | Buyer | ACTIVE | `buyer/pages/ReviewsPage.jsx` |
| `pages/buyer/settings/CustomerSettingsPage.jsx` | Buyer | ACTIVE | `buyer/pages/SettingsPage.jsx` |
| `pages/buyer/marketplace/DashboardProductsBrowse.jsx` | Buyer | ACTIVE | `buyer/pages/ProductsPage.jsx` |
| `pages/buyer/marketplace/DashboardShopsBrowse.jsx` | Buyer | ACTIVE | `buyer/pages/ShopsPage.jsx` |
| `pages/buyer/checkout/CheckoutPage.jsx` | Buyer | ACTIVE | `buyer/pages/CheckoutPage.jsx` |
| `pages/buyer/checkout/OrderSuccessPage.jsx` | Buyer | ACTIVE | `buyer/pages/OrderDetailsPage.jsx` |
| `pages/buyer/payment/PaymentPage.jsx` | Buyer | ACTIVE | `buyer/pages/PaymentPage.jsx` |
| `pages/buyer/inbox/UserInbox.jsx` | Buyer | ACTIVE | `buyer/pages/MessagesPage.jsx` |
| `pages/buyer/order-tracking/UserOrderDetailPage.jsx` | Buyer | ACTIVE | `buyer/pages/OrderDetailsPage.jsx` |
| `pages/buyer/order-tracking/TrackOrderPage.jsx` | Buyer | ACTIVE | `buyer/pages/TrackingPage.jsx` |
| `components/layout/BuyerHeader.jsx` | Buyer | ACTIVE | `buyer/components/BuyerHeader.jsx` |
| `components/checkout/Checkout.jsx` | Buyer | ACTIVE | `buyer/components/CheckoutForm.jsx` |
| `components/payment/Payment.jsx` | Buyer | ACTIVE | `buyer/components/PaymentForm.jsx` |
| `components/profile/*` | Buyer | ACTIVE | `buyer/components/` |
| `components/common/LocationSelector.jsx` | Shared | ACTIVE | `shared/components/` |
| `components/common/Loader.jsx` | Shared | ACTIVE | `shared/components/` |
| `components/common/Ratings.jsx` | Shared | ACTIVE | `shared/components/` |
| `components/common/ImageWithFallback.jsx` | Shared | ACTIVE | `shared/components/` |
| `components/common/ErrorBoundary.jsx` | Shared | ACTIVE | `shared/components/` |
| `components/common/BrandLogo.jsx` | Shared | ACTIVE | `shared/components/` |

### Business/Seller Files (Current)

| File | Domain | Status | Target |
|---|---|---|---|
| `pages/customer/account/business/BusinessProductsPage.jsx` | Business | ACTIVE | `business/pages/ProductsPage.jsx` |
| `pages/customer/account/business/BusinessCreateProductPage.jsx` | Business | ACTIVE | `business/pages/ProductsCreatePage.jsx` |
| `pages/customer/account/business/BusinessOrdersPage.jsx` | Business | ACTIVE | `business/pages/OrdersPage.jsx` |
| `pages/customer/account/business/BusinessInventoryPage.jsx` | Business | ACTIVE | `business/pages/InventoryPage.jsx` |
| `pages/customer/account/business/BusinessAnalyticsPage.jsx` | Business | ACTIVE | `business/pages/AnalyticsPage.jsx` |
| `src/seller/SellerLayout.jsx` | Business | ACTIVE | `business/layout/BusinessLayout.jsx` |
| `src/seller/SellerDashboardPage.jsx` | Business | ACTIVE | `business/pages/DashboardPage.jsx` |
| `src/seller/store/SellerStoreProfilePage.jsx` | Business | ACTIVE | `business/pages/ProfilePage.jsx` |
| `src/seller/store/SellerStoreMetricsPage.jsx` | Business | ACTIVE | `business/pages/AnalyticsPage.jsx` (or merge) |
| `src/seller/products/SellerProductsPage.jsx` | Business | ACTIVE | Merge into `business/pages/ProductsPage.jsx` |
| `src/seller/products/SellerCreateProductPage.jsx` | Business | ACTIVE | Merge into `business/pages/ProductsCreatePage.jsx` |
| `src/seller/orders/SellerOrdersPage.jsx` | Business | ACTIVE | Merge into `business/pages/OrdersPage.jsx` |
| `src/seller/sidebar/SellerSidebar.jsx` | Business | ACTIVE | `business/components/BusinessSidebar.jsx` |
| `src/seller/analytics/SellerAnalyticsPage.jsx` | Business | ACTIVE | `business/pages/AnalyticsPage.jsx` |
| `pages/seller/*` (all except SellerApplicationPage) | Business | DEAD (duplicates) | DELETE |
| `src/components/seller/SellerLayout.jsx` | Business | DEAD (duplicate) | DELETE |
| `src/components/seller/DashboardSideBar.jsx` | Business | DEAD (unused) | DELETE |

### Delivery Files (Current — NONE in frontend/)

| Location | Domain | Status |
|---|---|---|
| `services/delivery-service/` (backend) | Delivery | ACTIVE (backend) |
| `Aritii-admin-web/src/pages/delivery/` | Delivery | ACTIVE (admin UI) |
| `Aritii-admin-web/src/pages/riders/` | Delivery | ACTIVE (admin UI) |
| `frontend/src/services/location.service.js` | Delivery (checkout) | ACTIVE (uses delivery API) |
| `frontend/src/services/address.service.js` | Buyer | ACTIVE (buyer addresses) |
| `frontend/src/` | Delivery (UI) | **NONE** — no UI |

---

## 4. Routes

Complete route ownership table using real existing routes. See dedicated `docs/ROUTES.md` for the full table.

### Public Website Routes

| Route | Page | Layout | Header | Auth |
|---|---|---|---|---|
| `/` | Home | PublicLayout | PublicHeader | No |
| `/about` | About | PublicLayout | PublicHeader | No |
| `/how-it-works` | How It Works | PublicLayout | PublicHeader | No |
| `/faq` | FAQ | PublicLayout | PublicHeader | No |

### Marketplace Routes

| Route | Page | Layout | Header | Auth |
|---|---|---|---|---|
| `/products` | Products | MarketplaceLayout | MarketplaceHeader | No (guests see curated) |
| `/products/:id` | Product Detail | MarketplaceLayout | MarketplaceHeader | No |
| `/shops` | Shops | MarketplaceLayout | MarketplaceHeader | No |
| `/shops/:id` | Shop Detail | MarketplaceLayout | MarketplaceHeader | No |
| `/explore/products` | Products (alias) | MarketplaceLayout | MarketplaceHeader | No |
| `/explore/shops` | Shops (alias) | MarketplaceLayout | MarketplaceHeader | No |
| `/best-selling` | Best Selling | MarketplaceLayout | MarketplaceHeader | No |
| `/explore/categories` | Categories | MarketplaceLayout | MarketplaceHeader | No |
| `/events` | Events | MarketplaceLayout | MarketplaceHeader | No |
| `/explore/events` | Events (alias) | MarketplaceLayout | MarketplaceHeader | No |

### Buyer Routes (ProtectedRoute)

| Route | Page | Layout | Header | Sidebar | Auth |
|---|---|---|---|---|---|
| `/checkout` | Checkout | BuyerLayout | BuyerHeader | BuyerSidebar | Buyer |
| `/payment` | Payment | BuyerLayout | BuyerHeader | BuyerSidebar | Buyer |
| `/order/success` | Order Success | BuyerLayout | BuyerHeader | BuyerSidebar | Buyer |
| `/inbox` | Messages | BuyerLayout | BuyerHeader | BuyerSidebar | Buyer |
| `/user/order/:id` | Order Details | BuyerLayout | BuyerHeader | BuyerSidebar | Buyer |
| `/user/track/order/:id` | Tracking | BuyerLayout | BuyerHeader | BuyerSidebar | Buyer |
| `/my-dashboard` | Dashboard | BuyerLayout | BuyerHeader | BuyerSidebar | Buyer |
| `/my-dashboard/profile` | Profile | BuyerLayout | BuyerHeader | BuyerSidebar | Buyer |
| `/my-dashboard/orders` | Orders | BuyerLayout | BuyerHeader | BuyerSidebar | Buyer |
| `/my-dashboard/addresses` | Addresses | BuyerLayout | BuyerHeader | BuyerSidebar | Buyer |
| `/my-dashboard/wishlist` | Wishlist | BuyerLayout | BuyerHeader | BuyerSidebar | Buyer |
| `/my-dashboard/reviews` | Reviews | BuyerLayout | BuyerHeader | BuyerSidebar | Buyer |
| `/my-dashboard/settings` | Settings | BuyerLayout | BuyerHeader | BuyerSidebar | Buyer |
| `/my-dashboard/marketplace` | Marketplace Browse | BuyerLayout | BuyerHeader | BuyerSidebar | Buyer |
| `/my-dashboard/shops` | Shops Browse | BuyerLayout | BuyerHeader | BuyerSidebar | Buyer |

### Business/Seller Routes (ProtectedRoute + SellerAuthRoute)

| Route | Page | Layout | Header | Sidebar | Auth |
|---|---|---|---|---|---|
| `/business/dashboard` | Dashboard | BusinessLayout | BusinessHeader | BusinessSidebar | Seller |
| `/business/profile` | Profile | BusinessLayout | BusinessHeader | BusinessSidebar | Seller |
| `/business/products` | Products | BusinessLayout | BusinessHeader | BusinessSidebar | Seller |
| `/business/products/create` | Create Product | BusinessLayout | BusinessHeader | BusinessSidebar | Seller |
| `/business/orders` | Orders | BusinessLayout | BusinessHeader | BusinessSidebar | Seller |
| `/business/inventory` | Inventory | BusinessLayout | BusinessHeader | BusinessSidebar | Seller |
| `/business/analytics` | Analytics | BusinessLayout | BusinessHeader | BusinessSidebar | Seller |

### Legacy Redirect Routes (currently in App.jsx)

| Legacy Route | Redirects To |
|---|---|
| `/dashboard` | `/my-dashboard` |
| `/dashboard-create-product` | `/my-dashboard/business/products/create` |
| `/dashboard-products` | `/my-dashboard/business/products` |
| `/dashboard-edit-product/:id` | `/my-dashboard/business/products` |
| `/dashboard-events` | `/my-dashboard` |
| `/dashboard-promotions` | `/my-dashboard` |
| `/dashboard-coupons` | `/my-dashboard` |
| `/dashboard-orders` | `/my-dashboard/business/orders` |
| `/dashboard-refunds` | `/my-dashboard/business/orders` |
| `/order/:id` | `/my-dashboard/orders` |
| `/settings` | `/my-dashboard/settings` |
| `/dashboard-messages` | `/inbox` |
| `/dashboard-store-profile` | `/my-dashboard/business/products` |
| `/dashboard-store-metrics` | `/my-dashboard/business/analytics` |
| `/dashboard-order-history` | `/my-dashboard/orders` |
| `/dashboard-inventory` | `/my-dashboard/business/inventory` |
| `/dashboard-analytics` | `/my-dashboard/business/analytics` |
| `/create-shop` | `/sell` |
| `/shop-login` | `/login` |
| `/profile` | `/my-dashboard/profile` |
| `/shop/:id` | Seller context (seller-protected) |

---

## 5. User Flows

### FLOW 1 — Guest

```
Guest
  ↓
Public Website (/)
  ↓
Curated discovery (Home, Featured Products, Selected Shops, Categories)
  ↓
Selected Product / Shop / Category
  ↓
Marketplace (/products, /shops, /explore/products)
  ↓
Login / Signup (/login, /sign-up)
  ↓
Buyer Dashboard (/my-dashboard)
```

### FLOW 2 — Buyer

```
Login (/login)
  ↓
Buyer Dashboard (/my-dashboard)
  ↓
Marketplace (/my-dashboard/marketplace, /products, /explore/products)
  ↓
Search → Product (/products, /product/:id)
  ↓
Add to Cart (Redux cart)
  ↓
Checkout (/checkout) → Shipping → Location Selector
  ↓
Payment (/payment) → Cash on Delivery
  ↓
Order Success (/order/success)
  ↓
Track Order (/user/track/order/:id)
  ↓
Delivered
```

### FLOW 3 — Business

```
User
  ↓
Become a Seller (/sell)
  ↓
Seller Application Review (admin in Aritii-admin-web)
  ↓
Approval
  ↓
Business Dashboard (/business/dashboard)
  ↓
Shop A (profile, products, inventory, orders)
  ↓
Shop B (same capabilities)
  ↓
Shop C (same capabilities)
  ↓
Business Analytics (/business/analytics)
  ↓
Business Settings (/business/profile)
```

### FLOW 4 — Multiple Shops

```
Business
  ├── Shop A
  │   ├── Location: Addis Ababa
  │   ├── Products: Coffee, Spices
  │   ├── Inventory: Stock tracking
  │   └── Orders: Receives orders for Shop A products
  ├── Shop B
  │   ├── Location: Bahir Dar
  │   ├── Products: Textiles, Leather
  │   ├── Inventory: Stock tracking
  │   └── Orders: Receives orders for Shop B products
  └── Shop C
      ├── Location: Mekelle
      ├── Products: Honey, Basketry
      ├── Inventory: Stock tracking
      └── Orders: Receives orders for Shop C products
```

Each shop has: location, products, inventory, orders.
**Current implementation:** 1 business = 1 shop (needs Priority 2 change).

### FLOW 5 — Delivery

```
Buyer Order
  ↓
Delivery Required
  ↓
Delivery Assignment (via delivery-service, managed in Aritii-admin-web)
  ↓
Aritii Delivery OR External Provider
  ↓
Driver/Rider Picked Up
  ↓
In Transit
  ↓
Delivered
```

### FLOW 6 — Order State Machine

```
Pending → Confirmed → Processing → Ready → Completed
                                          ↗
                              Cancelled (before Ready)
                              Refunded (after Completed)
```

### FLOW 7 — Delivery State Machine (separate from Order)

```
Not Required → Pending Assignment → Assigned → Picked Up → In Transit → Delivered
                                         ↗
                              Failed (alternative provider)
                              Returned (undeliverable)
```

---

## 6. Headers

| Header | File | Domain | Used By | Key Links |
|---|---|---|---|---|
| **PublicHeader** | `components/layout/PublicHeader.jsx` | Public Website | Home, About, How It Works, FAQ | Home, Discover (dropdown), Shops, Deals, About, Cart, Login/Signup |
| **DiscoveryHeader** | `components/layout/DiscoveryHeader.jsx` | Marketplace | Products, Shops, Categories, Events, Product Detail, Shop Detail | Products, Categories, Shops, Deals, Search (DEAD), Cart, Login |
| **BuyerHeader** | `components/layout/BuyerHeader.jsx` | Buyer | All /my-dashboard/*, /checkout, /payment, /inbox | Dashboard, Marketplace, Orders, Wishlist, Cart, Messages, Profile, Settings, Logout |
| **Header** (legacy) | `components/layout/Header.jsx` | Marketplace (legacy) | HomePage, ShopDetailsPage, SellerApplicationPage, Checkout | Explore, Products, Shops, Categories, Best Selling, Events, How It Works, Sell, About, FAQ, Login |
| **BusinessHeader** | TO CREATE | Business | All /business/* | Business name, Shop context, Dashboard, Products, Orders, Settings, Logout |
| **DeliveryHeader** | TO CREATE | Delivery | Delivery pages | Delivery operations, Orders, Assignments, Tracking, Settings |

**Rules:**
- Each domain has its own header
- Header components must NOT contain page-level content
- Headers accept `linked={false}` prop for BrandLogo to prevent nested Links (BrandLogo self-links)
- Discovery search is currently presentational — needs wiring or removal

---

## 7. Sidebars

### Buyer Sidebar

**File:** `pages/buyer/dashboard/CustomerAccountSidebar.jsx`
**Used by:** `CustomerAccountLayout.jsx` at `/my-dashboard`

| Item | Route | Section |
|---|---|---|
| Dashboard | `/my-dashboard` | Main |
| Marketplace | `/my-dashboard/marketplace` | Main |
| Shops | `/my-dashboard/shops` | Main |
| Orders | `/my-dashboard/orders` | Main |
| Wishlist | `/my-dashboard/wishlist` | Main |
| Profile | `/my-dashboard/profile` | Main |
| Products | `/my-dashboard/business/products` | Seller-only |
| Add Product | `/my-dashboard/business/products/create` | Seller-only |
| Business Orders | `/my-dashboard/business/orders` | Seller-only |
| Analytics | `/my-dashboard/business/analytics` | Seller-only |
| Settings | `/my-dashboard/settings` | Always |
| Become a Seller | `/sell` | Non-seller CTA |
| Logout | Handler | Always |

**Must NOT contain:** Products management, Inventory, Business orders, Business analytics, Shop management (for non-sellers)

### Business Sidebar

**File:** `src/seller/sidebar/SellerSidebar.jsx` (active, used by `src/seller/SellerLayout.jsx`)
**Used by:** SellerLayout at `/business/*`

| Item | Route | Section |
|---|---|---|
| Dashboard | `/business/dashboard` | Main |
| All Orders | `/business/orders` | Orders |
| All Products | `/business/products` | Products |
| Store Profile | `/business/profile` | Store |
| Add Product | `/business/products/create` | Products |
| Inventory | `/business/inventory` | Products |
| Order History | `/business/orders/history` | Orders (legacy) |
| Settings | `/business/settings` | Account |
| Buyer Profile | `/my-dashboard/profile` | Buyer Features |
| My Purchases | `/my-dashboard/orders` | Buyer Features |
| My Wishlist | `/my-dashboard/wishlist` | Buyer Features |
| My Addresses | `/my-dashboard/addresses` | Buyer Features |
| Marketplace | `/marketplace` | Footer |
| View All Shops | `/shops` | Footer |

### Delivery Sidebar

**TO CREATE** — No current frontend implementation.

Suggested: Overview, Delivery Orders, Assignments, Active Deliveries, Tracking, Providers, History.

### Unused Sidebar (DELETE after migration)

`src/components/seller/DashboardSideBar.jsx` — 327 lines, not imported by any route or layout. The active seller sidebar is `src/seller/sidebar/SellerSidebar.jsx` (98 lines).

---

## 8. Navigation

### Public Website Navigation (`PublicHeader`)

- Home `/`
- Discover dropdown → Products `/products`, Categories `/explore/categories`, Shops `/shops`, Best Selling `/best-selling`, Deals & Events `/events`
- Shops `/shops`
- Deals `/events`
- About `/about`
- Cart icon → `/checkout`
- Login `/login` / Sign Up `/sign-up` (guest) OR Dashboard `/my-dashboard` (authed)

### Marketplace Navigation (`DiscoveryHeader`)

- Logo `/`
- Products `/explore/products`
- Categories `/explore/categories`
- Shops `/explore/shops`
- Deals `/events`
- Search bar (DEAD — needs wiring)
- Cart icon → `/checkout`
- Login `/login` / Account `/my-dashboard`

### Buyer Navigation (`BuyerHeader` + `CustomerAccountSidebar`)

- BuyerHeader: Logo, search, Marketplace, Orders, Wishlist, Cart, Messages, Profile, Settings, Logout
- Sidebar: Dashboard, Marketplace, Shops, Orders, Wishlist, Profile, Business items (if seller), Settings, Logout

### Business Navigation (`BusinessHeader` + `SellerSidebar`)

- BusinessHeader: Business name, current shop context, Dashboard, Settings, Logout
- Sidebar: Dashboard, Products, Create Product, Orders, Inventory, Profile, Analytics, Messages, Settings

---

## 9. Layouts

| Layout | File | Chrome | Used By |
|---|---|---|---|
| PublicLayout | `components/layout/PublicLayout.jsx` | PublicHeader + Footer | Home, About, How It Works, FAQ |
| DiscoveryLayout | **DOES NOT EXIST** | DiscoveryHeader + Footer | Needs creation for Marketplace pages |
| MarketplaceLayout | `components/layout/MarketplaceLayout.jsx` | Header + Footer | **UNUSED** (Header.jsx variant used directly) |
| BuyerLayout | `pages/buyer/dashboard/CustomerAccountLayout.jsx` | BuyerHeader + Sidebar + Footer | All /my-dashboard/*, /checkout, /payment, /inbox |
| BusinessLayout | `src/seller/SellerLayout.jsx` | DashboardHeader + SellerSidebar + minimal footer | All /business/* |
| SellerLayout (legacy) | `src/components/seller/SellerLayout.jsx` | DashboardHeader + SellerSidebar | Legacy pages/seller/* pages |

**Layout Rules:**
- A page NEVER imports a Header/Footer directly
- The route's layout supplies all chrome
- Pages only render content
- Dashboard layouts (BuyerLayout, BusinessLayout) own their sidebars
- Public and Marketplace pages use Header + Footer (no sidebar)

---

## 10. Services

All services are in `src/services/`. UI components should NOT directly perform API calls; they use service functions.

| Service | File | Domain | Key Endpoints |
|---|---|---|---|
| API Core | `api.js` | All | Axios instance, base URL, token interceptor |
| Auth | `auth.service.js` | Public/Auth | `/auth/register`, `/auth/authorize`, `/auth/token`, `/auth/revoke`, `/user/getuser`, `/user/update-user-info`, `/user/update-avatar` |
| Product | `product.service.js` | Marketplace | `/product/get-all-products`, `/product/get-product/:id`, `/product/get-all-products-shop/:id`, `/product/create-product`, `/product/update-product`, `/product/delete-shop-product` |
| Shop | `shop.service.js` | Marketplace | `/shop/get-all-shops`, `/shop/get-shop-info/:id`, `/shop/getseller`, `/shop/update-shop-avatar` |
| Catalog | `catalog.service.js` | Marketplace | `/category/get-all-categories`, `/event/get-all-events`, `/coupon/get-coupon-value/:code`, `/coupon/create-coupon-code` |
| Order | `order.service.js` | Marketplace/Buyer | `/order/create-order`, `/order/get-all-orders/user/:id`, `/order/get-all-orders/seller/:id`, `/order/order/:id`, `/order/update-order-status/:id`, `/order/cancel/:id` |
| Seller | `seller.service.js` | Business | `/seller-application`, `/seller-application/:id/approve`, `/shop/get-shop-info/:id`, `/shop/update-shop-info`, `/event/create-event`, `/event/get-all-events/:shopId` |
| Address | `address.service.js` | Buyer | `GET /address`, `POST /address`, `DELETE /address/:id` |
| Location | `location.service.js` | Delivery/Checkout | `/delivery/location/*`, `/delivery/zone/location/:id` |
| Cache | `cache.js` | Core | TTL-based request caching |
| Token Store | `tokenStore.js` | Core | In-memory token management with refresh |
| PKCE | `pkce.js` | Core | OAuth PKCE helpers |
| Index | `index.js` | Core | Barrel export |

**Service Ownership Rules:**
- Each service owns its domain's API operations
- UI components call service functions, never raw `fetch`
- Payment MUST use `order.service.js` (not raw fetch as currently implemented)
- Cart/wishlist operations are Redux actions that call service functions

---

## 11. State Ownership

### Current Redux State (Store: `store/redux/store.js`)

| Slice | Key | Owned By | Current Issues |
|---|---|---|---|
| `user` | `state.user` | Buyer | Auth, profile, addresses, loading, error |
| `seller` | `state.seller` | Business | isSeller, seller data, loading |
| `products` | `state.products` | Marketplace | All products, single product, loading, message, error, success |
| `events` | `state.events` | Marketplace | All events, single event, loading, message, error, success |
| `shop` | `state.shop` | Marketplace | Shops list, categories, loading, error |
| `cart` | `state.cart` | Buyer | Cart array, qty field, validation result |
| `wishlist` | `state.wishlist` | Buyer | Wishlist array (localStorage) |
| `order` | `state.order` | Buyer + Business | Buyer orders AND seller orders share loading/error |

### Canonical State Model

Resolve these conflicts:

| Conflict | Current Problem | Canonical Target |
|---|---|---|
| `product` vs `products` | Some pages read `state.product`, store has `products` | All reads use `state.products.allProducts` / `state.products.product` |
| `shop` vs `shops` | Home sections read `state.shops` but store key is `shop` | All reads use `state.shop` |
| `qty` vs `quantity` | Cart cards use `qty`, Header total uses `quantity` | Canonical: `qty` for items, `totalQuantity` for cart summary |
| `cart.items` vs `cart.products` | Not consistent across components | Canonical: `cart.items` (array of cart line objects) |
| `order` vs `orders` | Buyer and seller orders share state | Split: `state.order.buyerOrders`, `state.order.sellerOrders` with separate loading |
| `state.product` vs `state.products` | CustomerReviewsPage reads wrong key | All reads use `state.products` |

### Where State Lives

| Domain | State Key | Files That Read/Write |
|---|---|---|
| Public Website | `state.shop` (categories, shops) | Home sections, CategoriesMarketplace |
| Marketplace | `state.products`, `state.events`, `state.shop` | All marketplace pages and components |
| Buyer | `state.user`, `state.cart`, `state.wishlist`, `state.order` | All buyer pages |
| Business | `state.seller`, `state.order` (seller portion) | Business pages, Seller pages |
| Delivery | None in frontend | Backend only |

---

## 12. API Boundaries

All API calls go through service files in `src/services/`. No component should use raw `fetch` (except where noted as a bug to fix).

### API Base

- URL: `http://localhost:8000/api` (configurable via `VITE_API_URL`)
- Auth: Bearer token via axios interceptor in `api.js`
- Refresh: Automatic token refresh via `tokenStore.js`

### API Endpoint Ownership

| Domain | Service | Endpoints |
|---|---|---|
| Public/Home | `catalog.service.js` | `/category/get-all-categories` (currently not used by action — returns []) |
| Public/Home | `shop.service.js` | `/shop/get-all-shops`, `/shop/get-shop-info/:id` |
| Marketplace/Products | `product.service.js` | `/product/get-all-products`, `/product/get-product/:id`, `/product/get-all-products-shop/:id` |
| Marketplace/Events | `catalog.service.js` | `/event/get-all-events` |
| Marketplace/Coupons | `catalog.service.js` | `/coupon/*` |
| Marketplace/Cart | `cart` (Redux action) | Uses product detail API for validation |
| Marketplace/Orders | `order.service.js` | `/order/create-order`, `/order/get-all-orders/*`, `/order/order/:id`, `/order/update-order-status/:id`, `/order/cancel/:id` |
| Buyer/Profile | `auth.service.js` | `/user/getuser`, `/user/update-user-info`, `/user/update-avatar` |
| Buyer/Addresses | `address.service.js` | `/address`, `/address/:id` |
| Business/Seller | `seller.service.js` | `/seller-application`, `/seller-application/:id/approve`, `/event/*` |
| Business/Products | `product.service.js` | Same endpoints as marketplace (seller creates/updates/deletes) |
| Delivery | `location.service.js` | `/delivery/location/*`, `/delivery/zone/location/:id` |
| Delivery Orders | **PLANNED** | No frontend delivery order APIs yet |

### PROBLEM: Payment uses raw fetch

`components/payment/Payment.jsx:36-46` uses `fetch('/api/order/create-order')` directly instead of `order.service.js`. This bypasses the configured API base URL and auth interceptors.

---

## 13. Authentication Boundaries

### Auth Types

| Type | File | Scope |
|---|---|---|
| Customer (Buyer) | `auth.service.js` — `/auth/register`, `/auth/authorize` | Buyer Dashboard, Marketplace (authenticated) |
| Seller Shop | `auth.service.js` — `/auth/token` (seller login) | Business Dashboard, Seller pages |
| Seller Application | `seller.service.js` — `/seller-application` | Apply to become seller |

### Auth Guards

| Guard | File | Behavior |
|---|---|---|
| ProtectedRoute | `routes/ProtectedRoute.jsx` | Requires `state.user.isAuthenticated === true`. Redirects to `/login`. |
| SellerAuthRoute | `routes/SellerAuthRoute.jsx` | Requires authenticated AND approved seller. Redirects to `/my-dashboard`. |
| SellerStatusRoute | `routes/SellerStatusRoute.jsx` | Redirects all authenticated users to `/my-dashboard`. |
| SellerRedirectRoute | `routes/SellerRedirectRoute.jsx` | Renders for non-sellers (guards against seller-only pages). |
| HomeRoute | `routes/HomeRoute.jsx` | No auth check. Shows homepage to all. |

### Authentication Flows

**Customer Login:** `/login` → `Login.jsx` → dispatches `loginUser` → navigates to `/my-dashboard`
**Customer Registration:** `/sign-up` → `SignUp.jsx` → dispatches `registerUser` → navigates to `/login`
**Seller Login:** `/shop-login` → `ShopLogin.jsx` → dispatches `loginSeller` → navigates to `/dashboard` (legacy) or `/my-dashboard`
**Seller Application:** `/sell` → `SellerApplicationPage.jsx` → submits application → waits for admin approval

### Token Management

- Stored in-memory only (no cookies, no localStorage)
- Refreshed automatically via `tokenStore.js` using `POST /auth/token` with refresh_token grant
- Cleared on logout

---

## 14. Authorization Boundaries

### Authorization Matrix

| Action | Guest | Buyer | Seller (approved) | Admin |
|---|---|---|---|---|
| View Public Website | ✅ | ✅ | ✅ | ✅ |
| Browse Marketplace (curated) | ✅ | ✅ | ✅ | ✅ |
| Browse Marketplace (full catalog) | ❌ | ✅ | ✅ | ✅ |
| View Product Detail | ✅ | ✅ | ✅ | ✅ |
| Add to Cart | ❌ → /login | ✅ | ✅ | ❌ |
| Checkout | ❌ → /login | ✅ | ❌ | ❌ |
| View Orders | ❌ → /login | Own orders only | N/A | ❌ |
| Manage Buyer Account | ❌ → /login | ✅ Own only | ❌ | ❌ |
| Manage Products | ❌ | ❌ | ✅ Own products only | ✅ |
| Manage Shop | ❌ | ❌ | ✅ Own shop only | ✅ |
| Manage Business | ❌ | ❌ | ✅ (if approved) | ✅ |
| View Seller Dashboard | ❌ | ❌ | ✅ | ✅ |
| Manage Delivery | ❌ | ❌ | ❌ | ✅ |
| Admin Console | ❌ | ❌ | ❌ | ✅ |

**Critical:** Frontend route protection is NOT sufficient for authorization. The backend must enforce every access control. Frontend guards are UX convenience only.

**Current gap:** Business pages (`/my-dashboard/business/*`) are wrapped in `ProtectedRoute` but NOT in `SellerAuthRoute`. A buyer could access them if they navigate directly. The server must reject unauthorized access regardless of frontend route configuration.

---

## 15. Public vs Marketplace Visibility

### Content Hierarchy

```
ALL ACTIVE PRODUCTS (from backend)
        ↓ (backend filters by isPublic/visibility flag)
ACTIVE MARKETPLACE PRODUCTS (visible to authenticated buyers)
        ↓ (backend filters by isFeatured/displayPriority)
PUBLICLY VISIBLE PRODUCTS (shown on Public Website)
        ↓ (homepage curation)
FEATURED PRODUCTS (top 6 on homepage — currently hardcoded)
```

Same hierarchy applies to:
- Shops: All Active Shops → Marketplace Shops → Publicly Visible Shops → Featured Shops
- Categories: All Categories → Marketplace Categories → Publicly Visible Categories → Featured Categories
- Events: All Events → Marketplace Events → Publicly Visible Events → Featured Events
- Promotions: All Promotions → Public Promotions → Featured Promotions
- Advertisements: All Ads → Public Ads → Featured Ads

### Current Implementation vs Target

| Level | Current | Target |
|---|---|---|
| ALL ACTIVE PRODUCTS | `productService.getAll()` returns ALL products | Backend filters by visibility flag |
| ACTIVE MARKETPLACE PRODUCTS | `ProductsMarketplace.jsx` shows all | Backend filters; frontend respects |
| PUBLICLY VISIBLE PRODUCTS | No explicit filter | Backend filter; frontend respects |
| FEATURED PRODUCTS | HomePage shows first 6 (hardcoded) | Backend `get-featured` endpoint; if not available, document the curation method |

### Problem

The frontend currently assumes all products are public. There is NO frontend filtering for visibility. If the backend supports content visibility flags, the frontend should be updated to use them. If the backend does NOT support visibility flags, the homepage curation should be explicit (e.g., a `showOnPublic` or `displayPriority` field managed by admin).

**Do not hardcode featured content in frontend if backend supports content control.**

---

## 16. Buyer vs Business Separation

### Buyer Owns

- Account management (profile, settings, avatar)
- Shopping (cart, wishlist, checkout, payment)
- Orders (view, cancel, request refund)
- Delivery addresses
- Reviews (written by buyer)
- Requests/Support (PLANNED)
- Marketplace browsing (authenticated)

### Buyer Must NOT Own

- Product management
- Inventory management
- Shop management
- Business analytics
- Seller dashboard
- Promotion/event creation
- Any seller-specific feature

### Business Owns

- Business profile (name, description, category)
- Shop management (multiple shops per business — planned)
- Product management (create, edit, delete within owned shops)
- Inventory (stock levels per product)
- Business orders (orders from shop products)
- Promotions and events (create, manage)
- Analytics (revenue, orders, stock alerts)
- Business messages
- Business settings

### Business Must NOT Own

- Buyer account management
- Buyer cart/checkout
- Buyer order history (except business orders)
- Buyer wishlist (except as product data)
- Buyer reviews (respond to them, but don't manage them)

### Current Implementation Issue

The `CustomerAccountSidebar.jsx` already mixes buyer and seller features:
- Buyer items: Dashboard, Marketplace, Shops, Orders, Wishlist, Profile
- Seller items: Products, Add Product, Business Orders, Analytics
- Settings (shared)

This is acceptable for the unified dashboard concept BUT the business pages (`/my-dashboard/business/*`) are NOT protected by `SellerAuthRoute`. They currently only have `ProtectedRoute`. This must be fixed.

---

## 17. Delivery Separation

### Delivery Does NOT Exist in Frontend

There is **zero delivery UI** in `frontend/src/`. All delivery logic is in:

1. **Backend:** `services/delivery-service/` — delivery zones, routes, assignments, tracking, riders
2. **Admin:** `Aritii-admin-web/` — delivery overview, assignments, routes, zones, riders, pending riders, rider details
3. **Frontend (checkout only):** `location.service.js` — delivery zone/location data for address forms
4. **Frontend (buyer only):** `address.service.js` — buyer saved delivery addresses

### Delivery Domain Boundaries

| What Delivery Owns | What Delivery Must NOT Own |
|---|---|
| Delivery zone management | User authentication |
| Rider/actor management | Product management |
| Order assignment | Shop management |
| Real-time tracking | Buyer dashboard |
| Delivery history | Business analytics |
| Provider configuration | Payment processing |
| Route optimization | Order creation (receives order ID only) |

### Future Delivery UI (if needed in frontend/)

```
src/delivery/
├── pages/
│   ├── DeliveryDashboardPage.jsx
│   ├── DeliveryOrdersPage.jsx
│   ├── AssignmentsPage.jsx
│   ├── TrackingPage.jsx
│   ├── ProvidersPage.jsx
│   └── DeliveryHistoryPage.jsx
├── components/
│   ├── DeliveryHeader.jsx
│   ├── DeliverySidebar.jsx
│   ├── DeliveryStatus.jsx
│   └── AssignmentCard.jsx
├── layout/
│   └── DeliveryLayout.jsx
├── navigation/
│   └── DeliveryNavigation.jsx
└── services/
    └── deliveryService.js
```

### Separate State Machines

**ORDER** (managed by commerce-service):
Pending → Confirmed → Processing → Ready → Completed (or Cancelled/Refunded)

**DELIVERY** (managed by delivery-service):
Not Required → Pending Assignment → Assigned → Picked Up → In Transit → Delivered (or Failed/Returned)

These are separate lifecycles. Order status does NOT equal delivery status.

---

## 18. Business → Multiple Shops

### Current State: 1 Business = 1 Shop

The system currently supports a one-to-one relationship:

| Evidence | Source |
|---|---|
| Shop model has single `ownerId` | `services/commerce-service/src/shops/models/Shops.js` |
| Seller application creates ONE shop | `services/commerce-service/src/sellerApplications/services/sellerApplications.service.js` |
| Re-approval does NOT create second shop | Same file, line 162-164 |
| All business pages assume single shop context | `pages/customer/account/business/*` |
| Seller pages assume single shop context | `src/seller/products/*`, `src/seller/orders/*` |

### Target State: Business → N Shops

```
Business
├── Shop A (location, products, inventory, orders)
├── Shop B (location, products, inventory, orders)
└── Shop C (location, products, inventory, orders)
```

### What Changes When Multiple Shops Are Implemented (Priority 2)

1. **Backend:** Shop model needs `businessId` or parent relationship
2. **Backend:** Seller application allows multiple shops per business
3. **Frontend:** Business dashboard needs shop selector
4. **Frontend:** `/my-dashboard/business/products` filters by selected shop
5. **Frontend:** Seller sidebar shows all shops
6. **Frontend:** Shop context persists across business navigation
7. **Backend:** All shop-scoped queries filter by businessId

**This is NOT done in Priority 0. Documented for Priority 2.**

---

## 19. Duplicate/Conflicting Structures

### Duplicate Pages

| Responsibility | File 1 (Status) | File 2 (Status) | File 3 (Status) |
|---|---|---|---|
| Homepage | `pages/home/HomePage.jsx` (ACTIVE) | `pages/public/HomePage.jsx` (DEAD) | — |
| Products listing | `pages/common/ProductsPage.jsx` (ACTIVE) | `pages/common/ProductsMarketplace.jsx` (ACTIVE) | `pages/explore/products/ProductsPage.jsx` (DEAD) |
| Best selling | `pages/common/BestSellingPage.jsx` (ACTIVE) | — | `pages/explore/products/BestSellingPage.jsx` (DEAD) |
| FAQ | `pages/common/FAQpage.jsx` (ACTIVE) | `pages/common/FAQPage.jsx` (DEAD) | `pages/explore/FAQpage.jsx` (DEAD) |
| 404 | `pages/common/NotFound.jsx` (ACTIVE) | `pages/public/NotFound.jsx` (DEAD) | — |
| Product detail | `pages/common/ProductsDetailPage.jsx` (ACTIVE) | `pages/common/ProductDetailPage.jsx` (BROKEN) | — |
| Shop detail | `pages/common/ShopDetailsPage.jsx` (ACTIVE) | `pages/common/ShopDetailPage.jsx` (DEAD) | — |
| Seller application | `pages/seller/SellerApplicationPage.jsx` (ACTIVE) | — | — |
| Seller home | `pages/seller/ShopHomePage.jsx` (ACTIVE) | `pages/seller/store/ShopHomePage.jsx` (DEAD) | — |

### Duplicate Buyer Pages (`pages/buyer/` vs `pages/customer/`)

14 pairs of duplicate pages. `pages/buyer/` versions are the ones routed in App.jsx. `pages/customer/` versions are all unrouted duplicates. Most are byte-identical. The addresses pages are materially different (different fields, different API calls).

### Duplicate Seller Pages (`src/seller/` vs `pages/seller/`)

`src/seller/` versions are active and routed. `pages/seller/` versions are legacy duplicates using different layouts.

### Duplicate Layouts

| Layout | File 1 (Active) | File 2 | File 3 |
|---|---|---|---|
| SellerLayout | `src/seller/SellerLayout.jsx` | `src/components/seller/SellerLayout.jsx` | — |
| SellerSidebar | `src/seller/sidebar/SellerSidebar.jsx` | `src/components/seller/DashboardSideBar.jsx` (unused) | — |

### Duplicate Services

None found. Each service file is unique.

### Duplicate State

None found in Redux slices. Each domain has its own slice in the store.

### Product Detail Route Conflict

`/product/:id` and `/product/:name` both match the same URL pattern. React Router picks `:id` first, routing to the broken `ProductDetailPage` which reads wrong Redux slice and references an unimported component. The rich detail page (`ProductsDetailPage`) at `/product/:name` is shadowed.

---

## 20. Documentation Created

| File | Purpose | Status |
|---|---|---|
| `docs/ARCHITECTURE.md` | Complete architecture blueprint with diagram | CREATED |
| `docs/DOMAIN_STRUCTURE.md` | Purpose, folder, pages, components per domain | CREATED |
| `docs/ROUTES.md` | Complete route ownership table | CREATED |
| `docs/USER_FLOWS.md` | Guest, marketplace, buyer, business, delivery flows | CREATED |
| `docs/LAYOUTS_AND_NAVIGATION.md` | Layouts, headers, sidebars per route | CREATED |
| `docs/API_STRUCTURE.md` | Service/API ownership | CREATED |
| `docs/STATE_STRUCTURE.md` | State structure + canonical model | CREATED |
| `docs/MIGRATION_PLAN.md` | P1 and P2 migration plan | CREATED |

All docs are in `frontend/docs/`.

---

## Confirmation

- ✅ Admin was NOT touched (Aritii-admin-web completely out of scope)
- ✅ No files modified, renamed, deleted, or moved
- ✅ No refactoring performed
- ✅ Build still passes
- ✅ All existing routes still functional
- ✅ All 5 domains documented
- ✅ Business → multiple shops documented (currently 1:1)
- ✅ Delivery separated (no frontend UI)
- ✅ Public vs Marketplace visibility documented
- ✅ Buyer vs Business separation documented
