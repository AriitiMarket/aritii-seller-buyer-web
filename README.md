# Aritii Market - Frontend

**Modern multi-seller marketplace** with unified buyer and seller experience. Built with React 18, Vite, Redux, and Tailwind CSS.

**Status:** ✅ Production Ready | **Build:** ✅ Passing (1735 modules, 0 errors)

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
npm run build        # Build output in build/
npm run preview      # Preview production build locally
```

---

## 📋 Project Structure

```
frontend/src/
├── components/                 # Reusable React components
│   ├── auth/                  # Login, Register, Profile
│   ├── cart/                  # Shopping cart, checkout
│   ├── home/                  # Hero, Categories, Products
│   ├── layout/                # Header, Footer, Navigation
│   ├── marketplace/           # Product cards, filters, search
│   ├── payment/               # Payment processing
│   ├── seller/                # Seller dashboard components
│   └── common/                # Shared components (Button, Modal, etc)
│
├── pages/                      # Full page components (route pages)
│   ├── home/                  # HomePage.jsx
│   ├── marketplace/           # Products, Shops, Categories
│   ├── customer/              # Buyer dashboard, orders, profile
│   └── seller/                # Seller portal
│
├── services/                   # API client layer (centralized)
│   ├── api.js                 # Axios instance with interceptors
│   ├── auth.service.js        # Authentication APIs
│   ├── product.service.js     # Product APIs
│   ├── order.service.js       # Order management APIs
│   ├── shop.service.js        # Shop APIs
│   ├── cart.service.js        # Cart APIs
│   ├── wishlist.service.js    # Wishlist APIs
│   ├── address.service.js     # Address management APIs
│   └── index.js               # Service exports
│
├── store/redux/               # Redux state management
│   ├── store.js               # Redux store configuration
│   ├── actions/               # Redux action creators
│   │   ├── user.js            # Auth, user, seller actions
│   │   ├── product.js         # Product actions
│   │   ├── order.js           # Order actions
│   │   ├── cart.js            # Cart actions
│   │   └── wishlist.js        # Wishlist actions
│   └── reducers/              # Redux reducers
│       ├── user.js            # Auth state
│       ├── products.js        # Products state
│       ├── orders.js          # Orders state
│       ├── cart.js            # Cart state
│       └── wishlist.js        # Wishlist state
│
├── routes/                     # Route protection & guards
│   ├── ProtectedRoute.jsx     # Require authentication
│   ├── SellerAuthRoute.jsx    # Require seller role
│   ├── HomeRoute.jsx          # Smart home routing
│   └── SellerStatusRoute.jsx  # Check seller status
│
├── utils/                      # Helper functions
├── config/                     # Configuration files
├── App.jsx                     # Main app component
└── index.jsx                   # Entry point
```

---

## 🔐 Authentication & Authorization

### Protected Routes

```javascript
// Require authentication
<Route path="/my-dashboard/*" element={<ProtectedRoute><CustomerLayout /></ProtectedRoute>} />

// Require seller role
<Route path="/dashboard*" element={<SellerAuthRoute><SellerLayout /></SellerAuthRoute>} />
```

### Login Flow

1. User enters email/password
2. Redux action `loginUser()` calls `authService.login()`
3. Backend returns user + JWT token
4. Token stored in HTTP-only cookie
5. Redux state updated with user data
6. User redirected based on role (buyer/seller)

### Logout Flow

1. User clicks logout
2. Redux action `logoutUser()` calls `authService.logout()`
3. Backend clears HTTP-only cookie
4. Redux state cleared: `isAuthenticated = false`
5. Protected routes redirect to `/login`

---

## 🎨 Services Layer (API Integration)

All HTTP requests go through centralized services for consistency and error handling.

### Available Services

#### Auth Service (`auth.service.js`)
```javascript
authService.register(userData)           // Register new account
authService.login(email, password)       // Login
authService.logout()                     // Logout
authService.getCurrentUser()             // Get current user
authService.updateProfile(userData)      // Update profile
authService.updateAvatar(formData)       // Upload avatar
```

#### Product Service (`product.service.js`)
```javascript
productService.getAllProducts()          // Get all products
productService.getProductDetail(id)      // Get single product
productService.searchProducts(query)     // Search
productService.createProduct(data)       // Create (seller)
productService.updateProduct(id, data)   // Update (seller)
productService.deleteProduct(id)         // Delete (seller)
```

#### Order Service (`order.service.js`)
```javascript
orderService.createOrder(orderData)      // Create new order
orderService.getBuyerOrders(userId)      // Buyer's orders
orderService.getOrderDetail(orderId)     // Order details
orderService.cancelOrder(id, reason)     // Cancel order
```

#### Cart Service (`cart.service.js`)
```javascript
cartService.getCart(userId)              // Get cart items
cartService.addToCart(productId, qty)    // Add item
cartService.updateItem(itemId, qty)      // Update quantity
cartService.removeFromCart(itemId)       // Remove item
```

#### Address Service (`address.service.js`)
```javascript
addressService.getAddresses()            // Get all addresses
addressService.add(addressData)          // Add new address
addressService.update(id, data)          // Update address
addressService.delete(id)                // Delete address
```

---

## 📊 Redux State Management

### Store Structure

```javascript
{
  user: {
    isAuthenticated: boolean,
    user: { id, email, name, role, sellerStatus, ... },
    loading: boolean,
    error: string
  },
  
  products: {
    allProducts: Array,
    loading: boolean,
    error: string
  },
  
  orders: {
    userOrders: Array,
    loading: boolean,
    error: string
  },
  
  cart: {
    items: Array,
    total: number,
    loading: boolean
  },
  
  wishlist: {
    items: Array,
    loading: boolean
  }
}
```

### Using Redux in Components

```javascript
import { useSelector, useDispatch } from 'react-redux';

