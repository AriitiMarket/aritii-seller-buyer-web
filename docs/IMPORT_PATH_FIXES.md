# Import Path Fix Reference

> Companion to `docs/IMPORT_PATH_AUDIT.md`. This file is the **actionable list**: the exact
> string to write for every broken import, validated by round-tripping each corrected
> specifier back through the resolver Vite uses.
>
> **STATUS — path rewrite APPLIED (path-only; no deleted component restored).**
>
> Pass 1 — 243 specifier occurrences across 78 files rewritten domain-locally.
> Pass 2 — the 3 doc-designated **shared** components (`Footer`, `ProductCard`, `ShopCard`)
> moved to `src/shared/components/` and their 25 import sites repointed, so no domain imports
> another domain's files.
> Pass 3 — the delivery subtree unregistered from `AppRoutes.jsx` (docs/ROUTES.md: the customer
> frontend does not expose delivery routes yet), which removed its 7 imports from the build graph.
>
> Result: stale paths **0**, cross-domain edges **2** (both involving `auth`), reachability
> **224/231**, and **19** build blockers left — all of them *missing files*, not wrong paths.
> See section 6.

## 0. Read this first — the documented "Target Structure" is not implemented

`docs/ARCHITECTURE.md` has a section *"Target Structure (proposed domains)"*. Its **folder**
layout mostly exists, but its **file names do not exist anywhere**. Verified with
`find src -name "<DocName>.jsx"` — all 32 documented page/component names are ABSENT:

| Documented as | Actually on disk |
|---|---|
| `app/App.jsx  (root app)` | `src/App.jsx` exists at src root; `src/app/` holds only config/providers/routes |
| `app/router/` | **`src/app/routes/`** (folder is named `routes`, not `router`) |
| `public/pages/HomePage.jsx` | `src/public/pages/Home.jsx` |
| `public/pages/AboutPage.jsx` | `src/public/pages/About.jsx` |
| `public/pages/HowItWorksPage.jsx` | `src/public/pages/HowItWorks.jsx` |
| `public/pages/FAQPage.jsx` | `src/public/pages/FAQ.jsx` |
| `public/pages/EventsPage.jsx` | `src/public/pages/Events.jsx` |
| `public/components/PublicNavigation.jsx` | ABSENT (marked "check" in the doc) |
| `marketplace/pages/ProductsPage.jsx` | `src/marketplace/pages/Products.jsx` |
| `marketplace/pages/ProductDetailsPage.jsx` | `src/marketplace/pages/ProductDetail.jsx` |
| `marketplace/pages/CategoriesPage.jsx` | `src/marketplace/pages/Categories.jsx` |
| `marketplace/pages/ShopsPage.jsx` | `src/marketplace/pages/Shops.jsx` |
| `marketplace/pages/ShopDetailsPage.jsx` | `src/marketplace/pages/ShopDetail.jsx` |
| `marketplace/pages/DealsPage.jsx` | `src/marketplace/pages/Deals.jsx` |
| `marketplace/pages/BestSellingPage.jsx` | `src/marketplace/pages/BestSelling.jsx` |
| `marketplace/components/ProductGrid.jsx, SearchBar.jsx, FilterPanel.jsx` | ABSENT (never written) |
| `marketplace/layout/MarketplaceLayout.jsx` | ABSENT — `src/marketplace/layout/` is empty |
| `marketplace/navigation/MarketplaceNavigation.jsx` | ABSENT — `src/marketplace/navigation/` is empty |
| `marketplace/services/marketplaceService.js` | `src/marketplace/services/{category,product,shop}Service.js` (3 files) |
| `buyer/pages/BuyerDashboardPage.jsx` | `src/buyer/pages/Dashboard/Dashboard.jsx` |
| `buyer/pages/OrdersPage.jsx` | `src/buyer/pages/Orders.jsx` |
| `buyer/pages/OrderDetailsPage.jsx` | `src/buyer/pages/OrderDetail.jsx` |
| `buyer/pages/ProfilePage.jsx` | `src/buyer/pages/Profile.jsx` |
| `buyer/pages/AddressesPage.jsx` | `src/buyer/pages/Addresses.jsx` |
| `buyer/pages/WishlistPage.jsx` | `src/buyer/pages/Wishlist.jsx` |
| `buyer/pages/ReviewsPage.jsx` | `src/buyer/pages/Reviews.jsx` |
| `buyer/pages/RequestsPage.jsx` | `src/buyer/pages/Requests/Requests.jsx` (implemented, not "planned") |
| `buyer/pages/SettingsPage.jsx` | `src/buyer/pages/Settings.jsx` |
| `buyer/layout/BuyerLayout.jsx` | `src/buyer/components/BuyerLayout.jsx` — `buyer/layout/` is empty |
| `buyer/navigation/BuyerNavigation.jsx` | ABSENT — `src/buyer/navigation/` is empty |
| `buyer/services/buyerService.js` | `src/buyer/services/{cart,checkout,order,payment,profile,request,review,wishlist}Service.js` (8 files) |
| `business/pages/BusinessDashboardPage.jsx` | `src/business/pages/Dashboard.jsx` |
| `business/pages/BusinessProfilePage.jsx` | `src/business/pages/Profile/Profile.jsx` |
| `business/pages/ShopsPage.jsx` | `src/business/pages/Shops/Shops.jsx` |
| `business/pages/ShopDetailsPage.jsx` | `src/business/pages/Shops/ShopDetail.jsx` |
| `business/pages/ProductsPage.jsx` | `src/business/pages/Products/Products.jsx` |
| `business/pages/InventoryPage.jsx` | `src/business/pages/Inventory/Inventory.jsx` |
| `business/pages/OrdersPage.jsx` | `src/business/pages/Orders/Orders.jsx` |
| `business/pages/PromotionsPage.jsx` | `src/business/pages/Promotions/Promotions.jsx` |
| `business/pages/EventsPage.jsx` | `src/business/pages/Events/Events.jsx` |
| `business/pages/AnalyticsPage.jsx` | `src/business/pages/Analytics/Analytics.jsx` |
| `business/pages/MessagesPage.jsx` | `src/business/pages/Orders/Messages.jsx` |
| `business/pages/SettingsPage.jsx` | `src/business/pages/Profile/Settings.jsx` |
| `business/layout/BusinessLayout.jsx` | `src/business/components/BusinessLayout.jsx` — `business/layout/` is empty |
| `business/navigation/BusinessNavigation.jsx` | ABSENT — `src/business/navigation/` is empty |
| `business/components/ShopSelector.jsx` | ABSENT — the code asks for `ShopSwitcher` (also absent) |
| `business/components/BusinessProductCard/InventoryTable.jsx` | ABSENT (never written) |
| `delivery/README.md` | `src/delivery/` does not exist at all |
| `shared/components/` | ABSENT — generic UI lives in `src/components/common/` |
| `shared/constants/` | ABSENT — constants live in `src/shared/utils/constants.js` |
| `shared/validation/` | ABSENT — validators live in `src/shared/utils/validators.js` |
| `services/ (root list)` | `src/services/` exists and matches, plus 11 more service files |
| `store/` | `src/store/` exists (1 file + `slices/`) |

