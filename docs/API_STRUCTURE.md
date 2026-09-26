# API Structure — Service Ownership

> Priority 3 — Updated to reflect actual implementation after Priority 1-3 cleanup.

---

## Service Layer Overview

All API calls go through service files in `src/services/`. No UI component should make raw API calls directly.

```
src/services/
├── api.js              # Core HTTP layer (ALL domains)
├── auth.service.js     # Authentication
├── product.service.js  # Products (Marketplace + Business)
├── shop.service.js     # Shops (Marketplace + Business)
├── order.service.js    # Orders (Buyer + Business)
├── seller.service.js   # Seller/Business operations
├── catalog.service.js  # Categories, Events, Coupons
├── address.service.js  # Buyer addresses
├── location.service.js # Delivery zones/locations
├── cache.js            # Request cache with TTL
├── tokenStore.js       # Token management
├── pkce.js             # PKCE OAuth helpers
└── index.js            # Barrel export
```

---

## API Base Configuration

| Property | Value |
|---|---|
| Base URL | `http://localhost:8000/api` (configurable via `VITE_API_URL`) |
| File | `src/services/api.js` |
| Auth | Bearer token via axios interceptor (access token from `tokenStore`) |
| Token Refresh | Automatic via `tokenStore.js` using `POST /auth/token` |
| Cache | Custom CacheManager with TTL (`src/services/cache.js`) |

---

## Service Ownership by Domain

### Public Website

| Service | Endpoints | Used By |
|---|---|---|
| `catalog.service.js` | `/category/get-all-categories` | CategoriesMarketplace (via `getAllCategories` action) |
| `shop.service.js` | `/shop/get-all-shops`, `/shop/get-shop-info/:id` | ShopsPage, ShopDetailsPage, HomePage sections |
| `product.service.js` | `/product/get-all-products` (via action) | HomePage FeaturedProducts |
| `auth.service.js` | `/user/getuser` | HomeRoute (check if user is logged in) |

### Marketplace

| Service | Endpoints | Used By |
|---|---|---|
| `product.service.js` | `/product/get-all-products` (cached 2min), `/product/get-product/:id` (15min), `/product/get-all-products-shop/:id` (10min) | ProductsPage, ProductsMarketplace, BestSellingPage, ProductsDetailPage |
| `shop.service.js` | `/shop/get-all-shops` (15min cache), `/shop/get-shop-info/:id` (20min cache) | ShopsPage, ShopsMarketplace, ShopDetailsPage |
| `catalog.service.js` | `/event/get-all-events`, `/coupon/get-coupon-value/:code` | EventsPage, EventsMarketplace, CheckoutPage (coupon) |

### Buyer

| Service | Endpoints | Used By |
|---|---|---|
| `auth.service.js` | `/auth/register`, `/auth/authorize`, `/auth/token`, `/auth/revoke`, `/user/getuser`, `/user/update-user-info`, `/user/update-avatar` | Login, SignUp, ShopLogin, ProfilePage, CustomerProfilePage |
| `order.service.js` | `/order/create-order`, `/order/get-all-orders/user/:id`, `/order/order/:id`, `/order/cancel/:id` | CheckoutPage, PaymentPage, OrdersPage, OrderDetailsPage, TrackOrderPage |
| `address.service.js` | `GET /address`, `POST /address`, `PUT /address/:id`, `DELETE /address/:id` | CustomerAddressesPage |
| `catalog.service.js` | Coupon validation | CheckoutPage (coupon) |
| `cart` (Redux) | addToCart, updateCartQuantity, removeFromCart, clearCart, validateCart | Checkout, ProductCard, ProductDetailsCard |
| `wishlist` (Redux) | addToWishlist, removeFromWishlist | WishlistPage, ProductCard, ProductDetailsCard |

### Business/Seller

| Service | Endpoints | Used By |
|---|---|---|
| `seller.service.js` | `/seller-application` (apply/list), `/shop/get-shop-info/:id`, `/shop/update-shop-info`, `/event/create-event`, `/event/get-all-events/:shopId`, `/event/delete-shop-event/:id` | SellerApplicationPage, Business pages, Seller pages |
| `product.service.js` | Same as marketplace + `/product/create-product`, `/product/update-product/:id`, `/product/delete-shop-product/:id` | BusinessProductsPage, BusinessCreateProductPage, SellerProductsPage, SellerCreateProductPage |
| `shop.service.js` | `/shop/getseller`, `/shop/update-shop-avatar` | Seller profile, avatar |
| `catalog.service.js` | `/coupon/*` (create, list, delete) | Business promotions/coupons, Seller coupons |
| `order.service.js` | `/order/get-all-orders/seller/:id`, `/order/order/:id`, `/order/update-order-status/:id` | BusinessOrdersPage, SellerOrdersPage |

### Delivery

| Service | Endpoints | Used By |
|---|---|---|
| `location.service.js` | `/delivery/location/hierarchy`, `/delivery/location`, `/delivery/location/:id`, `/delivery/location/:parentId/children`, `/delivery/location/search`, `/delivery/zone/location/:locationId` | CheckoutPage (LocationSelector), CustomerAddressesPage |

