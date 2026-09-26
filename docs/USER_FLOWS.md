# User Flows

> Priority 3 — Updated to reflect actual implementation after Priority 1-3 cleanup.

---

## Flow 1 — Guest Flow

```
Guest
  ↓
Public Website (/)
  ↓
  ├── Browse curated homepage content (hero, featured products, popular shops, categories, promotions)
  ├── View static pages: About (/about), How It Works (/how-it-works), FAQ (/faq)
  ├── CTA: "Explore Marketplace" → /explore/products
  ↓
Selected Product / Shop / Category
  ↓
Marketplace (/explore/products, /products, /shops, /explore/categories)
  ↓
  ├── Search products, shops, categories (DiscoveryHeader search)
  ├── Filter by category, shop, price, rating (ProductsMarketplace)
  ├── View product details (/product/:id)
  ├── View shop details (/shops/:id)
  ├── Browse categories (/explore/categories)
  ├── Browse events (/explore/events)
  ↓
Login / Signup (/login, /sign-up)
  ↓
Buyer Dashboard (/my-dashboard)
```

**Guest Limitations:**
- Cannot see full marketplace catalog (only curated content on homepage)
- Cannot add to cart
- Cannot checkout
- Cannot track orders
- Cannot manage account

---

## Flow 2 — Buyer Flow

```
Login (/login) → ProtectedRoute redirects if not authenticated
  ↓
Buyer Dashboard (/my-dashboard) — CustomerAccountLayout + BuyerHeader + BuyerSidebar
  ↓
  ├── Dashboard Overview (stats, recent orders, recommended products)
  ├── Profile (/my-dashboard/profile) — edit info, avatar
  ├── Orders (/my-dashboard/orders) — list with status badges
  ├── Addresses (/my-dashboard/addresses) — CRUD with LocationSelector
  ├── Wishlist (/my-dashboard/wishlist) — add to cart from wishlist
  ├── Reviews (/my-dashboard/reviews) — my written reviews
  ├── Settings (/my-dashboard/settings) — profile, password, notifications
  ├── Marketplace Browse (/my-dashboard/marketplace) — full catalog with filters
  ├── Shops Browse (/my-dashboard/shops) — full shop list with filters
  ↓
Search / Browse → Product Detail (/product/:id) — DiscoveryHeader
  ↓
Add to Cart (dispatches addTocart → Redux + localStorage)
  ↓
Cart Review (/checkout) — ProtectedRoute
  ↓
  ├── Select/Add shipping address (CustomerAddressesPage modal)
  ├── Review order items, apply coupon
  ├── Select delivery location (Region → City → Area → Sector → Delivery Zone)
  ↓
Payment (/payment) — ProtectedRoute
  ↓
  ├── Cash on Delivery (current only option)
  ↓
Order Success (/order/success?orderId={id}) — ProtectedRoute
  ↓
Track Order (/user/track/order/:id or /user/order/:id) — ProtectedRoute
  ↓
Delivery In Transit (managed by backend delivery-service)
  ↓
Delivered
  ↓
  ├── Write review (on product detail page)
  ├── Request refund (if applicable)
  ↓
My Orders (/my-dashboard/orders)
```

**Buyer Capabilities:**
- View order history with status badges
- Manage delivery addresses (hierarchical: Region → City → Area → Sector → Zone)
- Manage wishlist (add to cart from wishlist)
- Write reviews on purchased products
- Track orders in real-time (socket.io integration)
- Send/receive messages to sellers (inbox)
- Update profile, avatar, password, notifications

**Headers/Sidebars:**
- Header: `BuyerHeader` (search, quick nav, cart/wishlist/inbox, profile dropdown)
- Sidebar: `BuyerSidebar` (Dashboard, Marketplace, Shops, Orders, Wishlist, Profile, Settings, "Become a Seller" CTA)
- Layout: `CustomerAccountLayout` (BuyerHeader + CustomerAccountSidebar + Outlet)

---

## Flow 3 — Business/Seller Flow

### Unified Dashboard (Primary — /my-dashboard/business/*)