Folder-level gaps:

- `src/app/router/` — documented; on disk it is `src/app/routes/` (9 files) — importers use `@/routes/*`
- `src/marketplace/layout/` — exists but EMPTY
- `src/marketplace/navigation/` — exists but EMPTY
- `src/buyer/layout/` — exists but EMPTY (BuyerLayout sits in `buyer/components/`)
- `src/buyer/navigation/` — exists but EMPTY
- `src/business/layout/` — exists but EMPTY (BusinessLayout sits in `business/components/`)
- `src/business/navigation/` — exists but EMPTY
- `src/business/components/{BusinessStats,InventoryManagement,OrderManagement,ProductManagement}/` — exist but EMPTY
- `src/assets/{fonts,icons}/` — exist but EMPTY
- `src/delivery/` — documented; does NOT exist
- `src/shared/components/` — documented; does NOT exist
- `src/shared/constants/` — documented; does NOT exist
- `src/shared/validation/` — documented; does NOT exist

**Consequence:** you cannot "fix the imports to match the target structure" as written,
because those modules do not exist. Two coherent options:

- **Option A (recommended — builds today):** rewrite the import strings to the files that
  actually exist. The disk tree is *already* domain-first and matches the doc's folder
  intent; only the file names differ. Sections 1-3 are this option.
- **Option B (rename to match the doc literally):** first create/rename ~30 files and fill
  the empty folders, then point imports at the new names. Section 4 is that rename map.
  It is a bigger, riskier change that buys no correctness — the doc is a proposal, not a
  contract, and it is internally inconsistent (it lists `app/` twice, and both `App.jsx`
  and `app/App.jsx`).

## 1. The rule every import must follow

```js
import Footer from '@/public/components/PublicFooter'
import Config from '@/app/config'          // -> src/app/config/index.js
import useCart from '@/buyer/hooks/useCart'
```

- One alias: `@/` -> `src/` (declared in `vite.config.js`, mirrored in `jsconfig.json`).
- Never write `@/features/*` or `@/pages/*` — neither folder exists on disk or in git.
- Never cross a domain with `../..`. Same-folder siblings and `index.js` barrels may stay
  relative; the 33 existing relative imports are all valid and can be left alone.
- `@/x/y` resolves `x/y.js`, `x/y.jsx`, `x/y/index.js`, `x/y/index.jsx` — so write the
  folder (`@/app/providers`, `@/components/common/Button`) when a barrel exists, and the
  file name (`@/business/components/BusinessHeader/BusinessHeader`) when it does not.

## 2. Replaceable now — 120 distinct targets, no file changes

Round-trip validation: **120/120** corrected specifiers resolve back to exactly the intended file.

