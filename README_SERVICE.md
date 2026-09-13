# Frontend - ARITII Marketplace

React-based single-page application for ARITII marketplace with buyer and seller interfaces.

## Overview

The Frontend provides:
- Marketplace browsing (public)
- User authentication and profiles
- Shopping cart and checkout
- Order management
- Seller dashboard (after approval)
- Responsive design (mobile, tablet, desktop)
- One-account system (buyer + seller)

## Architecture

```
Frontend (React + Vite)
│
├─ Pages
│  ├─ Public: HomePage, MarketplacePage, ShopsPage
│  ├─ Auth: LoginPage, SignUpPage
│  ├─ Buyer: CustomerAccountLayout (profile, orders, addresses)
│  └─ Seller: SellerDashboardPage, ProductsPage, OrdersPage
│
├─ Components
│  ├─ Common: Header, Sidebar, Footer, Loader
│  ├─ Auth: LoginForm, SignUpForm
│  ├─ Marketplace: ProductCard, ProductList, CartButton
│  ├─ Seller: DashboardHeader, SellerSidebar, ProductForm
│  └─ Layout: CustomerAccountLayout, SellerLayout
│
├─ State Management
│  ├─ Redux Store
│  ├─ Actions: User, Product, Shop, Cart, Orders
│  └─ Reducers: user, product, shop, cart, orders
│
└─ Services
   └─ API: axios instance with interceptors
```

## Prerequisites

- Node.js >= 18
- npm or yarn
- Backend services running (API Gateway on 8000)

## Installation

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Set environment variables
VITE_API_URL=http://localhost:8000/api
```

## Environment Variables

```
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=ARITII Market
VITE_APP_ENVIRONMENT=development
```

## Running

### Development
```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

### Production Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│  ├── pages/
│  │  ├── marketplace/
│  │  │  ├── HomePage.jsx
│  │  │  ├── ProductsPage.jsx
│  │  │  ├── ShopsPage.jsx
│  │  │  └── ProductsDetailPage.jsx
│  │  ├── customer/
│  │  │  └── account/
│  │  │     ├── CustomerAccountLayout.jsx
│  │  │     ├── CustomerProfilePage.jsx
│  │  │     ├── CustomerOrdersPage.jsx
│  │  │     ├── CustomerAddressesPage.jsx
│  │  │     └── CustomerWishlistPage.jsx
│  │  ├── seller/
│  │  │  ├── SellerApplicationPage.jsx
│  │  │  └── ShopHomePage.jsx
│  │  └── auth/
│  │     ├── Login.jsx
│  │     └── SignUp.jsx
│  ├── components/
│  │  ├── common/
│  │  │  ├── Header.jsx
│  │  │  ├── Footer.jsx
│  │  │  ├── Loader.jsx
│  │  │  └── ImageWithFallback.jsx
│  │  ├── seller/
│  │  │  ├── DashboardHeader.jsx
│  │  │  └── DashboardHero.jsx
│  │  ├── layout/
│  │  │  └── UnifiedHeader.jsx
│  │  └── profile/
│  │     └── ProfileMenu.jsx
│  ├── routes/
│  │  ├── ProtectedRoute.jsx
│  │  ├── SellerAuthRoute.jsx
│  │  └── SellerStatusRoute.jsx
│  ├── store/
│  │  └── redux/
│  │     ├── actions/
│  │     │  ├── user.js
│  │     │  ├── product.js
│  │     │  ├── shop.js
│  │     │  ├── cart.js
│  │     │  └── order.js
│  │     ├── reducers/
│  │     │  ├── user.js
│  │     │  ├── product.js
│  │     │  ├── shop.js
│  │     │  └── seller.js
│  │     └── store.js
│  ├── services/
│  │  └── api.js
│  ├── App.jsx
│  ├── main.jsx
│  └── App.css
├── index.html
├── vite.config.js
├── tailwind.config.cjs
├── package.json
└── README.md
```

## Key Technologies

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Redux** - State management
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **React Icons** - Icon library

## API Integration

### API Service
```javascript
// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true // Include cookies
});

// Interceptors for auth and error handling
```

### Redux Actions
```javascript
// src/store/redux/actions/user.js

// Load user
export const loadUser = () => async (dispatch) => {
  dispatch({ type: 'LoadUserRequest' });
  try {
    const { data } = await api.get('/user/getuser');
    dispatch({
      type: 'LoadUserSuccess',
      payload: data.user
    });
  } catch (error) {
    dispatch({ type: 'LoadUserFail', payload: error.message });
  }
};