```
Login → /my-dashboard (Buyer Dashboard)
  ↓
User is approved seller (isSeller === true)
  ↓
Navigate to /my-dashboard/business/* → CustomerAccountSidebar delegates to BusinessSidebar
  ↓
Business Dashboard (/my-dashboard/business/products)
  ↓
  ├── Products (/my-dashboard/business/products) — list, create, edit, delete
  │   └── Uses AllProductsOfASingleShop (fetches by seller._id)
  ├── Create Product (/my-dashboard/business/products/create)
  ├── Orders (/my-dashboard/business/orders) — business orders for seller's products
  ├── Inventory (/my-dashboard/business/inventory) — stock management
  ├── Analytics (/my-dashboard/business/analytics) — revenue, orders, products, low stock
  ↓
Profile/Settings accessible via BuyerHeader profile dropdown → "My Business"
```

### Legacy Seller Portal (Legacy — /business/*)

```
Login → /business/dashboard (ProtectedRoute + SellerAuthRoute)
  ↓
SellerAuthRoute checks: isAuthenticated + isSeller
  ↓
SellerLayout + DashboardHeader + SellerSidebar
  ↓
  ├── Dashboard (/business/dashboard) — stats, recent orders, alerts
  ├── Profile (/business/profile) — shop profile editor
  ├── Products (/business/products) — list, create, edit, delete
  ├── Orders (/business/orders) — all orders for seller's products
  ├── Analytics (/business/analytics) — revenue, orders, products, stock
  ├── Messages — buyer communications
  ├── Promotions — coupons, events
  ├── Inventory — stock tracking
  ├── Settings — shop settings
  ↓
Shop Homepage (/shop/:id) — SellerAuthRoute, SellerLayout, public shop view for seller
```

### Seller Application Flow

```
Become a Seller (/sell) — DiscoveryHeader
  ↓
Not logged in → Sign in prompt
Logged in, not seller → Application form (SellerApplicationPage)
  ↓
Fill: Seller type, business info, location, shop info
  ↓
Submit → Admin review
  ↓
  ├── Approved → isSeller=true, shop created, redirect to /my-dashboard
  ├── Pending → Show status on /sell page
  ├── Rejected → Fix and reapply at /sell
```

**Seller Capabilities:**
- Create/edit/delete products (per shop via `AllProductsOfASingleShop`)
- Manage inventory (stock tracking, low stock alerts)
- View and manage business orders (update status: Processing → Shipped → Delivered)
- Create promotions (coupons) and events
- View business analytics (revenue, orders, products, stock alerts)
- Communicate with buyers (messages/inbox)
- Manage shop profile (avatar, description, contact, address)
- View seller application status

**Headers/Sidebars:**
- Unified: `BuyerHeader` + `BusinessSidebar` (via `CustomerAccountSidebar` delegate)
- Legacy: `DashboardHeader` + `SellerSidebar` (via `SellerLayout`)
- Layout: `CustomerAccountLayout` (unified) / `SellerLayout` (legacy)

---

## Flow 4 — Multiple Shop Flow

```
Business
  ├── Shop A
  │   ├── Location: Addis Ababa
  │   ├── Products: Coffee, Spices
  │   ├── Inventory: Stock tracking
  │   └── Orders: Receives orders for Shop A products
  │
  ├── Shop B
  │   ├── Location: Bahir Dar
  │   ├── Products: Textiles, Leather
  │   ├── Inventory: Stock tracking
  │   └── Orders: Receives orders for Shop B products
  │
  └── Shop C
      ├── Location: Mekelle
      ├── Products: Honey, Basketry
      ├── Inventory: Stock tracking
      └── Orders: Receives orders for Shop C products
```

**Current Implementation:** 1 Business = 1 Shop (uses `seller._id` to fetch products/orders)
**Target Implementation:** 1 Business = N Shops (planned for future)

**Changes needed:**
- Shop selector in business dashboard (header or sidebar)
- Shop-scoped product/inventory/order views
- Shop context persists across business navigation
- Backend: All queries filter by businessId + shopId

---

## Flow 5 — Delivery Flow

```
Buyer Order Placed
  ↓
Order Status: Pending
  ↓
Delivery Required (order needs fulfillment)
  ↓
Delivery Assignment (managed by backend delivery-service)
  ↓
  ├── Find Available Rider (zone-based)
  ├── Assign to Rider
  ↓
Rider Picks Up Order
  ↓
Rider In Transit
  ↓
Rider Arrives → Delivered
  ↓
Buyer Notified
  ↓
Buyer Can Rate / Request Refund
```

**Delivery States (separate from Order states):**
- Not Required → Pending Assignment → Assigned → Picked Up → In Transit → Delivered
- Possible: Failed → Retry or Returned