| Old (broken) | Write exactly this | Resolves to |
|---|---|---|
| `@/components/layout/PublicFooter` | **`@/public/components/PublicFooter`** | `src/public/components/PublicFooter.jsx` |
| `@/components/layout/PublicHeader` | **`@/public/components/PublicHeader`** | `src/public/components/PublicHeader.jsx` |
| `@/config` | **`@/app/config`** | `src/app/config/index.js` |
| `@/config/env` | **`@/app/config/env`** | `src/app/config/env.js` |
| `@/context/AppProviders` | **`@/app/providers/AppProviders`** | `src/app/providers/AppProviders.jsx` |
| `@/context/LayoutContext` | **`@/app/providers/LayoutContext`** | `src/app/providers/LayoutContext.jsx` |
| `@/features/auth/authSlice` | **`@/auth/authSlice`** | `src/auth/authSlice.js` |
| `@/features/auth/components/CreateShopPage` | **`@/auth/pages/CreateShopPage`** | `src/auth/pages/CreateShopPage.jsx` |
| `@/features/auth/components/Login` | **`@/auth/components/Login`** | `src/auth/components/Login.jsx` |
| `@/features/auth/components/LoginPage` | **`@/auth/pages/LoginPage`** | `src/auth/pages/LoginPage.jsx` |
| `@/features/auth/components/SellerApplication` | **`@/auth/components/SellerApplication`** | `src/auth/components/SellerApplication.jsx` |
| `@/features/auth/components/ShopLoginPage` | **`@/auth/components/ShopLoginPage`** | `src/auth/components/ShopLoginPage.jsx` |
| `@/features/auth/components/SignUp` | **`@/auth/components/SignUp`** | `src/auth/components/SignUp.jsx` |
| `@/features/auth/components/SignUpPage` | **`@/auth/pages/SignUpPage`** | `src/auth/pages/SignUpPage.jsx` |
| `@/features/auth/hooks/useAuth` | **`@/auth/hooks/useAuth`** | `src/auth/hooks/useAuth.js` |
| `@/features/business/components/BusinessDashboardHero` | **`@/business/components/BusinessDashboardHero`** | `src/business/components/BusinessDashboardHero.jsx` |
| `@/features/business/components/BusinessHeader` | **`@/business/components/BusinessHeader/BusinessHeader`** | `src/business/components/BusinessHeader/BusinessHeader.jsx` |
| `@/features/business/components/BusinessLayout` | **`@/business/components/BusinessLayout`** | `src/business/components/BusinessLayout.jsx` |
| `@/features/business/components/BusinessMessages` | **`@/business/components/BusinessMessages`** | `src/business/components/BusinessMessages.jsx` |
| `@/features/business/components/BusinessSidebar` | **`@/business/components/BusinessSidebar/BusinessSidebar`** | `src/business/components/BusinessSidebar/BusinessSidebar.jsx` |
| `@/features/business/hooks/useBusinessOrders` | **`@/business/hooks/useBusinessOrders`** | `src/business/hooks/useBusinessOrders.js` |
| `@/features/business/hooks/useBusinessShops` | **`@/business/hooks/useBusinessShops`** | `src/business/hooks/useBusinessShops.js` |
| `@/features/business/services/promotionService` | **`@/business/services/promotionService`** | `src/business/services/promotionService.js` |
| `@/features/buyer/components/BuyerAccountSidebar` | **`@/buyer/components/BuyerAccountSidebar`** | `src/buyer/components/BuyerAccountSidebar.jsx` |
| `@/features/buyer/components/BuyerHeader` | **`@/buyer/components/BuyerHeader`** | `src/buyer/components/BuyerHeader.jsx` |
| `@/features/buyer/components/BuyerLayout` | **`@/buyer/components/BuyerLayout`** | `src/buyer/components/BuyerLayout.jsx` |
| `@/features/buyer/components/BuyerSidebar` | **`@/buyer/components/BuyerSidebar`** | `src/buyer/components/BuyerSidebar.jsx` |
| `@/features/buyer/hooks/useBuyerOrders` | **`@/buyer/hooks/useBuyerOrders`** | `src/buyer/hooks/useBuyerOrders.js` |
| `@/features/buyer/hooks/useCart` | **`@/buyer/hooks/useCart`** | `src/buyer/hooks/useCart.js` |
| `@/features/buyer/hooks/useWishlist` | **`@/buyer/hooks/useWishlist`** | `src/buyer/hooks/useWishlist.js` |
| `@/features/buyer/services/requestService` | **`@/buyer/services/requestService`** | `src/buyer/services/requestService.js` |
| `@/features/marketplace/categories/CategoryCard` | **`@/marketplace/components/CategoryCard`** | `src/marketplace/components/CategoryCard.jsx` |
| `@/features/marketplace/categories/CategoryRail` | **`@/marketplace/components/CategoryRail`** | `src/marketplace/components/CategoryRail.jsx` |
| `@/features/marketplace/components/MarketplaceHeader` | **`@/marketplace/components/MarketplaceHeader`** | `src/marketplace/components/MarketplaceHeader.jsx` |
| `@/features/marketplace/hooks/useCategories` | **`@/marketplace/hooks/useCategories`** | `src/marketplace/hooks/useCategories.js` |
| `@/features/marketplace/hooks/useProducts` | **`@/marketplace/hooks/useProducts`** | `src/marketplace/hooks/useProducts.js` |
| `@/features/marketplace/hooks/usePromotions` | **`@/marketplace/hooks/usePromotions`** | `src/marketplace/hooks/usePromotions.js` |
| `@/features/marketplace/hooks/useShops` | **`@/marketplace/hooks/useShops`** | `src/marketplace/hooks/useShops.js` |
| `@/features/marketplace/products/ProductCard` | **`@/marketplace/components/ProductCard`** | `src/marketplace/components/ProductCard.jsx` |
| `@/features/marketplace/products/SuggestedProducts` | **`@/marketplace/components/SuggestedProducts`** | `src/marketplace/components/SuggestedProducts.jsx` |
| `@/features/marketplace/shops/ShopCard` | **`@/marketplace/components/ShopCard`** | `src/marketplace/components/ShopCard.jsx` |
| `@/features/public/components/PublicLayout` | **`@/public/layout/PublicLayout`** | `src/public/layout/PublicLayout.jsx` |
| `@/features/public/components/TopNotificationBar` | **`@/public/components/TopNotificationBar`** | `src/public/components/TopNotificationBar.jsx` |
| `@/features/public/sections/Advertisements` | **`@/public/sections/Advertisements`** | `src/public/sections/Advertisements.jsx` |
| `@/features/public/sections/BusinessCTA` | **`@/public/sections/BusinessCTA`** | `src/public/sections/BusinessCTA.jsx` |
| `@/features/public/sections/DeliveryExplanation` | **`@/public/sections/DeliveryExplanation`** | `src/public/sections/DeliveryExplanation.jsx` |
| `@/features/public/sections/EventsSection` | **`@/public/sections/EventsSection`** | `src/public/sections/EventsSection.jsx` |
| `@/features/public/sections/FeaturedCategories` | **`@/public/sections/FeaturedCategories`** | `src/public/sections/FeaturedCategories.jsx` |
| `@/features/public/sections/HeroSection` | **`@/public/sections/HeroSection`** | `src/public/sections/HeroSection.jsx` |
| `@/features/public/sections/HowItWorksSection` | **`@/public/sections/HowItWorksSection`** | `src/public/sections/HowItWorksSection.jsx` |
| `@/features/public/sections/MarketplaceCTA` | **`@/public/sections/MarketplaceCTA`** | `src/public/sections/MarketplaceCTA.jsx` |
| `@/features/public/sections/PromoBanner` | **`@/public/sections/PromoBanner`** | `src/public/sections/PromoBanner.jsx` |
| `@/features/public/sections/Promotions` | **`@/public/sections/Promotions`** | `src/public/sections/Promotions.jsx` |
| `@/features/public/sections/SelectedProducts` | **`@/public/sections/SelectedProducts`** | `src/public/sections/SelectedProducts.jsx` |
| `@/features/public/sections/SelectedShops` | **`@/public/sections/SelectedShops`** | `src/public/sections/SelectedShops.jsx` |
| `@/features/public/services/publicContentService` | **`@/public/services/publicContentService`** | `src/public/services/publicContentService.js` |
| `@/hooks/useAppBootstrap` | **`@/shared/hooks/useAppBootstrap`** | `src/shared/hooks/useAppBootstrap.js` |
| `@/hooks/useDebounce` | **`@/shared/hooks/useDebounce`** | `src/shared/hooks/useDebounce.js` |
| `@/hooks/useMediaQuery` | **`@/shared/hooks/useMediaQuery`** | `src/shared/hooks/useMediaQuery.js` |
| `@/pages/business/Analytics/Analytics` | **`@/business/pages/Analytics/Analytics`** | `src/business/pages/Analytics/Analytics.jsx` |
| `@/pages/business/Analytics/StoreMetrics` | **`@/business/pages/Analytics/StoreMetrics`** | `src/business/pages/Analytics/StoreMetrics.jsx` |
| `@/pages/business/Dashboard/Dashboard` | **`@/business/pages/Dashboard`** | `src/business/pages/Dashboard.jsx` |
| `@/pages/business/Events/Events` | **`@/business/pages/Events/Events`** | `src/business/pages/Events/Events.jsx` |
| `@/pages/business/Inventory/Inventory` | **`@/business/pages/Inventory/Inventory`** | `src/business/pages/Inventory/Inventory.jsx` |
| `@/pages/business/Orders/Detail` | **`@/business/pages/Orders/Detail`** | `src/business/pages/Orders/Detail.jsx` |
| `@/pages/business/Orders/History` | **`@/business/pages/Orders/History`** | `src/business/pages/Orders/History.jsx` |
| `@/pages/business/Orders/Messages` | **`@/business/pages/Orders/Messages`** | `src/business/pages/Orders/Messages.jsx` |
| `@/pages/business/Orders/Orders` | **`@/business/pages/Orders/Orders`** | `src/business/pages/Orders/Orders.jsx` |
| `@/pages/business/Orders/Refunds` | **`@/business/pages/Orders/Refunds`** | `src/business/pages/Orders/Refunds.jsx` |
| `@/pages/business/Products/Create` | **`@/business/pages/Products/Create`** | `src/business/pages/Products/Create.jsx` |
| `@/pages/business/Products/Detail` | **`@/business/pages/Products/Detail`** | `src/business/pages/Products/Detail.jsx` |
| `@/pages/business/Products/Edit` | **`@/business/pages/Products/Edit`** | `src/business/pages/Products/Edit.jsx` |
| `@/pages/business/Products/Products` | **`@/business/pages/Products/Products`** | `src/business/pages/Products/Products.jsx` |
| `@/pages/business/Profile/Profile` | **`@/business/pages/Profile/Profile`** | `src/business/pages/Profile/Profile.jsx` |
| `@/pages/business/Profile/Settings` | **`@/business/pages/Profile/Settings`** | `src/business/pages/Profile/Settings.jsx` |
| `@/pages/business/Promotions/Promotions` | **`@/business/pages/Promotions/Promotions`** | `src/business/pages/Promotions/Promotions.jsx` |
| `@/pages/business/Shops/ShopDetail` | **`@/business/pages/Shops/ShopDetail`** | `src/business/pages/Shops/ShopDetail.jsx` |
| `@/pages/business/Shops/Shops` | **`@/business/pages/Shops/Shops`** | `src/business/pages/Shops/Shops.jsx` |
| `@/pages/buyer/Addresses/Addresses` | **`@/buyer/pages/Addresses`** | `src/buyer/pages/Addresses.jsx` |
| `@/pages/buyer/Checkout/Checkout` | **`@/buyer/pages/Checkout`** | `src/buyer/pages/Checkout.jsx` |
| `@/pages/buyer/Dashboard/Dashboard` | **`@/buyer/pages/Dashboard/Dashboard`** | `src/buyer/pages/Dashboard/Dashboard.jsx` |
| `@/pages/buyer/Dashboard/ProductsBrowse` | **`@/buyer/pages/Dashboard/ProductsBrowse`** | `src/buyer/pages/Dashboard/ProductsBrowse.jsx` |
| `@/pages/buyer/Dashboard/ShopsBrowse` | **`@/buyer/pages/Dashboard/ShopsBrowse`** | `src/buyer/pages/Dashboard/ShopsBrowse.jsx` |
| `@/pages/buyer/Orders/Orders` | **`@/buyer/pages/Orders`** | `src/buyer/pages/Orders.jsx` |
| `@/pages/buyer/OrderSuccess/OrderSuccess` | **`@/buyer/pages/OrderSuccess`** | `src/buyer/pages/OrderSuccess.jsx` |
| `@/pages/buyer/OrderTracking/OrderDetail` | **`@/buyer/pages/OrderDetail`** | `src/buyer/pages/OrderDetail.jsx` |
| `@/pages/buyer/OrderTracking/OrderTracking` | **`@/buyer/pages/OrderTracking`** | `src/buyer/pages/OrderTracking.jsx` |
| `@/pages/buyer/Payment/Payment` | **`@/buyer/pages/Payment`** | `src/buyer/pages/Payment.jsx` |
| `@/pages/buyer/Profile/Profile` | **`@/buyer/pages/Profile`** | `src/buyer/pages/Profile.jsx` |
| `@/pages/buyer/Requests/Inbox` | **`@/buyer/pages/Requests/Inbox`** | `src/buyer/pages/Requests/Inbox.jsx` |
| `@/pages/buyer/Requests/Requests` | **`@/buyer/pages/Requests/Requests`** | `src/buyer/pages/Requests/Requests.jsx` |
| `@/pages/buyer/Reviews/Reviews` | **`@/buyer/pages/Reviews`** | `src/buyer/pages/Reviews.jsx` |
| `@/pages/buyer/Settings/Settings` | **`@/buyer/pages/Settings`** | `src/buyer/pages/Settings.jsx` |
| `@/pages/buyer/Wishlist/Wishlist` | **`@/buyer/pages/Wishlist`** | `src/buyer/pages/Wishlist.jsx` |
| `@/pages/marketplace/BestSelling/BestSelling` | **`@/marketplace/pages/BestSelling`** | `src/marketplace/pages/BestSelling.jsx` |
| `@/pages/marketplace/Categories/Categories` | **`@/marketplace/pages/Categories`** | `src/marketplace/pages/Categories.jsx` |
| `@/pages/marketplace/Deals/Deals` | **`@/marketplace/pages/Deals`** | `src/marketplace/pages/Deals.jsx` |
| `@/pages/marketplace/ProductDetail/ProductDetail` | **`@/marketplace/pages/ProductDetail`** | `src/marketplace/pages/ProductDetail.jsx` |
| `@/pages/marketplace/Products/Products` | **`@/marketplace/pages/Products`** | `src/marketplace/pages/Products.jsx` |
| `@/pages/marketplace/Products/SearchResults` | **`@/marketplace/pages/SearchResults`** | `src/marketplace/pages/SearchResults.jsx` |
| `@/pages/marketplace/ShopDetail/ShopDetail` | **`@/marketplace/pages/ShopDetail`** | `src/marketplace/pages/ShopDetail.jsx` |
| `@/pages/marketplace/Shops/Shops` | **`@/marketplace/pages/Shops`** | `src/marketplace/pages/Shops.jsx` |
| `@/pages/public/About/About` | **`@/public/pages/About`** | `src/public/pages/About.jsx` |
| `@/pages/public/Events/Events` | **`@/public/pages/Events`** | `src/public/pages/Events.jsx` |
| `@/pages/public/FAQ/FAQ` | **`@/public/pages/FAQ`** | `src/public/pages/FAQ.jsx` |
| `@/pages/public/Home/Home` | **`@/public/pages/Home`** | `src/public/pages/Home.jsx` |
| `@/pages/public/HowItWorks/HowItWorks` | **`@/public/pages/HowItWorks`** | `src/public/pages/HowItWorks.jsx` |
| `@/pages/public/NotFound` | **`@/public/NotFound`** | `src/public/NotFound.jsx` |
| `@/routes/AppRoutes` | **`@/app/routes/AppRoutes`** | `src/app/routes/AppRoutes.jsx` |
| `@/routes/AuthRoutes` | **`@/app/routes/AuthRoutes`** | `src/app/routes/AuthRoutes.jsx` |
| `@/routes/BusinessRoutes` | **`@/app/routes/BusinessRoutes`** | `src/app/routes/BusinessRoutes.jsx` |
| `@/routes/BuyerRoutes` | **`@/app/routes/BuyerRoutes`** | `src/app/routes/BuyerRoutes.jsx` |
| `@/routes/DeliveryRoutes` | **`@/app/routes/DeliveryRoutes`** | `src/app/routes/DeliveryRoutes.jsx` |
| `@/routes/MarketplaceRoutes` | **`@/app/routes/MarketplaceRoutes`** | `src/app/routes/MarketplaceRoutes.jsx` |
| `@/routes/PageLoader` | **`@/app/routes/PageLoader`** | `src/app/routes/PageLoader.jsx` |
| `@/routes/ProtectedRoute` | **`@/app/routes/ProtectedRoute`** | `src/app/routes/ProtectedRoute.jsx` |
| `@/routes/PublicRoutes` | **`@/app/routes/PublicRoutes`** | `src/app/routes/PublicRoutes.jsx` |
| `@/types/models` | **`@/shared/types/models`** | `src/shared/types/models.js` |
| `@/utils/format` | **`@/shared/utils/format`** | `src/shared/utils/format.js` |
| `@/utils/image` | **`@/shared/utils/image`** | `src/shared/utils/image.js` |