// Login
export const loginUser = (email, password) => async (dispatch) => {
  // API call...
};
```

## Authentication Flow

### Login
```
User enters email/password
    ↓
Login.jsx calls api.post('/user/login-user')
    ↓
API returns user object + JWT token
    ↓
Store dispatches LoadUserSuccess with user data
    ↓
Token stored in cookie (httpOnly)
    ↓
SellerStatusRoute checks user.sellerStatus
    ├─ APPROVED → redirects to /business/dashboard
    └─ Other → redirects to /marketplace
    ↓
User logged in ✅
```

### Protected Routes
```
Client requests protected page
    ↓
ProtectedRoute checks Redux state
    ├─ loading? → show Loader
    ├─ authenticated? → render page
    └─ not authenticated? → redirect to /login

For seller routes:
    ↓
SellerAuthRoute checks user.sellerStatus === 'APPROVED'
    ├─ approved? → render seller page
    └─ not approved? → redirect to /marketplace
```

## One-Account System

### User Model
```javascript
{
  id: "uuid",
  name: "John Doe",
  email: "john@example.com",
  role: "SELLER",              // CUSTOMER or SELLER
  sellerStatus: "APPROVED",    // null, PENDING, REJECTED, APPROVED
  shopId: "shop123",           // If seller
  avatar: { public_id, url },
  addresses: [{ ... }],
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01"
}
```

### Buyer Access
- Always available: Marketplace, cart, profile, orders
- Routes: `/marketplace`, `/my-dashboard/*`

### Seller Access
- Only if approved: Business dashboard, products, analytics
- Routes: `/business/*`
- Added via profile menu from seller dashboard

### Profile Menu (Seller Dashboard)
```
Click Avatar
    ↓
Shows dropdown with:
├─ Business
│  └─ Store Profile → /business/profile
├─ Buyer
│  ├─ My Profile → /my-dashboard/profile
│  ├─ My Purchases → /my-dashboard/orders
│  ├─ Wishlist → /my-dashboard/wishlist
│  └─ Addresses → /my-dashboard/addresses
├─ Actions
│  ├─ Go to Marketplace → /marketplace
│  └─ Logout → clears auth
```

## Responsive Design

### Breakpoints
```javascript
// Tailwind config
custom: {
  '800px': '800px' // Custom breakpoint
}
```

### Layout
```
Mobile (< 800px)
├─ Hamburger menu
└─ Full-width content

Tablet (800px - 1024px)
├─ Sidebar visible
└─ Scaled content

Desktop (1024px+)
├─ Persistent sidebar
└─ Full layout
```

## State Management (Redux)

### Store Structure
```javascript
{
  user: {
    user: { /* user object */ },
    isAuthenticated: boolean,
    loading: boolean,
    error: string
  },
  product: {
    products: [{ /* products */ }],
    selectedProduct: { /* ... */ },
    loading: boolean,
    error: string
  },
  cart: {
    cartItems: [{ productId, quantity, price }],
    totalAmount: number
  },
  seller: {
    isSeller: boolean,
    seller: { /* shop data */ },
    isLoading: boolean,
    error: string
  }
}
```

### Common Actions

#### User Actions
```javascript
loadUser()              // Fetch current user
loginUser(email, pass)  // Login
logoutUser()           // Logout
updateUser(data)       // Update profile
```

#### Product Actions
```javascript
getAllProducts()       // Fetch all products
getProductDetail(id)   // Fetch single product
searchProducts(query)  // Search products
```

#### Cart Actions
```javascript
addToCart(productId, qty)
removeFromCart(productId)
updateCartItem(productId, qty)
```

## Pages & Routes

### Public Pages
```
/                         → HomePage
/marketplace              → ProductsPage (all products)
/products                 → ProductsPage (alias)
/product/:name            → ProductsDetailPage
/shops                    → ShopsPage
/shops/:id                → ShopDetailsPage
/login                    → LoginPage
/sign-up                  → SignUpPage
```

### Protected Pages (Buyer)
```
/my-dashboard             → CustomerAccountLayout
/my-dashboard/profile     → CustomerProfilePage
/my-dashboard/orders      → CustomerOrdersPage
/my-dashboard/addresses   → CustomerAddressesPage
/my-dashboard/wishlist    → CustomerWishlistPage
/my-dashboard/reviews     → CustomerReviewsPage
/my-dashboard/settings    → CustomerSettingsPage
/cart                     → CartPage (if exists)
/checkout                 → CheckoutPage
/payment                  → PaymentPage
```

### Protected Pages (Seller)
```
/business/dashboard       → SellerDashboardPage
/business/profile         → SellerStoreProfilePage
/business/products        → SellerProductsPage
/business/products/create → SellerCreateProductPage
/business/orders          → SellerOrdersPage
/business/analytics       → SellerAnalyticsPage
```

### Seller Application
```
/sell                     → SellerApplicationPage
/seller-application       → SellerApplicationPage (alias)
```

## Development Workflow

### Add New Feature

1. **Create Page**
```javascript
// src/pages/NewPage.jsx
import React from 'react'

