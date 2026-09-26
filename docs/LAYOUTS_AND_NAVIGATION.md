# Layouts and Navigation

> Priority 3 — Updated to reflect actual implementation after Priority 1-3 cleanup.

---

## Layouts

### PublicLayout

| Property | Value |
|---|---|
| File | `components/layout/PublicLayout.jsx` |
| Chrome | PublicHeader + `<main>{children}</main>` + Footer |
| Used By | HomePage, AboutPlatform, HowItWorks, FAQpage |
| Optional | `hideFooter` prop |
| Auth | None |

### DiscoveryLayout (implicit)

Marketplace pages do not use a shared layout wrapper — each page individually composes `DiscoveryHeader` + content + `Footer`. This is the current pattern. A `DiscoveryLayout` wrapper was not created; pages use inline composition.

### MarketplaceLayout (legacy — UNUSED)

| Property | Value |
|---|---|
| File | `components/layout/MarketplaceLayout.jsx` |
| Chrome | Header (legacy) + main + Footer |
| Used By | **NONE** — unimported |
| Auth | None |

**Status:** Unused. Legacy `Header.jsx` is used directly by some pages instead of through this layout.

### BuyerLayout (CustomerAccountLayout)

| Property | Value |
|---|---|
| File | `pages/buyer/dashboard/CustomerAccountLayout.jsx` |
| Chrome | BuyerHeader + CustomerAccountSidebar (delegates to BuyerSidebar/BusinessSidebar) + `<Outlet />` + minimal footer |
| Used By | All `/my-dashboard/*` routes |
| Auth | ProtectedRoute |
| Desktop | Sticky sidebar (264px) |
| Mobile | Hamburger drawer |

### BusinessLayout — Unified (CustomerAccountLayout)

Business routes under `/my-dashboard/business/*` use the same `CustomerAccountLayout` as buyer routes. The `CustomerAccountSidebar` delegates to `BusinessSidebar` when on `/my-dashboard/business/*` routes for approved sellers.

| Property | Value |
|---|---|
| File | `pages/buyer/dashboard/CustomerAccountLayout.jsx` (same as BuyerLayout) |
| Chrome | BuyerHeader + CustomerAccountSidebar (delegates) + `<Outlet />` + minimal footer |
| Used By | `/my-dashboard/business/*` routes |
| Auth | ProtectedRoute (sidebar delegates based on `isSeller` + route) |

### BusinessLayout — Legacy (SellerLayout)

| Property | Value |
|---|---|
| File | `src/seller/SellerLayout.jsx` |
| Chrome | DashboardHeader + SellerSidebar + `<Outlet />` + minimal seller footer |
| Used By | All `/business/*` routes (legacy) |
| Auth | ProtectedRoute + SellerAuthRoute |
| Mobile | Hamburger drawer |

**REMOVED (dead duplicate):**
- `src/components/seller/SellerLayout.jsx` — duplicate of `src/seller/SellerLayout.jsx`

---

## Headers

### PublicHeader

| Property | Value |
|---|---|
| File | `components/layout/PublicHeader.jsx` |
| Domain | Public Website |
| Sticky | Yes (top-0) |
| Logo | BrandLogo (with `linked={false}` — **FIXED**) |
| Nav Links | Home `/`, Discover dropdown (Products, Categories, Shops, Best Selling, Deals & Events) |
| CTA | Cart icon + "Marketplace" (authed) or "Enter Marketplace" (guest) |
| Mobile | Responsive nav |

**FIXED:** Nested Link issue — BrandLogo now receives `linked={false}` when wrapped in parent Link.

### DiscoveryHeader

| Property | Value |
|---|---|
| File | `components/layout/DiscoveryHeader.jsx` |
| Domain | Marketplace |
| Sticky | Yes |
| Logo | BrandLogo (with `linked={false}` — **FIXED**) |
| Nav Links | Products `/explore/products`, Categories `/explore/categories`, Shops `/shops`, Deals `/events` |
| Search | Expandable input + quick links dropdown |
| CTA | Cart icon + "Marketplace" (authed) or "Login" (guest) |
| Mobile | Search overlay |

**FIXED:** Nested Link issue — BrandLogo now receives `linked={false}` when wrapped in parent Link.
**Note:** Search is presentational (no backend search handlers — uses local Redux filtering).

### BuyerHeader

| Property | Value |
|---|---|
| File | `components/layout/BuyerHeader.jsx` |
| Domain | Buyer (+ Business unified) |
| Sticky | Yes |
| Logo | BrandLogo (with `linked={false}` — correct) |
| Search | Category dropdown + live product/shop search (Redux) |
| Quick Nav | Marketplace `/my-dashboard/marketplace`, Orders `/my-dashboard/orders` |
| Icons | Wishlist (count), Cart (count), Messages `/inbox` |
| Profile Dropdown | Dashboard, Profile, Orders, Settings, **My Business** (if seller), Logout |
| Mobile | Hamburger menu (opens sidebar) + search overlay + cart + profile avatar |