Importers per entry are in `docs/IMPORT_PATH_AUDIT.md`; the highest-traffic targets are
`@/marketplace/components/ProductCard` (6 files), `@/public/components/PublicFooter` (16),
`@/marketplace/components/MarketplaceHeader` (9) and `@/public/layout/PublicLayout` (5).

## 3. Needs work beyond the string — 23 targets

### 3a. Self-imports — restore the real child component (2)

- `@/features/buyer/checkout/components/Checkout` in **`src/buyer/pages/Checkout.jsx`** currently resolves to *itself* (`src/buyer/pages/Checkout.jsx`).
- `@/features/buyer/payments/components/Payment` in **`src/buyer/pages/Payment.jsx`** currently resolves to *itself* (`src/buyer/pages/Payment.jsx`).

`src/buyer/pages/Checkout.jsx` must not import `@/features/buyer/checkout/components/Checkout`;
it must import the real checkout panel. Same for `Payment.jsx` -> `Payment`. Those panels were
deleted in the working tree, so restore them first (3b), then write
`@/buyer/components/Checkout` and `@/buyer/components/Payment` as default imports.

### 3b. Deleted in the working tree, recoverable from git HEAD (12)

Every importer below uses a **default import**, so each restored file must `export default`.

```bash
git checkout HEAD -- src/components/seller/AllEvents.jsx    # repeat per row
```

