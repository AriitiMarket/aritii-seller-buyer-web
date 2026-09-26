# State Structure — Current and Canonical

> Priority 3 — Updated to reflect actual implementation after Priority 1-3 cleanup.

---

## Current Redux Store

**File:** `src/store/redux/store.js`

The store uses Redux Toolkit's `configureStore` with 8 slices:

| Slice | Key | Purpose | Key State Fields |
|---|---|---|---|
| user | `state.user` | Buyer auth, profile, addresses | `isAuthenticated`, `loading`, `user`, `error`, `addresses` |
| seller | `state.seller` | Seller approval status | `isSeller`, `isLoading`, `seller` |
| products | `state.products` | Marketplace products | `isLoading`, `products`, `allProducts`, `product`, `message`, `error`, `success` |
| events | `state.events` | Marketplace events | `isLoading`, `allEvents`, `event`, `message`, `error`, `success` |
| shop | `state.shop` | Marketplace shops + categories | `shopsLoading`, `categoriesLoading`, `shops`, `categories`, `error` |
| cart | `state.cart` | Buyer cart (localStorage) | `cart`, `isLoading`, `error`, `validationResult` |
| wishlist | `state.wishlist` | Buyer wishlist (localStorage) | `wishlist` |
| order | `state.order` | Buyer + seller orders | `buyerOrdersLoading`, `sellerOrdersLoading`, `ShopOrders`, `orders`, `error` |

---

## State Ownership by Domain

### Public Website State

| Key | Slice | Data | Consumers |
|---|---|---|---|
| `state.shop.shops` | shop | Shops list | HomePage sections (PopularShops) |
| `state.shop.categories` | shop | Categories list | HomePage sections (Categories) |
| `state.products.allProducts` | products | Featured products | HomePage FeaturedProducts |

### Marketplace State

| Key | Slice | Data | Consumers |
|---|---|---|---|
| `state.products` | products | All products, single product | ProductsPage, ProductsMarketplace, BestSellingPage, ProductsDetailPage |
| `state.events` | events | All events | EventsPage, EventsMarketplace |
| `state.shop` | shop | All shops, categories | ShopsPage, ShopsMarketplace, CategoriesMarketplace |
| `state.products.allProducts` | products | All products for filters | ProductCard, SuggestedProducts |

### Buyer State

| Key | Slice | Data | Consumers |
|---|---|---|---|
| `state.user` | user | Auth, profile, addresses | All buyer pages, ProtectedRoute, HomeRoute |
| `state.cart` | cart | Cart items, validation | Checkout, Payment, ProductCard, ProductDetailsCard |
| `state.wishlist` | wishlist | Wishlist items | WishlistPage, ProductCard, ProductDetailsCard |
| `state.order.orders` | order | Buyer orders | OrdersPage, OrderDetail, TrackOrder |
| `state.order.buyerOrdersLoading` | order | Buyer loading state | OrdersPage, OrderDetail, TrackOrder |

### Business State

| Key | Slice | Data | Consumers |
|---|---|---|---|
| `state.seller` | seller | Seller auth, approval | SellerAuthRoute, Business pages |
| `state.order.ShopOrders` | order | Seller orders | SellerOrdersPage, BusinessOrdersPage |
| `state.order.sellerOrdersLoading` | order | Seller loading state | SellerOrdersPage |
| `state.products` | products | Seller's products | SellerProductsPage, BusinessProductsPage |
| `state.products.products` | products | Current shop products | AllProductsOfASingleShop |

### Delivery State

**NONE in frontend.** All delivery state is in backend (delivery-service).
Frontend only uses location/zone data via `location.service.js` for address forms.

---

## State Conflicts — RESOLVED

### Conflict 1: `product` vs `products` — **FIXED**

| Before | After | Resolution |
|---|---|---|
| `state.product` (wrong key) | `state.products` (correct store key) | Updated all components to read `state.products` |

**Fixed Files:**
- `pages/common/ProductsDetailPage.jsx` — now uses `state.products`
- `pages/buyer/reviews/CustomerReviewsPage.jsx` — now uses `state.products`
- `pages/buyer/dashboard/CustomerOverviewPage.jsx` — now uses `state.products`
- Duplicate pages in `pages/customer/account/` — also fixed

