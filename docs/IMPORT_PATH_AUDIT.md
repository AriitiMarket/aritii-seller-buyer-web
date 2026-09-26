# Import / Export Path Audit

> Generated from a static resolution pass over every `import` / `export ... from` /
> dynamic `import()` specifier in `src/**/*.{js,jsx}`. No code was modified.
> Raw data: `/tmp/remap.md` (per-specifier), `/tmp/graph-out.txt` (reachability).

## 1. Headline numbers

| Metric | Value |
|---|---|
| Code files scanned | 231 |
| Local specifiers (`@/` or relative) | 545 |
| **Unresolved specifiers** | **243** |
| Distinct unresolved targets | 144 |
| External packages referenced | all declared in `package.json` |
| Mechanically fixable | 215 specifiers / 120 targets |
| Deleted-but-in-git targets | 14 specifiers / 11 targets |
| Targets that exist nowhere | 11 specifiers / 10 targets |
| Self-imports | 2 |
| Ambiguous targets | 1 |
| Reachable from `main.jsx` *after* mechanical remap | 224 / 231 |
| Still unreachable after remap (dead-code candidates) | 65 |

`npm run build` (`vite build`) currently fails with `[UNLOADABLE_DEPENDENCY]` on the
first unresolved import, so the app cannot boot at all.

## 2. Root cause

The working tree was restructured to a **flat, domain-first layout**:

```
src/{public,marketplace,buyer,business,auth}/  +  app/{config,providers,routes}  +  shared/{hooks,types,utils}
src/{components/common,styles,services,store,assets}
```

`vite.config.js` + `jsconfig.json` expose exactly one alias, `@/` -> `src/`, and the docs
(`docs/DOMAIN_STRUCTURE.md`, `docs/ARCHITECTURE.md`) describe this same layout as the target.
However the *import strings* still describe two structures that do not exist on disk and
never existed in git:

1. `@/features/<domain>/...` — a "feature folder" scheme (126 specifiers). Doc comments
   *inside the moved files* still say things like `src/features/<domain>/hooks/`.
2. `@/pages/<domain>/<Group>/<Name>` — the pre-restructure `src/pages/**` scheme (55 specifiers).

A third group had *already working* deep paths re-pointed at the old scheme (`@/routes/*`,
`@/context/*`, `@/config`, `@/utils/*`, `@/hooks/*`, `@/types/*`), because those folders were
moved under `app/` and `shared/`.

So this is not a broken alias or a case-sensitivity problem: it is an **incomplete path
rewrite after the move**, plus **12 modules deleted instead of moved** that are still
imported by the new pages (11 components + the old 404 pages).

## 3. Mechanical fixes (215 specifiers, 9 rules)

| Occurrences | Rule |
|---|---|
| 126 | `@/features/<domain>/<rest>` -> drop `features/` and resolve inside the domain folder |
| 56 | `@/pages/<domain>/[{Group}/]<Name>` -> `@/<domain>/pages/<Name>` |
| 19 | `@/routes/<X>` -> `@/app/routes/<X>` |
| 18 | `@/components/layout/Public{Header,Footer}` -> `@/public/components/Public{Header,Footer}` |
| 11 | `@/utils/<X>` -> `@/shared/utils/<X>` |
| 5 | `@/hooks/<X>` -> `@/shared/hooks/<X>` |
| 4 | `@/config`, `@/config/env` -> `@/app/config`, `@/app/config/env` |
| 3 | `@/context/<X>` -> `@/app/providers/<X>` |
| 1 | `@/types/models` -> `@/shared/types/models` |

Rule 1 needs five sub-rules because the moved files were flattened:

- `marketplace/{products,categories,shops}/<Name>` -> `@/marketplace/components/<Name>`
- `public/sections/<Name>` -> `@/public/sections/<Name>`
- `public/components/PublicLayout` -> `@/public/layout/PublicLayout`
- `auth/components/<Name>Page` -> `@/auth/pages/<Name>Page`
- `business/components/BusinessHeader|BusinessSidebar` -> `@/business/components/<Name>/<Name>`
  (both live in same-named subfolders with **no `index.js`**, so the folder path alone is not
  resolvable by Vite — import the file directly or add an `index.js`)

### Complete old -> new table (120 distinct targets)