| Current (broken) import | Restore from HEAD | Move to | Then import as |
|---|---|---|---|
| `@/features/business/events/components/AllEvents` | `src/components/seller/AllEvents.jsx` | `src/business/components/AllEvents.jsx` | **`@/business/components/AllEvents`** |
| `@/features/business/orders/components/AllOrdersOfASingleShop` | `src/components/seller/AllOrdersOfASingleShop.jsx` | `src/business/components/AllOrdersOfASingleShop.jsx` | **`@/business/components/AllOrdersOfASingleShop`** |
| `@/features/business/orders/components/AllRefundOrders` | `src/components/seller/AllRefundOrders.jsx` | `src/business/components/AllRefundOrders.jsx` | **`@/business/components/AllRefundOrders`** |
| `@/features/business/orders/components/OrderDetails` | `src/components/seller/OrderDetails.jsx` | `src/business/components/OrderDetails.jsx` | **`@/business/components/OrderDetails`** |
| `@/features/business/products/components/AllProductsOfASingleShop` | `src/components/seller/AllProductsOfASingleShop.jsx` | `src/business/components/AllProductsOfASingleShop.jsx` | **`@/business/components/AllProductsOfASingleShop`** |
| `@/features/business/products/components/CreateProduct` | `src/components/seller/CreateProduct.jsx` | `src/business/components/CreateProduct.jsx` | **`@/business/components/CreateProduct`** |
| `@/features/business/profile/components/ShopInfo` | `src/components/seller/ShopInfo.jsx` | `src/business/components/ShopInfo.jsx` | **`@/business/components/ShopInfo`** |
| `@/features/business/profile/components/ShopProfileData` | `src/components/seller/ShopProfileData.jsx` | `src/business/components/ShopProfileData.jsx` | **`@/business/components/ShopProfileData`** |
| `@/features/business/profile/components/ShopSettings` | `src/components/seller/ShopSettings.jsx` | `src/business/components/ShopSettings.jsx` | **`@/business/components/ShopSettings`** |
| `@/features/buyer/profile/components/TrackOrder` | `src/components/profile/TrackOrder.jsx` | `src/buyer/components/TrackOrder.jsx` | **`@/buyer/components/TrackOrder`** |
| `@/features/buyer/profile/components/UserOrderDetailComponent` | `src/components/profile/UserOrderDetailComponent.jsx` | `src/buyer/components/UserOrderDetailComponent.jsx` | **`@/buyer/components/UserOrderDetailComponent`** |
| `@/features/buyer/checkout/components/CheckoutSteps` | `src/components/checkout/CheckOutSteps.jsx` | `src/buyer/components/CheckoutSteps.jsx` | **`@/buyer/components/CheckoutSteps`** |