const NewPage = () => {
  return <div>New Page</div>
}

export default NewPage
```

2. **Add Route**
```javascript
// App.jsx
<Route path="/new-page" element={<NewPage />} />
```

3. **Use Redux State (if needed)**
```javascript
import { useSelector } from 'react-redux'

const { user } = useSelector(state => state.user)
```

4. **Make API Call (if needed)**
```javascript
import api from '../services/api'

const fetchData = async () => {
  const { data } = await api.get('/endpoint')
}
```

### Component Patterns

#### Functional Component
```javascript
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

const MyComponent = () => {
  const [localState, setLocalState] = useState('')
  const { user } = useSelector(state => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    // Setup
  }, [])

  return <div>{user.name}</div>
}

export default MyComponent
```

#### Protected Component
```javascript
const MyPage = () => (
  <ProtectedRoute>
    <MyComponent />
  </ProtectedRoute>
)
```

#### Seller-Only Component
```javascript
const SellerPage = () => (
  <ProtectedRoute>
    <SellerAuthRoute>
      <MyComponent />
    </SellerAuthRoute>
  </ProtectedRoute>
)
```

## Styling

### Tailwind CSS
```jsx
<div className="flex items-center justify-between px-4 py-2 bg-brand-primary text-white rounded-lg">
  <span>Content</span>
</div>
```

### Custom Classes
```css
/* src/App.css */
.brand-primary { /* Primary color */ }
.text-brand-muted { /* Muted text */ }
.border-brand { /* Brand border */ }
```

### Custom Breakpoint
```javascript
// Custom 800px breakpoint
<div className="800px:block hidden">
  Desktop only
</div>
```

## Performance Optimization

### Code Splitting
```javascript
import { lazy, Suspense } from 'react'

const LazyComponent = lazy(() => import('./Component'))

<Suspense fallback={<Loader />}>
  <LazyComponent />
</Suspense>
```

### Memoization
```javascript
import { memo } from 'react'

const Component = memo(({ prop }) => {
  return <div>{prop}</div>
})
```

### Image Optimization
```jsx
<img
  src={url}
  alt="Description"
  loading="lazy"
  className="w-full object-cover"
/>
```

## Testing

### Run Tests
```bash
npm run test
```

### Test Structure
```javascript
// __tests__/Component.test.jsx
import { render, screen } from '@testing-library/react'
import Component from '../Component'

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />)
    expect(screen.getByText('text')).toBeInTheDocument()
  })
})
```

## Build & Deployment

### Build
```bash
npm run build
# Creates dist/ folder with optimized production build
```

### Deployment to Static Host
```bash
# Build first
npm run build

# Deploy dist/ folder to:
# - Vercel
# - Netlify
# - AWS S3 + CloudFront
# - GitHub Pages
```

### Environment for Production
```
VITE_API_URL=https://api.aritii.com/api
VITE_APP_ENVIRONMENT=production
```

## Troubleshooting

### Login not working
- Check API Gateway is running on 8000
- Verify VITE_API_URL is correct
- Check browser console for errors
- Clear browser cache

### Redux state not updating
- Check Redux DevTools
- Verify action is dispatched
- Check reducer handles the action type
- Look for typos in action type

### Styling issues
- Check Tailwind CSS is loaded
- Verify class names are correct
- Check browser DevTools for actual styles
- Clear Node modules and reinstall

### API calls failing
- Check backend services are running
- Verify token is being sent
- Check CORS is enabled
- Look at Network tab in DevTools

## Support

- For Backend issues, see service READMEs
- For React help, see React documentation
- For Tailwind help, see Tailwind documentation

## License

ARITII Marketplace © 2024