| # | Current (broken) | Correct |
|---|---|---|
| 1 | `@/components/layout/PublicFooter` | `src/public/components/PublicFooter.jsx` |
| 2 | `@/components/layout/PublicHeader` | `src/public/components/PublicHeader.jsx` |
| 3 | `@/config` | `src/app/config/index.js` |
| 4 | `@/config/env` | `src/app/config/env.js` |
| 5 | `@/context/AppProviders` | `src/app/providers/AppProviders.jsx` |
| 6 | `@/context/LayoutContext` | `src/app/providers/LayoutContext.jsx` |
| 7 | `@/features/auth/authSlice` | `src/auth/authSlice.js` |
| 8 | `@/features/auth/components/CreateShopPage` | `src/auth/pages/CreateShopPage.jsx` |
| 9 | `@/features/auth/components/Login` | `src/auth/components/Login.jsx` |
| 10 | `@/features/auth/components/LoginPage` | `src/auth/pages/LoginPage.jsx` |
| 11 | `@/features/auth/components/SellerApplication` | `src/auth/components/SellerApplication.jsx` |
| 12 | `@/features/auth/components/ShopLoginPage` | `src/auth/components/ShopLoginPage.jsx` |
| 13 | `@/features/auth/components/SignUp` | `src/auth/components/SignUp.jsx` |
| 14 | `@/features/auth/components/SignUpPage` | `src/auth/pages/SignUpPage.jsx` |
| 15 | `@/features/auth/hooks/useAuth` | `src/auth/hooks/useAuth.js` |
| 16 | `@/features/business/components/BusinessDashboardHero` | `src/business/components/BusinessDashboardHero.jsx` |
| 17 | `@/features/business/components/BusinessHeader` | `src/business/components/BusinessHeader/BusinessHeader.jsx` |
| 18 | `@/features/business/components/BusinessLayout` | `src/business/components/BusinessLayout.jsx` |
| 19 | `@/features/business/components/BusinessMessages` | `src/business/components/BusinessMessages.jsx` |
| 20 | `@/features/business/components/BusinessSidebar` | `src/business/components/BusinessSidebar/BusinessSidebar.jsx` |
| 21 | `@/features/business/hooks/useBusinessOrders` | `src/business/hooks/useBusinessOrders.js` |
| 22 | `@/features/business/hooks/useBusinessShops` | `src/business/hooks/useBusinessShops.js` |
| 23 | `@/features/business/services/promotionService` | `src/business/services/promotionService.js` |
| 24 | `@/features/buyer/components/BuyerAccountSidebar` | `src/buyer/components/BuyerAccountSidebar.jsx` |
| 25 | `@/features/buyer/components/BuyerHeader` | `src/buyer/components/BuyerHeader.jsx` |
| 26 | `@/features/buyer/components/BuyerLayout` | `src/buyer/components/BuyerLayout.jsx` |
| 27 | `@/features/buyer/components/BuyerSidebar` | `src/buyer/components/BuyerSidebar.jsx` |
| 28 | `@/features/buyer/hooks/useBuyerOrders` | `src/buyer/hooks/useBuyerOrders.js` |
| 29 | `@/features/buyer/hooks/useCart` | `src/buyer/hooks/useCart.js` |
| 30 | `@/features/buyer/hooks/useWishlist` | `src/buyer/hooks/useWishlist.js` |
| 31 | `@/features/buyer/services/requestService` | `src/buyer/services/requestService.js` |
| 32 | `@/features/marketplace/categories/CategoryCard` | `src/marketplace/components/CategoryCard.jsx` |
| 33 | `@/features/marketplace/categories/CategoryRail` | `src/marketplace/components/CategoryRail.jsx` |
| 34 | `@/features/marketplace/components/MarketplaceHeader` | `src/marketplace/components/MarketplaceHeader.jsx` |
| 35 | `@/features/marketplace/hooks/useCategories` | `src/marketplace/hooks/useCategories.js` |
| 36 | `@/features/marketplace/hooks/useProducts` | `src/marketplace/hooks/useProducts.js` |
| 37 | `@/features/marketplace/hooks/usePromotions` | `src/marketplace/hooks/usePromotions.js` |
| 38 | `@/features/marketplace/hooks/useShops` | `src/marketplace/hooks/useShops.js` |
| 39 | `@/features/marketplace/products/ProductCard` | `src/marketplace/components/ProductCard.jsx` |
| 40 | `@/features/marketplace/products/SuggestedProducts` | `src/marketplace/components/SuggestedProducts.jsx` |
| 41 | `@/features/marketplace/shops/ShopCard` | `src/marketplace/components/ShopCard.jsx` |
| 42 | `@/features/public/components/PublicLayout` | `src/public/layout/PublicLayout.jsx` |
| 43 | `@/features/public/components/TopNotificationBar` | `src/public/components/TopNotificationBar.jsx` |
| 44 | `@/features/public/sections/Advertisements` | `src/public/sections/Advertisements.jsx` |
| 45 | `@/features/public/sections/BusinessCTA` | `src/public/sections/BusinessCTA.jsx` |
| 46 | `@/features/public/sections/DeliveryExplanation` | `src/public/sections/DeliveryExplanation.jsx` |
| 47 | `@/features/public/sections/EventsSection` | `src/public/sections/EventsSection.jsx` |
| 48 | `@/features/public/sections/FeaturedCategories` | `src/public/sections/FeaturedCategories.jsx` |
| 49 | `@/features/public/sections/HeroSection` | `src/public/sections/HeroSection.jsx` |
| 50 | `@/features/public/sections/HowItWorksSection` | `src/public/sections/HowItWorksSection.jsx` |
| 51 | `@/features/public/sections/MarketplaceCTA` | `src/public/sections/MarketplaceCTA.jsx` |
| 52 | `@/features/public/sections/PromoBanner` | `src/public/sections/PromoBanner.jsx` |
| 53 | `@/features/public/sections/Promotions` | `src/public/sections/Promotions.jsx` |
| 54 | `@/features/public/sections/SelectedProducts` | `src/public/sections/SelectedProducts.jsx` |
| 55 | `@/features/public/sections/SelectedShops` | `src/public/sections/SelectedShops.jsx` |
| 56 | `@/features/public/services/publicContentService` | `src/public/services/publicContentService.js` |
| 57 | `@/hooks/useAppBootstrap` | `src/shared/hooks/useAppBootstrap.js` |
| 58 | `@/hooks/useDebounce` | `src/shared/hooks/useDebounce.js` |
| 59 | `@/hooks/useMediaQuery` | `src/shared/hooks/useMediaQuery.js` |
| 60 | `@/pages/business/Analytics/Analytics` | `src/business/pages/Analytics/Analytics.jsx` |
| 61 | `@/pages/business/Analytics/StoreMetrics` | `src/business/pages/Analytics/StoreMetrics.jsx` |
| 62 | `@/pages/business/Dashboard/Dashboard` | `src/business/pages/Dashboard.jsx` |
| 63 | `@/pages/business/Events/Events` | `src/business/pages/Events/Events.jsx` |
| 64 | `@/pages/business/Inventory/Inventory` | `src/business/pages/Inventory/Inventory.jsx` |
| 65 | `@/pages/business/Orders/Detail` | `src/business/pages/Orders/Detail.jsx` |
| 66 | `@/pages/business/Orders/History` | `src/business/pages/Orders/History.jsx` |
| 67 | `@/pages/business/Orders/Messages` | `src/business/pages/Orders/Messages.jsx` |
| 68 | `@/pages/business/Orders/Orders` | `src/business/pages/Orders/Orders.jsx` |
| 69 | `@/pages/business/Orders/Refunds` | `src/business/pages/Orders/Refunds.jsx` |
| 70 | `@/pages/business/Products/Create` | `src/business/pages/Products/Create.jsx` |
| 71 | `@/pages/business/Products/Detail` | `src/business/pages/Products/Detail.jsx` |
| 72 | `@/pages/business/Products/Edit` | `src/business/pages/Products/Edit.jsx` |
| 73 | `@/pages/business/Products/Products` | `src/business/pages/Products/Products.jsx` |
| 74 | `@/pages/business/Profile/Profile` | `src/business/pages/Profile/Profile.jsx` |
| 75 | `@/pages/business/Profile/Settings` | `src/business/pages/Profile/Settings.jsx` |
| 76 | `@/pages/business/Promotions/Promotions` | `src/business/pages/Promotions/Promotions.jsx` |
| 77 | `@/pages/business/Shops/ShopDetail` | `src/business/pages/Shops/ShopDetail.jsx` |
| 78 | `@/pages/business/Shops/Shops` | `src/business/pages/Shops/Shops.jsx` |
| 79 | `@/pages/buyer/Addresses/Addresses` | `src/buyer/pages/Addresses.jsx` |
| 80 | `@/pages/buyer/Checkout/Checkout` | `src/buyer/pages/Checkout.jsx` |
| 81 | `@/pages/buyer/Dashboard/Dashboard` | `src/buyer/pages/Dashboard/Dashboard.jsx` |
| 82 | `@/pages/buyer/Dashboard/ProductsBrowse` | `src/buyer/pages/Dashboard/ProductsBrowse.jsx` |
| 83 | `@/pages/buyer/Dashboard/ShopsBrowse` | `src/buyer/pages/Dashboard/ShopsBrowse.jsx` |
| 84 | `@/pages/buyer/Orders/Orders` | `src/buyer/pages/Orders.jsx` |
| 85 | `@/pages/buyer/OrderSuccess/OrderSuccess` | `src/buyer/pages/OrderSuccess.jsx` |
| 86 | `@/pages/buyer/OrderTracking/OrderDetail` | `src/buyer/pages/OrderDetail.jsx` |
| 87 | `@/pages/buyer/OrderTracking/OrderTracking` | `src/buyer/pages/OrderTracking.jsx` |
| 88 | `@/pages/buyer/Payment/Payment` | `src/buyer/pages/Payment.jsx` |
| 89 | `@/pages/buyer/Profile/Profile` | `src/buyer/pages/Profile.jsx` |
| 90 | `@/pages/buyer/Requests/Inbox` | `src/buyer/pages/Requests/Inbox.jsx` |
| 91 | `@/pages/buyer/Requests/Requests` | `src/buyer/pages/Requests/Requests.jsx` |
| 92 | `@/pages/buyer/Reviews/Reviews` | `src/buyer/pages/Reviews.jsx` |
| 93 | `@/pages/buyer/Settings/Settings` | `src/buyer/pages/Settings.jsx` |
| 94 | `@/pages/buyer/Wishlist/Wishlist` | `src/buyer/pages/Wishlist.jsx` |
| 95 | `@/pages/marketplace/BestSelling/BestSelling` | `src/marketplace/pages/BestSelling.jsx` |
| 96 | `@/pages/marketplace/Categories/Categories` | `src/marketplace/pages/Categories.jsx` |
| 97 | `@/pages/marketplace/Deals/Deals` | `src/marketplace/pages/Deals.jsx` |
| 98 | `@/pages/marketplace/ProductDetail/ProductDetail` | `src/marketplace/pages/ProductDetail.jsx` |
| 99 | `@/pages/marketplace/Products/Products` | `src/marketplace/pages/Products.jsx` |
| 100 | `@/pages/marketplace/Products/SearchResults` | `src/marketplace/pages/SearchResults.jsx` |
| 101 | `@/pages/marketplace/ShopDetail/ShopDetail` | `src/marketplace/pages/ShopDetail.jsx` |
| 102 | `@/pages/marketplace/Shops/Shops` | `src/marketplace/pages/Shops.jsx` |
| 103 | `@/pages/public/About/About` | `src/public/pages/About.jsx` |
| 104 | `@/pages/public/Events/Events` | `src/public/pages/Events.jsx` |
| 105 | `@/pages/public/FAQ/FAQ` | `src/public/pages/FAQ.jsx` |
| 106 | `@/pages/public/Home/Home` | `src/public/pages/Home.jsx` |
| 107 | `@/pages/public/HowItWorks/HowItWorks` | `src/public/pages/HowItWorks.jsx` |
| 108 | `@/pages/public/NotFound` | `src/public/NotFound.jsx` |
| 109 | `@/routes/AppRoutes` | `src/app/routes/AppRoutes.jsx` |
| 110 | `@/routes/AuthRoutes` | `src/app/routes/AuthRoutes.jsx` |
| 111 | `@/routes/BusinessRoutes` | `src/app/routes/BusinessRoutes.jsx` |
| 112 | `@/routes/BuyerRoutes` | `src/app/routes/BuyerRoutes.jsx` |
| 113 | `@/routes/DeliveryRoutes` | `src/app/routes/DeliveryRoutes.jsx` |
| 114 | `@/routes/MarketplaceRoutes` | `src/app/routes/MarketplaceRoutes.jsx` |
| 115 | `@/routes/PageLoader` | `src/app/routes/PageLoader.jsx` |
| 116 | `@/routes/ProtectedRoute` | `src/app/routes/ProtectedRoute.jsx` |
| 117 | `@/routes/PublicRoutes` | `src/app/routes/PublicRoutes.jsx` |
| 118 | `@/types/models` | `src/shared/types/models.js` |
| 119 | `@/utils/format` | `src/shared/utils/format.js` |
| 120 | `@/utils/image` | `src/shared/utils/image.js` |