### Conflict 2: `shop` vs `shops` — **FIXED**

| Before | After | Resolution |
|---|---|---|
| `state.shops.categories` | `state.shop.categories` | Updated components to use `state.shop` |
| `state.shops.shops` | `state.shop.shops` | Updated components to use `state.shop` |

**Fixed Files:**
- `components/home/Categories.jsx` — now reads `state.shop.categories`
- `components/home/PopularShops.jsx` — now reads `state.shop.shops`
- `components/marketplace/Sponsored.jsx` — now uses `state.shop.shopsLoading`
- `pages/buyer/marketplace/DashboardShopsBrowse.jsx` — now uses `state.shop.shopsLoading`
- `pages/common/ShopsMarketplace.jsx` — now uses `state.shop.shopsLoading`
- `pages/common/ShopsPage.jsx` — now uses `state.shop.shopsLoading`

### Conflict 3: `qty` vs `quantity` (Cart) — **FIXED**

| Before | After |
|---|---|
| Header used `item.quantity` | Header now uses `item.qty` |

**Fixed File:**
- `components/layout/Header.jsx:87` — now uses `item.qty`

### Conflict 4: `cart.items` vs `cart.products` — **NOTED**

**Current:** `state.cart.cart` is an array (named `cart` not `items`)
**Canonical:** `state.cart.items` would be clearer, but current implementation uses `cart` array consistently.

### Conflict 5: `order` vs `orders` (Buyer vs Seller) — **FIXED**

| Before | After |
|---|---|
| Shared `isLoading`/`error` for buyer + seller orders | Separate `buyerOrdersLoading`/`sellerOrdersLoading` and `buyerError`/`sellerError` |
| `state.order.orders` used for both | `state.order.orders` (buyer) + `state.order.ShopOrders` (seller) |

**Fixed Files:**
- `store/redux/reducers/order.js` — separated loading states
- `pages/buyer/dashboard/CustomerOverviewPage.jsx` — uses `buyerOrdersLoading`
- `pages/buyer/reviews/CustomerReviewsPage.jsx` — uses `buyerOrdersLoading`
- `pages/buyer/orders/CustomerOrdersPage.jsx` — uses `buyerOrdersLoading`
- Duplicate pages in `pages/customer/account/` — also fixed
- Seller pages (`SellerStoreMetricsPage`, `OrderDetails`, `AllRefundOrders`, `AllOrdersOfASingleShop`) — use `sellerOrdersLoading`

### Conflict 6: `state.shop` Shared Loading — **FIXED**

| Before | After |
|---|---|
| `isLoading` shared for shops + categories | Separate `shopsLoading` and `categoriesLoading` |

**Fixed Files:**
- `store/redux/reducers/shop.js` — separate loading states
- `store/redux/actions/shop.js` — `getAllCategories` now calls `catalogService.getCategories()`
- All 4 consumers updated to use `shopsLoading`/`categoriesLoading`

---

## Canonical State Model (Implemented)