**Used by:** `CustomerAccountLayout` (buyer + business unified), `CheckoutPage`, `PaymentPage`, `OrderSuccessPage`, `UserInbox`, `TrackOrderPage`, `UserOrderDetailPage`

### DashboardHeader (Legacy Business)

| Property | Value |
|---|---|
| File | `src/components/seller/DashboardHeader.jsx` |
| Domain | Business (Legacy Seller Portal) |
| Sticky | Yes (80px) |
| Logo | Aritii logo image + "Seller Portal" text (links to `/business/dashboard`) |
| Quick Actions | Products, Orders, Analytics (desktop only, icon-only) |
| Profile Dropdown | Business (Store Profile) + Buyer (Profile, Orders, Wishlist, Addresses) + Marketplace link + Logout |
| Mobile | Hamburger (opens SellerSidebar) |

**Used by:** `SellerLayout` (legacy `/business/*` routes)

### Header (Legacy — DEPRECATED)

| Property | Value |
|---|---|
| File | `components/layout/Header.jsx` |
| Domain | Legacy Marketplace |
| Status | **DEPRECATED** — still used by `SellerApplicationPage` (fixed to DiscoveryHeader) |

**REMOVED USAGES:**
- `CheckoutPage`, `PaymentPage`, `OrderSuccessPage`, `UserInbox`, `TrackOrderPage`, `UserOrderDetailPage` — all migrated to `BuyerHeader`
- `SellerApplicationPage` — migrated to `DiscoveryHeader`

**Nested Link Issue — RESOLVED:**
All headers now correctly pass `linked={false}` to `BrandLogo` when wrapping it in a `<Link>`. Previously 3 of 4 headers had nested Links.

---

## Sidebars

### BuyerSidebar

| Property | Value |
|---|---|
| File | `src/buyer/components/BuyerSidebar.jsx` |
| Domain | Buyer |
| Used By | `CustomerAccountLayout` (via `CustomerAccountSidebar` delegate) |
| Desktop | Sticky (264px) |
| Mobile | Drawer |

**Navigation Items:**

| Item | Route | Section | Visible To |
|---|---|---|---|
| Dashboard | `/my-dashboard` | Main | All |
| Marketplace | `/my-dashboard/marketplace` | Main | All |
| Shops | `/my-dashboard/shops` | Main | All |
| Orders | `/my-dashboard/orders` | Main | All |
| Wishlist | `/my-dashboard/wishlist` | Main | All |
| Profile | `/my-dashboard/profile` | Main | All |
| Settings | `/my-dashboard/settings` | Account | All |
| **Become a Seller** | `/sell` | CTA | Non-sellers |
| Logout | Handler | Account | All |

**Business Items (Conditional):** Only visible when `isSeller === true` AND on `/my-dashboard/business/*` routes — delegated to `BusinessSidebar` instead.

### BusinessSidebar (Unified Dashboard)

| Property | Value |
|---|---|
| File | `src/business/components/BusinessSidebar.jsx` |
| Domain | Business (Unified) |
| Used By | `CustomerAccountSidebar` delegate (when on `/my-dashboard/business/*` + `isSeller`) |
| Desktop | Sticky (264px) |
| Mobile | Drawer |

**Navigation Items:**

| Item | Route | Section |
|---|---|---|
| Overview | `/my-dashboard` | Main |
| Products | `/my-dashboard/business/products` | Business Management |
| Add Product | `/my-dashboard/business/products/create` | Business Management |
| Orders | `/my-dashboard/business/orders` | Business Management |
| Analytics | `/my-dashboard/business/analytics` | Business Management |
| Inventory | `/my-dashboard/business/inventory` | Business Management |
| **Back to Dashboard** | `/my-dashboard` | Navigation |
| Profile | `/my-dashboard/profile` | Account |
| Settings | `/my-dashboard/settings` | Account |
| Logout | Handler | Account |

### SellerSidebar (Legacy Business)

| Property | Value |
|---|---|
| File | `src/seller/sidebar/SellerSidebar.jsx` |
| Domain | Business (Legacy Seller Portal) |
| Used By | `SellerLayout` |
| Active Prop | Number (1-14) |

**Navigation Items:**

| Item | Route | Section |
|---|---|---|
| Dashboard | `/business/dashboard` | Main |
| All Orders | `/business/orders` | Orders |
| All Products | `/business/products` | Products |
| Store Profile | `/business/profile` | Store |
| Add Product | `/business/products/create` | Products |
| Inventory | `/business/inventory` | Products |
| Order History | `/business/orders` (legacy) | Orders |
| Settings | `/business/settings` | Account |
| Buyer Profile | `/my-dashboard/profile` | Buyer Features |
| My Purchases | `/my-dashboard/orders` | Buyer Features |
| My Wishlist | `/my-dashboard/wishlist` | Buyer Features |
| My Addresses | `/my-dashboard/addresses` | Buyer Features |
| Marketplace | `/marketplace` (legacy) | Footer |
| View All Shops | `/shops` (legacy) | Footer |