Per-entry importer lists are in `/tmp/remap.md`. The heaviest consumers are
`@/features/business/orders/components/AllOrdersOfASingleShop` (2 files) and
`@/features/marketplace/products/ProductCard` (6 files).

## 4. Non-mechanical breaks
### 4a. Self-imports (infinite render) — 2

- `@/features/buyer/checkout/components/Checkout` -> resolves to **`src/buyer/pages/Checkout.jsx`**, which is the importing file (src/buyer/pages/Checkout.jsx:5).
- `@/features/buyer/payments/components/Payment` -> resolves to **`src/buyer/pages/Payment.jsx`**, which is the importing file (src/buyer/pages/Payment.jsx:3).

`src/buyer/pages/Checkout.jsx` is the old *wrapper page*: it renders `<Checkout />` and
`<CheckoutSteps />` around `BuyerHeader`. After the move it imports itself. Same for
`src/buyer/pages/Payment.jsx` -> `<Payment />`. Both must import the child component, not
themselves.

### 4b. Ambiguous target — 1

- `@/features/marketplace/products/ProductDetail` (from src/marketplace/pages/ProductDetail.jsx:6) -> `src/marketplace/components/ProductDetail.jsx | src/marketplace/pages/ProductDetail.jsx`

`src/marketplace/pages/ProductDetail.jsx` already exists, so the intended target is the
**component** `src/marketplace/components/ProductDetail.jsx` (full detail content).