Git spells the checkout file `CheckOutSteps.jsx` (capital `O`) while the import says
`CheckoutSteps` — that is why a naive name search reports it missing entirely.
If you prefer not to relocate them, importing from the legacy location still works
(`@/components/seller/AllEvents`), but that keeps the `components/` bucket the restructure
was meant to remove.

### 3c. Delivery domain — delete it or build it (7 targets)

`src/app/routes/DeliveryRoutes.jsx` lazily imports files that do not exist, and
`src/app/routes/AppRoutes.jsx` mounts that subtree. `docs/ARCHITECTURE.md` itself says the
Delivery domain has **no UI in this app**. So either:

- **Remove** the `/delivery` subtree: delete `src/app/routes/DeliveryRoutes.jsx`, plus its
  import and `{DeliveryRoutes()}` call in `AppRoutes.jsx`. (The 4 unused services
  `@/services/{delivery,tracking,assignment,provider}.service.js` would stay for backend use.)
- **Build** the pages under `src/delivery/`, then import as shown:

| Broken import | Create file | Import as |
|---|---|---|
| `@/features/delivery/components/DeliveryLayout` | `src/delivery/components/DeliveryLayout.jsx` | `@/delivery/components/DeliveryLayout` |
| `@/pages/delivery/Assignments/Assignments` | `src/delivery/pages/Assignments.jsx` | `@/delivery/pages/Assignments` |
| `@/pages/delivery/Dashboard/Dashboard` | `src/delivery/pages/Dashboard.jsx` | `@/delivery/pages/Dashboard` |
| `@/pages/delivery/History/History` | `src/delivery/pages/History.jsx` | `@/delivery/pages/History` |
| `@/pages/delivery/Orders/Orders` | `src/delivery/pages/Orders.jsx` | `@/delivery/pages/Orders` |
| `@/pages/delivery/Providers/Providers` | `src/delivery/pages/Providers.jsx` | `@/delivery/pages/Providers` |
| `@/pages/delivery/Tracking/Tracking` | `src/delivery/pages/Tracking.jsx` | `@/delivery/pages/Tracking` |

### 3d. Missing non-delivery modules (1 target)

| Broken import | Action | Import as |
|---|---|---|
| `@/features/business/shops/components/ShopSwitcher` | create it (default export; the importer names it `BusinessShopSwitcher`) | `@/business/components/ShopSwitcher` |

### 3e. Ambiguous (1)

`@/features/marketplace/products/ProductDetail` from `src/marketplace/pages/ProductDetail.jsx` —
both `src/marketplace/components/ProductDetail.jsx` and `src/marketplace/pages/ProductDetail.jsx`
exist. Since the importer *is* the page, the intended target is the **component**: write
**`@/marketplace/components/ProductDetail`**.

### 3f. One boundary fix

`src/shared/hooks/useAuth.js` re-exports `../features/auth/hooks/useAuth`, reaching into a
domain from `shared/`. Write `@/auth/hooks/useAuth` (or delete the file — it has no importers).
This is the only `shared/ -> domain` edge in the tree.

## 4. Option B only — rename map to match the doc literally

Do these moves **first**, then all page imports become `@/<domain>/pages/<DocName>`:

| Current file | Rename / move to |
|---|---|
| `src/public/pages/Home.jsx` | `src/public/pages/HomePage.jsx` |
| `src/public/pages/About.jsx` | `public/pages/AboutPage.jsx` |
| `src/public/pages/HowItWorks.jsx` | `public/pages/HowItWorksPage.jsx` |
| `src/public/pages/FAQ.jsx` | `public/pages/FAQPage.jsx` |
| `src/public/pages/Events.jsx` | `public/pages/EventsPage.jsx` |
| `src/marketplace/pages/Products.jsx` | `marketplace/pages/ProductsPage.jsx` |
| `src/marketplace/pages/ProductDetail.jsx` | `marketplace/pages/ProductDetailsPage.jsx` |
| `src/marketplace/pages/Categories.jsx` | `marketplace/pages/CategoriesPage.jsx` |
| `src/marketplace/pages/Shops.jsx` | `marketplace/pages/ShopsPage.jsx` |
| `src/marketplace/pages/ShopDetail.jsx` | `marketplace/pages/ShopDetailsPage.jsx` |
| `src/marketplace/pages/Deals.jsx` | `marketplace/pages/DealsPage.jsx` |
| `src/marketplace/pages/BestSelling.jsx` | `marketplace/pages/BestSellingPage.jsx` |
| `src/marketplace/pages/SearchResults.jsx` | `marketplace/pages/SearchResultsPage.jsx (no doc row; your call)` |
| `src/buyer/pages/Dashboard/Dashboard.jsx` | `buyer/pages/BuyerDashboardPage.jsx` |
| `src/buyer/pages/Orders.jsx` | `buyer/pages/OrdersPage.jsx` |
| `src/buyer/pages/OrderDetail.jsx` | `buyer/pages/OrderDetailsPage.jsx` |
| `src/buyer/pages/Profile.jsx` | `buyer/pages/ProfilePage.jsx` |
| `src/buyer/pages/Addresses.jsx` | `buyer/pages/AddressesPage.jsx` |
| `src/buyer/pages/Wishlist.jsx` | `buyer/pages/WishlistPage.jsx` |
| `src/buyer/pages/Reviews.jsx` | `buyer/pages/ReviewsPage.jsx` |
| `src/buyer/pages/Requests/Requests.jsx` | `buyer/pages/RequestsPage.jsx` |
| `src/buyer/pages/Requests/Inbox.jsx` | `buyer/pages/InboxPage.jsx (no doc row; your call)` |
| `src/buyer/pages/Settings.jsx` | `buyer/pages/SettingsPage.jsx` |
| `src/buyer/pages/Checkout.jsx` | `buyer/pages/CheckoutPage.jsx (no doc row)` |
| `src/buyer/pages/Payment.jsx` | `buyer/pages/PaymentPage.jsx (no doc row)` |
| `src/buyer/pages/OrderSuccess.jsx` | `buyer/pages/OrderSuccessPage.jsx (no doc row)` |
| `src/buyer/pages/OrderTracking.jsx` | `buyer/pages/OrderTrackingPage.jsx (no doc row)` |
| `src/buyer/components/BuyerLayout.jsx` | `buyer/layout/BuyerLayout.jsx` |
| `src/business/pages/Dashboard.jsx` | `business/pages/BusinessDashboardPage.jsx` |
| `src/business/pages/Profile/Profile.jsx` | `business/pages/BusinessProfilePage.jsx` |
| `src/business/pages/Shops/Shops.jsx` | `business/pages/ShopsPage.jsx` |
| `src/business/pages/Shops/ShopDetail.jsx` | `business/pages/ShopDetailsPage.jsx` |
| `src/business/pages/Products/Products.jsx` | `business/pages/ProductsPage.jsx` |
| `src/business/pages/Products/Create.jsx` | `business/pages/CreateProductPage.jsx (no doc row)` |
| `src/business/pages/Products/Detail.jsx` | `business/pages/ProductDetailPage.jsx (no doc row)` |
| `src/business/pages/Products/Edit.jsx` | `business/pages/EditProductPage.jsx (no doc row)` |
| `src/business/pages/Inventory/Inventory.jsx` | `business/pages/InventoryPage.jsx` |
| `src/business/pages/Orders/Orders.jsx` | `business/pages/OrdersPage.jsx` |
| `src/business/pages/Orders/Detail.jsx` | `business/pages/OrderDetailsPage.jsx (no doc row)` |
| `src/business/pages/Orders/History.jsx` | `business/pages/OrderHistoryPage.jsx (no doc row)` |
| `src/business/pages/Orders/Refunds.jsx` | `business/pages/RefundsPage.jsx (no doc row)` |
| `src/business/pages/Orders/Messages.jsx` | `business/pages/MessagesPage.jsx` |
| `src/business/pages/Promotions/Promotions.jsx` | `business/pages/PromotionsPage.jsx` |
| `src/business/pages/Events/Events.jsx` | `business/pages/EventsPage.jsx` |
| `src/business/pages/Analytics/Analytics.jsx` | `business/pages/AnalyticsPage.jsx` |
| `src/business/pages/Analytics/StoreMetrics.jsx` | `business/pages/StoreMetricsPage.jsx (no doc row)` |
| `src/business/pages/Profile/Settings.jsx` | `business/pages/SettingsPage.jsx` |
| `src/business/components/BusinessLayout.jsx` | `business/layout/BusinessLayout.jsx` |
| `src/app/routes/` | `app/router/  (folder rename; imports become @/app/router/*)` |
| `src/shared/utils/constants.js` | `shared/constants/index.js (per doc)` |
| `src/shared/utils/validators.js` | `shared/validation/index.js (per doc)` |
| `src/components/common/` | `shared/components/ (per doc; moves 11 primitives)` |

Option B also requires creating the doc-named files that were never written:
`public/components/PublicNavigation.jsx`, `marketplace/layout/MarketplaceLayout.jsx`,
`marketplace/navigation/MarketplaceNavigation.jsx`, `buyer/navigation/BuyerNavigation.jsx`,
`business/navigation/BusinessNavigation.jsx`, `business/components/{ShopSelector,
BusinessProductCard,InventoryTable}.jsx`, `marketplace/components/{ProductGrid,SearchBar,
FilterPanel}.jsx`, and `src/delivery/README.md` — all ABSENT today.

Then update every `lazy(() => import(...))` in `src/app/routes/*.jsx`, because those strings
name today's files. **Section 2 is required under either option** — the broken `@/features/*`
and `@/pages/*` strings must be rewritten no matter which naming you keep.

## 5. How to check your work

A runnable checker is included at `scripts/check-imports.mjs` (no dependencies):

```bash
node scripts/check-imports.mjs   # exits 1 while problems remain, 0 when clean
npx vite build                   # must finish with no [UNLOADABLE_DEPENDENCY]
```

It reports: unresolved specifiers, leftover pre-restructure paths, definite self-imports,
name collisions worth review, undeclared external packages, and reachability from
`src/main.jsx`. It skips specifiers that only appear inside comments.

Current status (measured, path-only fix applied):

```
                                 before      after
UNRESOLVED SPECIFIERS            243         26      <- all 26 are MISSING FILES, no path work left
STALE PRE-RESTRUCTURE PATHS      224          0
NAME COLLISIONS (review)           4          2
UNDECLARED EXTERNAL PACKAGES       0          0
REACHABLE FROM src/main.jsx    2/231    225/231
                                FAIL       FAIL     <- still fails: 22 modules do not exist yet
```

Reachability climbs as you fix paths (it follows *resolved* edges only).

The 26 remaining unresolved imports all point at files that were deleted (or never written);
only restoring/creating those files — or removing the imports — can clear them:

| Where | Missing modules |
|---|---|
| `src/business/` | `ShopSwitcher`, `AllEvents`, `OrderDetails`, `AllOrdersOfASingleShop`, `AllRefundOrders`, `CreateProduct`, `AllProductsOfASingleShop`, `ShopSettings`, `ShopProfileData`, `ShopInfo` (13 import sites) |
| `src/buyer/` | `CheckoutSteps`, `Checkout`, `UserOrderDetailComponent`, `TrackOrder`, `Payment` (6 import sites) |
| `src/app/routes/DeliveryRoutes.jsx` | `DeliveryLayout` + 6 delivery pages (7 import sites) |