**Current Frontend:** No delivery UI in `src/delivery/` — boundary established for future
**Management:** Backend `delivery-service` + `Aritii-admin-web`
**Supported Models:** Aritii Delivery + External Delivery Provider

---

## Flow 6 — Order State Flow

```
Pending
  ↓
Confirmed (payment verified)
  ↓
Processing (being prepared)
  ↓
Ready (for pickup/delivery)
  ↓
Completed (delivered to buyer)
  ↗
Cancelled (before Ready — buyer or seller request)
Refunded (after Completed — dispute/return)
```

**Order Actions:**
- Buyer can cancel (before Ready)
- Buyer can request refund (after Completed)
- Seller can mark order as Ready / update status
- Admin can intervene in disputes

---

## Flow 7 — Delivery vs Order (Two Separate Lifecycles)

```
ORDER LIFECYCLE:              DELIVERY LIFECYCLE:
Pending                       Not Required
  ↓                               ↓
Confirmed                       Pending Assignment
  ↓                               ↓
Processing                      Assigned
  ↓                               ↓
Ready                           Picked Up
  ↓                               ↓
Completed                       In Transit
                                 ↓
  Cancelled                     Delivered
  Refunded                      ↓
                                 Failed → Retry / Returned
```

**Key Distinction:** Order status does NOT equal delivery status. A completed order can have a failed delivery. A cancelled order has no delivery needed.

---

## Flow 8 — Authentication Flow

```
New User
  ↓
Sign Up (/sign-up) — PKCE OAuth 2.1 flow
  ↓
Account Created → redirect to /login
  ↓
Login (/login) — PKCE flow
  ↓
Customer Login → /my-dashboard (ProtectedRoute)
```

### Seller Application Auth Flow

```
Become a Seller (/sell)
  ↓
Fill Application (shop name, details, contact, location)
  ↓
Submit → Admin review (backend)
  ↓
  ├── Approved → role=SELLER, shop created, redirect to /my-dashboard
  ├── Pending → Show status on /sell page
  └── Rejected → Fix and reapply at /sell
```

---

## Flow 9 — Checkout Flow (Buyer)

```
Cart has items
  ↓
Go to Checkout (/checkout) — ProtectedRoute
  ↓
Logged in? → Yes: continue → No: redirect to /login
  ↓
Select/Add Delivery Address (CustomerAddressesPage modal)
  ↓
  ├── Use saved address (radio selection)
  └── Add new address (form with LocationSelector: Region → City → Area → Sector → Zone)
  ↓
Review Order
  ↓
  ├── Order items summary (with qty, discountPrice, shopId)
  ├── Shipping cost calculation
  ├── Coupon code application
  ├── Total calculation
  ↓
Proceed to Payment (/payment) — ProtectedRoute
  ↓
  ├── Cash on Delivery (current only option)
  ↓
Payment Submitted (orderService.createOrder)
  ↓
Order Created → /order/success?orderId={id}
```

---

## Flow 10 — Buyer Messages Flow

```
Buyer Dashboard (/my-dashboard)
  ↓
Inbox (/inbox) — BuyerHeader, ProtectedRoute
  ↓
  ├── View conversation list (real-time via socket.io)
  ├── Open conversation
  ├── Send message (socket.io real-time)
  ├── Receive message (real-time)
  ├── Send image
  ↓
Communication with Seller
  ↓
  ├── About products
  ├── About orders
  └── About returns/refunds
```

**Known Issues:** Socket listeners not cleaned on unmount; query param parsing mismatch; send before server confirmation.

---

## Summary: Flow Access by Domain

| Flow | Guest | Buyer | Approved Seller | Admin |
|---|---|---|---|---|
| Public Website | ✅ | ✅ | ✅ | ✅ |
| Marketplace Browse | ✅ (curated) | ✅ (full) | ✅ (full) | ✅ |
| Product Detail | ✅ | ✅ | ✅ | ✅ |
| Cart/Checkout | ❌ | ✅ | ✅ | — |
| Buyer Dashboard | ❌ | ✅ | ✅ | — |
| Business Dashboard | ❌ | ❌ | ✅ | — |
| Seller Application | ✅ (apply) | ✅ (apply) | ✅ (status) | ✅ (approve) |
| Delivery Tracking | ❌ | ✅ | ✅ (own) | ✅ (all) |
| Messages | ❌ | ✅ | ✅ | — |
| Admin Dashboard | ❌ | ❌ | ❌ | ✅ |

---

**Last Updated:** September 2025  
**Priority 1-3 Complete**