### 4c. Deleted in the working tree but present in git HEAD — 11 targets

These were removed instead of relocated, yet the new domain pages still import them:

| Old path (in HEAD) | Current import | Imported by | Suggested new home |
|---|---|---|---|
| `src/components/seller/AllEvents.jsx` | `@/features/business/events/components/AllEvents` | src/business/pages/Events/Events.jsx:1 | `@/business/components/` |
| `src/components/seller/AllOrdersOfASingleShop.jsx` | `@/features/business/orders/components/AllOrdersOfASingleShop` | src/business/pages/Orders/History.jsx:1, src/business/pages/Orders/Orders.jsx:1 | `@/business/components/` |
| `src/components/seller/AllRefundOrders.jsx` | `@/features/business/orders/components/AllRefundOrders` | src/business/pages/Orders/Refunds.jsx:1 | `@/business/components/` |
| `src/components/seller/OrderDetails.jsx` | `@/features/business/orders/components/OrderDetails` | src/business/pages/Orders/Detail.jsx:1 | `@/business/components/` |
| `src/components/seller/AllProductsOfASingleShop.jsx` | `@/features/business/products/components/AllProductsOfASingleShop` | src/business/pages/Products/Products.jsx:1 | `@/business/components/` |
| `src/components/seller/CreateProduct.jsx` | `@/features/business/products/components/CreateProduct` | src/business/pages/Products/Create.jsx:1 | `@/business/components/` |
| `src/components/seller/ShopInfo.jsx` | `@/features/business/profile/components/ShopInfo` | src/business/pages/Shops/Shops.jsx:4 | `@/business/components/` |
| `src/components/seller/ShopProfileData.jsx` | `@/features/business/profile/components/ShopProfileData` | src/business/pages/Shops/ShopDetail.jsx:4, src/business/pages/Shops/Shops.jsx:5 | `@/business/components/` |
| `src/components/seller/ShopSettings.jsx` | `@/features/business/profile/components/ShopSettings` | src/business/pages/Profile/Profile.jsx:1, src/business/pages/Profile/Settings.jsx:1 | `@/business/components/` |
| `src/components/profile/TrackOrder.jsx` | `@/features/buyer/profile/components/TrackOrder` | src/buyer/pages/OrderTracking.jsx:3 | `@/buyer/components/` |
| `src/components/profile/UserOrderDetailComponent.jsx` | `@/features/buyer/profile/components/UserOrderDetailComponent` | src/buyer/pages/OrderDetail.jsx:3 | `@/buyer/components/` |
| `src/pages/{common,marketplace,public}/NotFound.jsx` | `@/pages/public/NotFound` | AppRoutes.jsx:14 | `@/public/NotFound` (already exists — use it) |
| `src/components/checkout/CheckOutSteps.jsx` | `@/features/buyer/checkout/components/CheckoutSteps` | buyer/pages/Checkout.jsx, Payment.jsx | `@/buyer/components/CheckoutSteps.jsx` |