```javascript
// Store: src/store/redux/store.js
{
  // AUTHENTICATION
  user: {
    isAuthenticated: boolean,
    loading: boolean,
    user: User | null,
    error: string | null,
    addresses: Address[],
    // Actions: registerUser, loginUser, loginSeller, loadUser, logoutUser,
    //          updateUserInformation, updateUserAvatar, loadSeller,
    //          updUserAddress, deleteUserAddress
  },

  // SELLER APPROVAL
  seller: {
    isSeller: boolean,
    isLoading: boolean,
    seller: Seller | null
  },

  // MARKETPLACE PRODUCTS
  products: {
    isLoading: boolean,
    products: Product[],         // current product list (filtered/sorted)
    allProducts: Product[],      // complete unfiltered list
    product: Product | null,     // single product detail
    message: string | null,
    error: string | null,
    success: boolean,
  },

  // MARKETPLACE EVENTS
  events: {
    isLoading: boolean,
    allEvents: Event[],
    event: Event | null,
    message: string | null,
    error: string | null,
    success: boolean,
  },

  // MARKETPLACE SHOPS + CATEGORIES (SEPARATE LOADING)
  shop: {
    shopsLoading: boolean,        // shop list loading
    categoriesLoading: boolean,   // categories loading (SEPARATE)
    shops: Shop[],
    categories: Category[],
    error: string | null,
  },

  // BUYER CART
  cart: {
    cart: CartItem[],             // array of cart items (key: cart, not items)
    isLoading: boolean,
    error: string | null,
    validationResult: ValidationResult | null,
    // CartItem fields: _id, name, price, discountPrice, image, shop, shopId, qty
  },

  // BUYER WISHLIST
  wishlist: {
    wishlist: WishlistItem[],     // localStorage-backed
  },

  // ORDERS (SEPARATED)
  order: {
    buyerOrdersLoading: boolean,
    sellerOrdersLoading: boolean,
    ShopOrders: Order[],          // seller orders
    orders: Order[],              // buyer orders
    error: string | null,
  }
}
```

---

## Cart Data Contract

| Field | Type | Used By | Notes |
|---|---|---|---|
| `_id` | string | All cart operations | Product identifier |
| `shopId` | string | Cart, Checkout (coupon matching) | **Fixed: now included in wishlist→cart flow** |
| `qty` | number | All cart operations | Must be positive integer |
| `price` | number | Cart display | Base price |
| `discountPrice` | number | Cart total calculation | **Fixed: now included in wishlist→cart flow** |
| `name` | string | Cart display | Product name |
| `image` | string | Cart display | Product image |
| `shop` | object | Cart display | Shop info (name, _id) |

**Fixed:** Wishlist adds to cart now includes `discountPrice` and `shopId` fields.

---

## Cart vs Order vs Delivery State

| State Domain | Where It Lives | Persistence | Key Fields |
|---|---|---|---|
| Cart | `state.cart.cart` | localStorage | `_id`, `shopId`, `qty`, `price`, `discountPrice` |
| Current Order | `state.order.orders` (buyer) / `state.order.ShopOrders` (seller) | Redux + API | items, shipping, payment, status |
| Order History | API only | Backend | All past orders |
| Delivery | Backend only | — | Delivery tracking data |
| Wishlist | `state.wishlist.wishlist` | localStorage | productId, shopId, qty |

Cart is the ONLY state that persists to localStorage. All other state is in-memory (Redux) and re-fetched on app load.

---

## Redux Actions Summary

| Action File | Domain | Key Exports |
|---|---|---|
| `actions/user.js` | Buyer | registerUser, loginUser, loginSeller, loadUser, logoutUser, updateUserInformation, updateUserAvatar, loadSeller, logoutSeller, submitSellerApplication, updUserAddress (FIXED: uses addressService.update for edits), deleteUserAddress |
| `actions/product.js` | Marketplace | createProduct, getAllProducts, getAllProductsShop, getProductDetail, updateProduct, deleteProduct |
| `actions/order.js` | Buyer/Business | getAllOrdersOfUser, getAllOrdersOfShop, cancelOrder |
| `actions/cart.js` | Buyer | addTocart, updateCartQuantity, removeFromCart, clearCart, validateCart |
| `actions/wishlist.js` | Buyer | addToWishlist, removeFromWishlist |
| `actions/event.js` | Marketplace | createevent, getAllEventsShop, deleteEvent, getAllEvents |
| `actions/shop.js` | Marketplace | getAllShops, getAllCategories (FIXED: calls catalogService) |
| `actions/coupon.js` | Marketplace | getSellerCoupons, createCoupon, deleteCoupon |

---

## localStorage Usage

| Key | Domain | Content |
|---|---|---|
| `cartItems` | Buyer | Cart items array |
| `wishlistItems` | Buyer | Wishlist items array |

**Important:** Cart and wishlist survive page refreshes but are cleared on browser logout (since tokens are in-memory).

---

**ADMIN WAS NOT TOUCHED**

**Last Updated:** September 2025  
**Priority 1-3 Complete**