const MyComponent = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector(state => state.user);

  useEffect(() => {
    // Dispatch action to load user
    dispatch(loadUser());
  }, []);

  return (
    <div>
      {loading ? <Loader /> : <p>Welcome, {user?.name}</p>}
    </div>
  );
};
```

---

## 🛍️ Key Features

### Buyer Features
- ✅ Browse marketplace with search & filter
- ✅ Add products to cart & wishlist
- ✅ Checkout & place orders
- ✅ Track order history & status
- ✅ Manage delivery addresses
- ✅ Update profile & avatar

### Seller Features
- ✅ Create & manage shop
- ✅ Add & update products
- ✅ View shop orders
- ✅ Manage shop settings
- ✅ View shop analytics

### Common
- ✅ User authentication (login/register)
- ✅ Profile management
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Dark mode support (Tailwind CSS)

---

## 📱 Responsive Design

### Tailwind Breakpoints
- **xs** - Mobile (< 640px)
- **sm** - Small (640px - 768px)
- **md** - Medium (768px - 1024px)
- **lg** - Large (1024px+)

### Components Optimized
- ✅ Hero section
- ✅ Promotion banner
- ✅ Product grid
- ✅ Navigation header
- ✅ Shopping cart
- ✅ Dashboard layouts

---

## 🚀 Development

### Available Scripts

```bash
# Start dev server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Format code
npm run format
```

### Environment Variables

Create `.env.local`:
```
VITE_API_URL=http://localhost:8000/api
```

---

## 🔧 Configuration

### Vite Config (`vite.config.js`)
- React Fast Refresh enabled
- Optimized build output
- CSS preprocessing with PostCSS/Tailwind

### Redux Store (`store.js`)
- 5 reducers (user, products, orders, cart, wishlist)
- Middleware for async actions
- Redux DevTools support

### Tailwind Config (`tailwind.config.js`)
- Custom color palette (Aritii brand colors)
- Custom theme configuration
- Extended utilities

---

## 🎯 API Integration

### Request Flow
```
Component
  ↓
useDispatch(action)
  ↓
Redux Action (async)
  ↓
Service Layer
  ↓
Axios + Interceptors
  ↓
API Gateway
  ↓
Backend Services
```

### Error Handling
- Request interceptor: Adds JWT token to headers
- Response interceptor: Handles 401 (redirect to login)
- Service methods: Try-catch with error messages
- Redux actions: Dispatch error actions on failure

### Token Management
- Stored in HTTP-only cookie (secure)
- Automatically included in requests
- Cleared on logout
- Auto-redirect on expiry (401 response)

---

## 🧪 Testing

### Component Testing
```bash
# Run tests
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

### Manual Testing
1. **Buyer Flow**: Register → Browse → Cart → Checkout → Orders
2. **Seller Flow**: Apply → Approval → Dashboard → Products
3. **Auth Flow**: Login → Protected routes → Logout
4. **Responsive**: Test on mobile/tablet/desktop

---

## 📦 Dependencies

### Core
- **react** (18.x) - UI library
- **react-router-dom** - Routing
- **redux** - State management
- **axios** - HTTP client
- **react-toastify** - Notifications

### Styling
- **tailwindcss** - Utility-first CSS
- **postcss** - CSS preprocessing
- **autoprefixer** - CSS vendor prefixes

### Icons
- **react-icons** - Icon library

---

## 🌐 Deployment

### Production Build
```bash
npm run build
```

Output: `build/` directory ready for deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

### Environment Setup
Set `VITE_API_URL` to production API endpoint

---

## 🐛 Troubleshooting

### Build fails
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### API calls failing
- Verify backend is running on port 8000
- Check `VITE_API_URL` is correct
- Check browser console for CORS errors

### Redux state not updating
- Check Redux DevTools browser extension
- Verify actions are dispatched correctly
- Check reducers are returning new state object

### Components not responsive
- Check Tailwind breakpoint syntax (sm:, md:, lg:)
- Verify mobile viewport meta tag in index.html
- Test with browser dev tools device emulation

---

## 📚 Documentation

- [SERVICES_REFERENCE.md](./SERVICES_REFERENCE.md) - API services guide
- [../TEAM_DOCUMENTATION.md](../TEAM_DOCUMENTATION.md) - Full architecture
- [../BACKEND_SERVICES_GUIDE.md](../BACKEND_SERVICES_GUIDE.md) - Backend reference

---

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Redux Documentation](https://redux.js.org)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Axios](https://axios-http.com)

---

## 📝 Code Style

### Component Structure
```javascript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// 2. Component definition
const MyComponent = ({ prop1, prop2 }) => {
  // 3. Hooks
  const dispatch = useDispatch();
  const data = useSelector(state => state.data);

  // 4. State
  const [localState, setLocalState] = useState('');

  // 5. Effects
  useEffect(() => {
    // Load data
  }, []);

  // 6. Event handlers
  const handleClick = () => {};

  // 7. Render
  return <div>{/* JSX */}</div>;
};

export default MyComponent;
```

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes and test locally
3. Commit: `git commit -am 'Add feature'`
4. Push: `git push origin feature/feature-name`
5. Create Pull Request

---

## 📞 Support

For issues or questions:
1. Check documentation in `../docs/`
2. Review GitHub issues
3. Create new issue with details

---

## 📄 License

All rights reserved © Aritii Market 2026

---

**Last Updated:** September 14, 2026  
**Build Status:** ✅ Passing (1735 modules)  
**Version:** 1.0.0-production