Restore with e.g. `git checkout HEAD -- src/components/seller/AllEvents.jsx`, move it to the
suggested home, then update the importer. Two notes:

- `@/pages/public/NotFound` is actually mechanically fixable — `src/public/NotFound.jsx`
  already exists, so point it there instead of restoring the deleted copies.
- `CheckoutSteps` was classified as "exists nowhere" only because git spells the deleted file
  `CheckOutSteps.jsx` (capital `O`) while the import says `CheckoutSteps`. The file is
  recoverable from HEAD under that name.

### 4d. Exist nowhere (frontend code was never written) — 10 targets

- `../features/auth/hooks/useAuth` (src/shared/hooks/useAuth.js:1)
- `@/features/business/shops/components/ShopSwitcher` (src/business/components/BusinessLayout.jsx:4)
- `@/features/buyer/checkout/components/CheckoutSteps` (src/buyer/pages/Checkout.jsx:4, src/buyer/pages/Payment.jsx:4)
- `@/features/delivery/components/DeliveryLayout` (src/app/routes/DeliveryRoutes.jsx:12)
- `@/pages/delivery/Assignments/Assignments` (src/app/routes/DeliveryRoutes.jsx:15)
- `@/pages/delivery/Dashboard/Dashboard` (src/app/routes/DeliveryRoutes.jsx:13)
- `@/pages/delivery/History/History` (src/app/routes/DeliveryRoutes.jsx:18)
- `@/pages/delivery/Orders/Orders` (src/app/routes/DeliveryRoutes.jsx:14)
- `@/pages/delivery/Providers/Providers` (src/app/routes/DeliveryRoutes.jsx:17)
- `@/pages/delivery/Tracking/Tracking` (src/app/routes/DeliveryRoutes.jsx:16)