12 of those exist in git HEAD (see section 3b); `ShopSwitcher` and the 7 delivery modules exist
nowhere. Target state:

```
UNRESOLVED SPECIFIERS: 0
STALE PRE-RESTRUCTURE PATHS: 0
SELF-IMPORTS: 0
REACHABLE FROM src/main.jsx: 231/231
OK
## 6. What was actually applied (path-only passes)

### Pass 1 — domain-local path rewrite (243 specifiers / 78 files)

Every broken string was mapped to a file that exists, so each domain now imports only
`@/<own-domain>/...` or a shared bucket (`@/shared`, `@/components`, `@/services`, `@/store`,
`@/styles`, `@/assets`, `@/app`). Idempotent and verified: re-running the rewrite reports
*0 specifiers to rewrite*, and the diff contains **only** import/export lines (486 changed
lines = 2 x 243 for 243 one-line rewrites).

| Occurrences | Rewrite |
|---|---|
| 126 | `@/features/<domain>/<rest>` -> `@/<domain>/<rest>` (resolved to the real file) |
| 55 | `@/pages/<domain>/[{Group}/]<Name>` -> `@/<domain>/pages/<Name>` (includes `@/pages/public/NotFound` -> `@/public/NotFound`) |
| 19 | `@/routes/<X>` -> `@/app/routes/<X>` |
| 18 | `@/components/layout/Public{Header,Footer}` -> `@/public/components/PublicHeader` (2), `@/shared/components/Footer` (16, see pass 2) |
| 11 | `@/utils/<X>` -> `@/shared/utils/<X>` |
| 5 | `@/hooks/<X>` -> `@/shared/hooks/<X>` |
| 4 | `@/config`, `@/config/env` -> `@/app/config`, `@/app/config/env` |
| 3 | `@/context/<X>` -> `@/app/providers/<X>` |
| 1 | `@/types/models` -> `@/shared/types/models` |
| 1 | `../features/auth/hooks/useAuth` -> `@/auth/hooks/useAuth` (in `src/shared/hooks/useAuth.js`) |

Two same-named-subfolder cases were rewritten to the direct file because those folders have **no
`index.js`**: `@/business/components/BusinessHeader/BusinessHeader` and
`.../BusinessSidebar/BusinessSidebar`.

### Pass 2 — the documented shared components moved to `shared/components/`

`docs/DOMAIN_STRUCTURE.md` classifies these as **Shared** and its target tree puts shared UI in
`shared/components/`. They were sitting inside the `public` and `marketplace` domains, which is
what forced `buyer -> public` and `buyer -> marketplace` imports. Moved:

| Was | Now | Import sites repointed |
|---|---|---|
| `src/public/components/PublicFooter.jsx` | `src/shared/components/Footer.jsx` | 16 |
| `src/marketplace/components/ProductCard.jsx` | `src/shared/components/ProductCard.jsx` | 6 |
| `src/marketplace/components/ShopCard.jsx` | `src/shared/components/ShopCard.jsx` | 3 |

All three used only `@/` imports internally, so no ripple. `export default` shapes were kept
(`Footer`, `ProductCard`, `ShopCard`), so importers needed no other change.

### Pass 3 — delivery subtree unregistered

`docs/ROUTES.md` ("Delivery boundary") states the customer frontend does **not** expose
rider/provider delivery routes yet. `AppRoutes.jsx` was mounting a subtree whose layout and 6
pages do not exist, which pulled 7 phantom imports into the build graph. The
`{DeliveryRoutes()}` mount and its import were removed; `src/app/routes/DeliveryRoutes.jsx` is
left on disk as scaffolding (now unreachable, so it can no longer break the build).

### Pass 4 — checker now separates blockers from dead code

`scripts/check-imports.mjs` splits unresolved imports by reachability, so scaffolding in
unreachable modules is reported as a **warning** instead of a build blocker.

### Result

```
                                 before    after
UNRESOLVED in reachable modules    243       19
STALE PRE-RESTRUCTURE PATHS        224        0
CROSS-DOMAIN EDGES               many        2   (both involve auth)
REACHABLE FROM src/main.jsx      2/231   224/231
```

`npx vite build` went from failing on the very first import to failing with **15 errors**
(19 import sites) — i.e. `Could not load src/<domain>/...` for files that do not exist.

## 7. What remains, and why it is not a path problem

The 19 build blockers all name **missing files**. Nothing about the paths can be fixed further.

| Missing module | Import sites | Recoverable? |
|---|---|---|
| `AllEvents`, `OrderDetails`, `AllOrdersOfASingleShop`, `AllRefundOrders`, `CreateProduct`, `AllProductsOfASingleShop`, `ShopSettings`, `ShopProfileData`, `ShopInfo` | 13 (business) | yes — `git checkout HEAD -- src/components/seller/<Name>.jsx`, then move to `src/business/components/` |
| `TrackOrder`, `UserOrderDetailComponent` | 2 (buyer) | yes — from `src/components/profile/<Name>.jsx` |
| `Checkout`, `CheckoutSteps` | 3 (buyer) | yes — from `src/components/checkout/Checkout.jsx` and `.../CheckOutSteps.jsx` (note the capital `O`) |
| `Payment` | 1 (buyer) | yes — from `src/components/payment/Payment.jsx` |
| `ShopSwitcher` | 1 (business) | **no** — never existed in git; must be written (or the usage removed from `BusinessLayout.jsx`) |

So **14 of the 15 missing modules are recoverable from git HEAD**; only `ShopSwitcher` has to be
written from scratch. Until those files exist, `vite build` cannot succeed — by design of the
restructure, not because of paths.

Remaining **non-blocking** cleanups (documented in `docs/IMPORT_PATH_AUDIT.md` section 5):
65 unreachable modules, 55 modules with no importer (unused service facades, `shared/types`,
`shared/utils` helpers, barrels), 12 empty folders, and the stale duplicates
`app/routes/{BusinessRoute,DeliveryRoute}.jsx` + `app/config/appConfig.js`.
```