---

## Header/Sidebar Ownership Matrix

| Domain | Routes | Header | Sidebar | Layout |
|---|---|---|---|---|
| Public | `/`, `/about`, `/how-it-works`, `/faq` | PublicHeader | — | PublicLayout |
| Marketplace | `/products`, `/shops`, `/explore/*`, `/product/:id`, `/events`, `/best-selling` | DiscoveryHeader | — | Inline (Header + Footer) |
| Buyer | `/my-dashboard/*`, `/checkout`, `/payment`, `/inbox`, `/user/order/*` | BuyerHeader | BuyerSidebar | CustomerAccountLayout |
| Business (Unified) | `/my-dashboard/business/*` | BuyerHeader | BusinessSidebar | CustomerAccountLayout |
| Business (Legacy) | `/business/*`, `/shop/:id` | DashboardHeader | SellerSidebar | SellerLayout |
| Delivery | (none yet) | — | — | — |

---

## Navigation Constants (DEPRECATED)

| File | Status | Notes |
|---|---|---|
| `data/data.jsx` — `navItems` | **ACTIVE** | Used by `Navbar` (legacy Header only) |
| `data/data.jsx` — `publicNavItems` | **UNUSED** | Hardcoded in headers now |
| `constants/navigation.js` | **UNUSED** | Not consumed |
| `constants/routes.js` | **UNUSED** | Not consumed |

**Current State:** All headers/footers hardcode their own navigation. Constants files are legacy/unused.

---

## BrandLogo Nested Link Fix — COMPLETE

| Header | Was Nested | Fix Applied |
|---|---|---|
| PublicHeader | Yes | `BrandLogo linked={false}` |
| DiscoveryHeader | Yes | `BrandLogo linked={false}` |
| Header (legacy) | Yes | Deprecated |
| BuyerHeader | No (already correct) | N/A |

---

## Layout Ownership Map (Final)

| Route Pattern | Layout | Header | Sidebar | Footer | Auth Guard |
|---|---|---|---|---|---|
| `/` | PublicLayout | PublicHeader | — | Footer | None |
| `/about` | PublicLayout | PublicHeader | — | Footer | None |
| `/how-it-works` | PublicLayout | PublicHeader | — | Footer | None |
| `/faq` | PublicLayout | PublicHeader | — | Footer | None |
| `/products` | Inline | DiscoveryHeader | — | Footer | None |
| `/best-selling` | Inline | DiscoveryHeader | — | Footer | None |
| `/events` | Inline | DiscoveryHeader | — | Footer | None |
| `/explore/*` | Inline | DiscoveryHeader | — | Footer | None |
| `/shops` | Inline | DiscoveryHeader | — | Footer | None |
| `/shops/:id` | Inline | DiscoveryHeader | — | Footer | None |
| `/product/:id` | Inline | DiscoveryHeader | — | Footer | None |
| `/checkout` | Inline | BuyerHeader | — | Footer | ProtectedRoute |
| `/payment` | Inline | BuyerHeader | — | Footer | ProtectedRoute |
| `/order/success` | Inline | BuyerHeader | — | Footer | ProtectedRoute |
| `/inbox` | Inline | BuyerHeader | — | Footer | ProtectedRoute |
| `/user/order/*` | Inline | BuyerHeader | — | Footer | ProtectedRoute |
| `/my-dashboard` | CustomerAccountLayout | BuyerHeader | BuyerSidebar | Minimal | ProtectedRoute |
| `/my-dashboard/*` (non-business) | CustomerAccountLayout | BuyerHeader | BuyerSidebar | Minimal | ProtectedRoute |
| `/my-dashboard/business/*` | CustomerAccountLayout | BuyerHeader | BusinessSidebar | Minimal | ProtectedRoute |
| `/business/*` | SellerLayout | DashboardHeader | SellerSidebar | Minimal | ProtectedRoute + SellerAuthRoute |
| `/shop/:id` | SellerLayout | DashboardHeader | SellerSidebar | Minimal | SellerAuthRoute |

---

## Key Fixes Applied

1. **Nested Links:** All BrandLogo instances in wrapped headers now use `linked={false}`
2. **Header Migration:** Checkout, Payment, OrderSuccess, UserInbox, TrackOrder, UserOrderDetail migrated from legacy Header to BuyerHeader
3. **SellerApplicationPage:** Migrated from legacy Header to DiscoveryHeader
4. **Sidebar Delegation:** CustomerAccountSidebar now delegates to BuyerSidebar or BusinessSidebar based on route
5. **Legacy Header Deprecation:** Header.jsx only used by SellerApplicationPage (now fixed)

---

**ADMIN WAS NOT TOUCHED**

**Last Updated:** September 2025  
**Priority 1-3 Complete**