Two clusters:

1. **Delivery domain has no implementation.** `src/app/routes/DeliveryRoutes.jsx` lazily
   imports a layout plus 6 pages that do not exist, and `AppRoutes.jsx` mounts the subtree.
   `docs/ARCHITECTURE.md` states the Delivery domain "does NOT exist in frontend". Either
   build it under `src/delivery/` or delete `DeliveryRoutes.jsx` and its `<Route>` usage.
   Note `@/services/{delivery,tracking,assignment,provider}.service.js` already exist and are
   currently unreferenced.
2. **`ShopSwitcher`** used by `BusinessLayout` — needs creating under `@/business/components/`.
## 5. Structural findings (independent of the broken paths)

1. **Empty directories (12)** left by the move: `src/assets/{fonts,icons}`;
   `src/business/{layout,navigation}`; `src/business/components/{BusinessStats,
   InventoryManagement,OrderManagement,ProductManagement}`; `src/buyer/{layout,navigation}`;
   `src/marketplace/{layout,navigation}`. These empty domain folders make
   `@/features/<domain>/layout/...` look plausible — populate or remove them.
2. **Duplicate / stale modules:**
   - `src/app/routes/BusinessRoute.jsx` + `DeliveryRoute.jsx` are one-line re-exports of
     `ProtectedRoute` (singular shadows of the real plural route files). Unreferenced.
   - `src/app/config/appConfig.js` is a legacy alias re-exporting `./env`; `index.js` is the
     real config. Unreferenced.
   - `src/components/common/index.js` barrel is unreferenced: consumers import
     `@/components/common/<X>` directly (61 direct specifiers).