**Note:** No delivery UI in frontend/ — delivery operations managed by backend `delivery-service` + `Aritii-admin-web`

---

## Fixed Issues

### Payment — Now Uses orderService.createOrder()

**File:** `components/payment/Payment.jsx`

```javascript
// FIXED: Now uses service layer
import orderService from "../../services/order.service";

// ...
const result = await orderService.createOrder(order);
const orderId = result?._id || result?.[0]?._id;
```

**Previous Bug:** Used raw `fetch('/api/order/create-order')` bypassing axios interceptors and auth tokens.

### Category Loading — Now Calls catalogService.getCategories()

**File:** `store/redux/actions/shop.js`

```javascript
// FIXED: Now calls actual API
import { shopService, catalogService } from "../../../services";

export const getAllCategories = () => async (dispatch) => {
  dispatch({ type: "getAllCategoriesRequest" });
  const categories = await catalogService.getCategories();
  dispatch({ type: "getAllCategoriesSuccess", payload: categories || [] });
};
```

**Previous Bug:** Dispatched empty array `[]` instead of calling API.

### Product Detail — Uses productService.getById()

**File:** `pages/common/ProductsDetailPage.jsx`

```javascript
// Uses service layer
import productService from '../../services/product.service';

// ...
foundProduct = await productService.getById(id);
```

### ProductDetail Component — Uses shopService.getById()

**File:** `components/marketplace/ProductDetail.jsx`

```javascript
// FIXED: Now uses service layer
import shopService from '../../services/shop.service';

// ...
shopService.getById(shopId).then(...)
```

**Previous Bug:** Used raw `api.get('/shop/get-shop-info/:id')` directly in component.

---

## Service File Summary

| File | Domain | Lines | Active Consumers |
|---|---|---|---|
| `api.js` | Core | 88 | All services |
| `auth.service.js` | Public/Auth | 132 | Login, SignUp, Profile, Addresses |
| `product.service.js` | Marketplace/Business | 119 | Products, Business pages |
| `shop.service.js` | Marketplace/Business | 69 | Shops, Business profile |
| `order.service.js` | Buyer/Business | 80 | Checkout, Orders, Seller orders |
| `catalog.service.js` | Marketplace | 70 | Events, Categories, Coupons |
| `seller.service.js` | Business | 94 | Seller application, Events |
| `address.service.js` | Buyer | 51 | Addresses |
| `location.service.js` | Delivery/Checkout | 49 | Checkout, Addresses |
| `cache.js` | Core | 92 | All services |
| `tokenStore.js` | Core | 79 | App-wide auth |
| `pkce.js` | Core | 55 | Auth flow |
| `index.js` | Core | 30 | Barrel export |

---

## Remaining Issues (Raw API Calls in Components)

The following components still make direct `api` calls instead of using service layer. These should be migrated in future work:

| Component | Raw Call | Target Service |
|---|---|---|
| `components/checkout/Checkout.jsx:115` | `api.get('/coupon/get-coupon-value/${name}')` | `catalogService.getCoupon()` |
| `components/profile/ProfileContent.jsx:52` | `api.put('/user/update-avatar', formData)` | `authService.updateAvatar()` |
| `components/profile/ProfileContent.jsx:437` | `api.put('/user/update-user-password', ...)` | `authService.updatePassword()` |
| `components/profile/UserOrderDetailComponent.jsx:36` | `api.put('/product/create-new-review', ...)` | `productService.createReview()` (new) |
| `components/profile/UserOrderDetailComponent.jsx:58` | `api.put('/order/refund-order/${id}', ...)` | `orderService.requestRefund()` (new) |
| `pages/buyer/inbox/UserInbox.jsx` (multiple) | `api.get/post` for conversations/messages | `messageService` (new) |
| `pages/buyer/settings/CustomerSettingsPage.jsx:96` | `api.put('/user/update-user-info', ...)` | `authService.updateProfile()` |
| `pages/buyer/settings/CustomerSettingsPage.jsx:216` | `api.put('/user/update-user-password', ...)` | `authService.updatePassword()` |
| `components/seller/DashboardMessages.jsx` (multiple) | `api.get/put` for messages | `messageService` (new) |
| `pages/buyer/settings/CustomerSettingsPage.jsx` | `api.put` for profile/password | `authService` methods |

---

## PLANNED APIs (Not Currently Implemented in Frontend)

| API | Domain | Status | Notes |
|---|---|---|---|
| Delivery order tracking | Delivery | PLANNED | No delivery UI in frontend |
| Delivery rider management | Delivery | PLANNED | In Aritii-admin-web |
| Delivery assignment API | Delivery | PLANNED | Backend exists |
| Public content API | Public | PLANNED | Backend may support visibility flags |
| Request/Support API | Buyer | PLANNED | No request management UI |
| Multiple shop management | Business | PLANNED | Current: 1 business = 1 shop |
| Business analytics API | Business | PLANNED | SellerAnalyticsPage exists |
| Review submission API | Buyer | PLANNED | ReviewsPage shows reviews but no submit |
| Notification preferences | Buyer | PLANNED | Settings toggles not persisted |

---

**ADMIN WAS NOT TOUCHED**

**Last Updated:** September 2025  
**Priority 1-3 Complete**