3. **Dead service facades:** all 15 files under `src/{business,buyer,marketplace}/services/`
   are thin `export ... from '@/services/*.service'` re-exports with **zero importers** — pages
   import `@/services/*` directly (10 + 8 + 8 + 5 + 4 specifiers). The facade layer is
   architecturally intended (docs/API_STRUCTURE.md) but currently unused: route pages through
   it or drop it.
4. **Dead domain hook barrels:** `src/{business,buyer,marketplace}/hooks/index.js` have no
   importers — because their own contents still point at `@/features/...`. Fixing rule 1 fixes them.
5. **`src/shared/hooks/useAuth.js`** re-exports `../features/auth/hooks/useAuth`, i.e. it reaches
   *into a domain* from `shared/`; the correct path is `@/auth/hooks/useAuth`. It is the only
   `shared/ -> domain` dependency in the tree — decide whether this facade should exist.
6. **Unused shared/types + shared/utils:** 13 of 14 `src/shared/types/*` files and
   `src/shared/utils/{constants,formatDate,helpers,validators,index}.js` have no importers.
7. **False positives in the raw scan** (no action needed): `src/assets/index.js` line 3 is a
   comment containing `import ... from '../assets/...svg'`; and the two "named export not found"
   hits (`inventoryService.js`, `common/index.js`) are `export { default, X as Y }` re-export
   syntax, not real mismatches.
8. **Stale doc strings inside code** referencing removed paths: `src/components/common/index.js`
   (`@/features/<domain>/components/`), `src/shared/hooks/index.js` (`src/features/<domain>/hooks/`),
   `src/store/index.js` (`src/features/auth/authSlice.js`), `src/services/provider.service.js`
   ("declared in `src/config/index.js`"), `src/business/services/inventoryService.js`.

## 6. Reachability (after applying the mechanical remap only)

Reachable from `src/main.jsx`: **224 / 231** files. The files below remain unreachable, i.e.
they are dead or become reachable only once the non-mechanical items in section 4 are resolved:

- `src/app/config/appConfig.js`
- `src/app/providers/ThemeContext.jsx`
- `src/app/providers/index.js`
- `src/app/routes/BusinessRoute.jsx`
- `src/app/routes/DeliveryRoute.jsx`
- `src/app/routes/index.js`
- `src/auth/components/index.js`
- `src/auth/services/authService.js`
- `src/business/hooks/index.js`
- `src/business/hooks/useBusinessOrders.js`
- `src/business/services/businessService.js`
- `src/business/services/eventService.js`
- `src/business/services/inventoryService.js`
- `src/business/services/orderService.js`
- `src/business/services/productService.js`
- `src/business/services/shopService.js`
- `src/buyer/hooks/index.js`
- `src/buyer/hooks/useBuyerOrders.js`
- `src/buyer/hooks/useCart.js`
- `src/buyer/hooks/useWishlist.js`
- `src/buyer/services/cartService.js`
- `src/buyer/services/checkoutService.js`
- `src/buyer/services/orderService.js`
- `src/buyer/services/paymentService.js`
- `src/buyer/services/profileService.js`
- `src/buyer/services/reviewService.js`
- `src/buyer/services/wishlistService.js`
- `src/components/common/Modal/Modal.jsx`
- `src/components/common/Modal/index.js`
- `src/components/common/index.js`
- `src/marketplace/hooks/index.js`
- `src/marketplace/services/categoryService.js`
- `src/marketplace/services/productService.js`
- `src/marketplace/services/shopService.js`
- `src/public/NotFound.jsx`
- `src/services/assignment.service.js`
- `src/services/delivery.service.js`
- `src/services/event.service.js`
- `src/services/provider.service.js`
- `src/services/review.service.js`
- `src/services/tracking.service.js`
- `src/shared/hooks/index.js`
- `src/shared/hooks/useAuth.js`
- `src/shared/hooks/useResponsive.js`
- `src/shared/types/business.types.js`
- `src/shared/types/cart.types.js`
- `src/shared/types/category.types.js`
- `src/shared/types/delivery.types.js`
- `src/shared/types/event.types.js`
- `src/shared/types/index.js`
- `src/shared/types/models.js`
- `src/shared/types/order.types.js`
- `src/shared/types/payment.types.js`
- `src/shared/types/product.types.js`
- `src/shared/types/promotion.types.js`
- `src/shared/types/request.types.js`
- `src/shared/types/shop.types.js`
- `src/shared/types/user.types.js`
- `src/shared/utils/constants.js`
- `src/shared/utils/formatDate.js`
- `src/shared/utils/helpers.js`
- `src/shared/utils/index.js`
- `src/shared/utils/validators.js`
- `src/styles/index.js`
- `src/styles/theme.js`

Files with no importer at all, even after remap: 56 — mostly barrels and the
facades already listed in section 5:

- `src/app/config/appConfig.js`
- `src/app/providers/ThemeContext.jsx`
- `src/app/providers/index.js`
- `src/app/routes/BusinessRoute.jsx`
- `src/app/routes/DeliveryRoute.jsx`
- `src/app/routes/index.js`
- `src/auth/components/index.js`
- `src/auth/services/authService.js`
- `src/business/hooks/index.js`
- `src/business/services/businessService.js`
- `src/business/services/eventService.js`
- `src/business/services/inventoryService.js`
- `src/business/services/orderService.js`
- `src/business/services/productService.js`
- `src/business/services/shopService.js`
- `src/buyer/hooks/index.js`
- `src/buyer/services/cartService.js`
- `src/buyer/services/checkoutService.js`
- `src/buyer/services/orderService.js`
- `src/buyer/services/paymentService.js`
- `src/buyer/services/profileService.js`
- `src/buyer/services/reviewService.js`
- `src/buyer/services/wishlistService.js`
- `src/components/common/Modal/index.js`
- `src/components/common/index.js`
- `src/marketplace/hooks/index.js`
- `src/marketplace/services/categoryService.js`
- `src/marketplace/services/productService.js`
- `src/marketplace/services/shopService.js`
- `src/public/NotFound.jsx`
- `src/services/assignment.service.js`
- `src/services/delivery.service.js`
- `src/services/provider.service.js`
- `src/services/tracking.service.js`
- `src/shared/hooks/index.js`
- `src/shared/hooks/useAuth.js`
- `src/shared/hooks/useResponsive.js`
- `src/shared/types/business.types.js`
- `src/shared/types/cart.types.js`
- `src/shared/types/category.types.js`
- `src/shared/types/delivery.types.js`
- `src/shared/types/event.types.js`
- `src/shared/types/index.js`
- `src/shared/types/order.types.js`
- `src/shared/types/payment.types.js`
- `src/shared/types/product.types.js`
- `src/shared/types/promotion.types.js`
- `src/shared/types/request.types.js`
- `src/shared/types/shop.types.js`
- `src/shared/types/user.types.js`
- `src/shared/utils/constants.js`
- `src/shared/utils/formatDate.js`
- `src/shared/utils/helpers.js`
- `src/shared/utils/index.js`
- `src/shared/utils/validators.js`
- `src/styles/index.js`

## 7. Recommended fix order

1. Apply the 215 mechanical rewrites (section 3 table). Textual only, no logic change.
2. Fix the 2 self-imports in `buyer/pages/{Checkout,Payment}.jsx` and restore `CheckoutSteps`
   (`git checkout HEAD -- src/components/checkout/CheckOutSteps.jsx`).
3. Restore the other deleted components from git into their new homes (section 4c).
4. Decide the Delivery domain: build `src/delivery/**` or delete the `/delivery` subtree.
5. Create `ShopSwitcher` or remove its usage from `BusinessLayout`.
6. Delete stale duplicates (`*Route.jsx`, `appConfig.js`, unused barrels) and the 12 empty
   folders; resolve the unused facade layer (`*/services`, `shared/types`).
7. Verify: `npx vite build` succeeds, reachable == 231, and this audit reports 0 unresolved.

## 8. Verification commands used

```bash
npx vite build            # currently fails: [UNLOADABLE_DEPENDENCY] @/context/AppProviders
node /tmp/report.mjs      # unresolved + named-export mismatches + orphans + duplicate basenames
node /tmp/remap.mjs       # old -> new mapping, each candidate validated against the filesystem
node /tmp/graph.mjs       # BFS reachability from src/main.jsx
node /tmp/rules.mjs       # grouped remap rules
```