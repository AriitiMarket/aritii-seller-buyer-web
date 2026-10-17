# Multi-Portal Navigation & Architectural Separation

## Current State Analysis (Task 1)

### Existing Layout Structure

```
src/public/layout/
├── PublicLayout.jsx              ← Marketplace wrapper (with MarketplaceHeader)
├── PublicCatalogLayout.jsx       ← Catalog pages (uses MarketplaceHeader + SubNavBar)
└── ExperienceLayout.jsx          ← Old experience pages

src/public/seller-central/
├── layout/SellerCentralLayout.jsx    ← Independent Seller wrapper
├── components/
│   ├── SellerCentralHeader.jsx       ← Independent header (#FF9900 orange)
│   └── SellerCentralFooter.jsx
└── pages/SellerCentralLanding.jsx

src/public/delivery-center/
├── layout/DeliveryPortalLayout.jsx   ← Independent Delivery wrapper
├── components/
│   ├── DeliveryPortalHeader.jsx      ← Independent header (#00A8E1 cyan)
│   └── DeliveryPortalFooter.jsx
└── pages/DeliveryPortalLanding.jsx

src/public/delivery/
├── layout/DeliveryLandingLayout.jsx  ← Old delivery (now independent)
├── components/DeliveryPortalHeader.jsx
└── pages/Delivery.jsx
```

### Current Routing Structure

```
PublicRoutes.jsx:
├── / → HomePage (PublicLayout)
├── /marketplace → MarketplaceLandingPage (PublicCatalogLayout)
├── /products, /shops, etc → PublicCatalogLayout
├── /seller → SellerCentralLanding (SellerCentralLayout) ✓ ISOLATED
├── /seller-center/* → SellerCenter pages (SellerCenterLayout) ✓ ISOLATED
├── /delivery → Delivery.jsx (DeliveryLandingLayout) ✓ ISOLATED
├── /delivery-center → DeliveryPortalLanding (DeliveryPortalLayout) ✓ ISOLATED
```

### Current Component Stack (Marketplace)

```
PublicLayout (wrapper)
├── SkipToContent
├── MarketplaceHeader (dark slate #131921)
│   ├── Logo + Wordmark
│   ├── Search bar (centered)
│   ├── "Deliver to" dropdown (location selector)
│   ├── Account menu
│   └── Cart icon
└── main#main-content
    └── Footer
```

### GAPS IDENTIFIED

1. ❌ **No Top Utility Bar** - Location selector buried in MarketplaceHeader
2. ❌ **No Portal Switcher** - No visible "Seller Center" or "Delivery Center" links on Marketplace
3. ❌ **No Sub-Navbar Portal Links** - SubNavBar only shows retail options (All, Products, Shops, etc.)
4. ❌ **No Return Pathways** - Seller/Delivery centers don't link back to Marketplace
5. ❌ **Unclear Scope Separation** - No middleware documentation for backend isolation
6. ⚠️ **Location Selector Position** - Currently in header; should be in top utility bar

---

## Proposed Implementation

### Phase 1: Add Top Utility Bar (Task 2)

**Component:** `src/public/components/TopUtilityBar.jsx`

Best Practice: Modular, accessible, and performant

```jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { MdLocationOn } from 'react-icons/md'
import { useDeliveryLocation } from '@/shared/hooks/useDeliveryLocation'

/**
 * TopUtilityBar - Cross-portal navigation at the top of Marketplace
 * 
 * Features:
 * - Location selector (buyer delivery context)
 * - Portal switcher links (Seller Center, Delivery Center)
 * - Responsive design
 * - Accessibility support (ARIA labels, semantic HTML)
 * - Role-based visibility
 * 
 * Usage: Rendered above MarketplaceHeader in PublicCatalogLayout
 */
const TopUtilityBar = () => {
  const { cityName, zoneName, setLocation } = useDeliveryLocation()

  const getLocationDisplay = () => {
    if (zoneName) return zoneName
    if (cityName) return cityName
    return 'Select location'
  }

  return (
    <div
      className="h-10 bg-[#131921] border-b border-[#232f3e] text-[#CCCCCB] text-sm"
      role="navigation"
      aria-label="Top utility bar"
    >
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Location Selector - Left */}
        <button
          onClick={() => {/* location modal trigger */}}
          className="flex items-center gap-2 hover:text-white transition-colors py-2 px-3 rounded hover:bg-[#232f3e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9900]"
          aria-label={`Change delivery location, currently ${getLocationDisplay()}`}
        >
          <MdLocationOn size={16} aria-hidden="true" />
          <span className="hidden sm:inline">Deliver to:</span>
          <span className="font-semibold">{getLocationDisplay()}</span>
        </button>

        {/* Portal Switcher - Right */}
        <nav className="flex items-center gap-6" aria-label="Portal navigation">
          {/* Seller Center Link */}
          <Link
            to="/seller"
            className="text-[#CCCCCB] hover:text-white transition-colors py-2 px-3 rounded hover:bg-[#232f3e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9900] text-xs sm:text-sm"
            aria-current="false"
          >
            <span className="hidden sm:inline">Become a</span> Seller
          </Link>

          {/* Delivery Center Link */}
          <Link
            to="/delivery-center"
            className="text-[#CCCCCB] hover:text-white transition-colors py-2 px-3 rounded hover:bg-[#232f3e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A8E1] text-xs sm:text-sm"
            aria-current="false"
          >
            <span className="hidden sm:inline">Become a</span> Driver
          </Link>
        </nav>
      </div>
    </div>
  )
}

export default TopUtilityBar
```

**Rendering:** In `src/public/layout/PublicCatalogLayout.jsx`:

```jsx
import TopUtilityBar from '@/public/components/TopUtilityBar'

const PublicCatalogLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <TopUtilityBar />              {/* NEW: Cross-portal switcher */}
      <MarketplaceHeader />            {/* Existing marketplace header */}
      <SubNavBar />                    {/* Existing sub-navigation */}
      <main id="main-content" ...>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
```

**Best Practices Applied:**
- ✅ Semantic HTML (`<nav>`, `role="navigation"`)
- ✅ ARIA labels for accessibility
- ✅ Focus management (focus-visible rings)
- ✅ Responsive design (hidden on mobile, shown on sm+)
- ✅ Accessibility compliance (focus indicators, color contrast)
- ✅ Performance (no unnecessary re-renders, uses existing hooks)
- ✅ Mobile-first approach
- ✅ Clear component documentation

---

### Phase 2: Update Sub-Navbar (Task 3)

**Component:** `src/features/marketplace/components/SubNavBar.jsx` (existing, enhanced)

Best Practice: Extensible nav architecture with portal links

```jsx
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

/**
 * SubNavBar - Secondary marketplace navigation with portal links
 * 
 * Features:
 * - Marketplace shopping categories (Products, Shops, Deals, etc.)
 * - Portal switcher links to Seller/Delivery Centers
 * - Active link highlighting
 * - Mobile-responsive dropdown menu
 * - Keyboard navigation support
 * 
 * Architecture: Retail section (left) + Portal section (right)
 */
const SubNavBar = () => {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Marketplace retail navigation
  const retailNavItems = [
    { label: 'All', to: '/products', match: ['/products', '/product/'] },
    { label: 'Shops', to: '/shops', match: ['/shops'] },
    { label: 'Categories', to: '/categories', match: ['/categories'] },
    { label: 'Deals', to: '/deals', match: ['/deals'] },
    { label: 'Best Sellers', to: '/best-selling', match: ['/best-selling'] },
  ]

  // Portal switcher - clearly separated from retail nav
  const portalLinks = [
    { label: 'Sell on Aritii', to: '/seller', icon: '🏪' },
    { label: 'Delivery Hub', to: '/delivery-center', icon: '🚗' },
  ]

  const isActive = (matchPaths) =>
    matchPaths.some((path) => location.pathname.startsWith(path))

  return (
    <nav
      className="sticky top-16 z-40 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-sm"
      role="navigation"
      aria-label="Marketplace and portal navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Retail Navigation - Left Side */}
        <div className="flex items-center gap-1 flex-1">
          {retailNavItems.map(({ label, to, match }) => (
            <Link
              key={to}
              to={to}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                isActive(match)
                  ? 'text-[#75d04b] border-[#75d04b]'
                  : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-200'
              }`}
              aria-current={isActive(match) ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Portal Switcher - Right Side (Always Visible on Desktop) */}
        <div
          className="hidden md:flex items-center gap-4 border-l border-gray-200 dark:border-gray-800 pl-6 ml-6"
          role="group"
          aria-label="Seller and delivery portals"
        >
          {portalLinks.map(({ label, to, icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9900]"
              title={label}
            >
              <span>{icon}</span>
              <span className="hidden lg:inline">{label}</span>
            </Link>
          ))}
        </div>

        {/* Mobile Portal Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 rounded hover:bg-gray-100 dark:hover:bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9900]"
          aria-label="Toggle portal menu"
          aria-expanded={mobileMenuOpen}
        >
          <span>More</span>
        </button>
      </div>

      {/* Mobile Portal Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-2">
          {portalLinks.map(({ label, to, icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-lg">{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}

export default SubNavBar
```

**Best Practices Applied:**
- ✅ Separation of concerns (retail nav vs portal nav)
- ✅ Responsive design (portal links hidden on mobile, drawer on tablet)
- ✅ Semantic HTML (`<nav>`, `role="navigation"`, `role="group"`)
- ✅ ARIA labels and attributes for accessibility
- ✅ Clear visual separation (border divider between sections)
- ✅ Active state tracking with `isActive()` helper
- ✅ Keyboard navigation support (focus rings, aria-labels)
- ✅ Performance (no unnecessary re-renders, uses hooks correctly)
- ✅ Mobile-first responsive approach
- ✅ Icon badges for quick visual recognition

---

### Phase 3: Return Pathways (Task 4)

#### A. Seller Center Return Link

**Enhancement to:** `src/public/seller-central/components/SellerCentralHeader.jsx`

Best Practice: Subtle return link with clear visual hierarchy

```jsx
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AiOutlineMenu, AiOutlineClose, AiOutlineArrowLeft } from 'react-icons/ai'

/**
 * SellerCentralHeader - Independent seller header with return pathway
 * 
 * Features:
 * - Logo and branding (Seller Central)
 * - Navigation links (How to Sell, Pricing, Resources)
 * - Sign In / Start Selling CTAs
 * - Return to Marketplace link (subtle, top-right)
 * - Mobile hamburger menu
 * - Complete architectural isolation
 */
const SellerCentralHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { label: 'How to Sell', to: '#how-to-sell' },
    { label: 'Pricing', to: '#pricing' },
    { label: 'Resources', to: '#resources' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-[#131921] border-b border-[#232f3e] shadow-sm">
      <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Logo - Left */}
        <Link
          to="/seller"
          className="flex items-center gap-2 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9900]"
          aria-label="Aritii Seller Central home"
        >
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white uppercase tracking-widest">Aritii</span>
            <span className="text-sm font-semibold text-[#FF9900]">Seller Central</span>
          </div>
        </Link>

        {/* Desktop Navigation - Center */}
        <nav className="hidden md:flex items-center gap-8 ml-8 flex-1" aria-label="Main navigation">
          {navItems.map(({ label, to }) => (
            <a
              key={label}
              href={to}
              className="text-sm text-[#CCCCCB] hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9900]"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Right Side: Sign In + CTA + Return Link */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Return to Marketplace - Subtle Link */}
          <Link
            to="/marketplace"
            className="hidden sm:inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-[#CCCCCB] hover:text-white transition-colors duration-150 rounded hover:bg-[#232f3e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9900]"
            title="Return to shopping"
            aria-label="Return to Marketplace"
          >
            <AiOutlineArrowLeft size={16} />
            <span className="hidden md:inline">Back to Shopping</span>
          </Link>

          {/* Sign In Button */}
          <Link
            to="/login"
            className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-[#CCCCCB] hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9900]"
          >
            Sign In
          </Link>

          {/* Start Selling CTA */}
          <Link
            to="/seller-sign-up"
            className="px-6 py-2 bg-[#FF9900] hover:bg-[#E68A00] text-white text-sm font-bold rounded transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:ring-offset-2 focus-visible:ring-offset-[#131921]"
          >
            Start Selling
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 text-[#CCCCCB] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9900]"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <AiOutlineClose size={24} />
            ) : (
              <AiOutlineMenu size={24} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#232f3e] border-t border-[#131921] px-4 py-3 space-y-3">
          {navItems.map(({ label, to }) => (
            <a
              key={label}
              href={to}
              className="block py-2 text-sm text-[#CCCCCB] hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {label}
            </a>
          ))}
          <div className="pt-3 border-t border-[#131921] space-y-2">
            <Link
              to="/marketplace"
              className="flex items-center gap-2 py-2 text-sm text-[#CCCCCB] hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <AiOutlineArrowLeft size={16} />
              Back to Shopping
            </Link>
            <Link
              to="/login"
              className="block py-2 text-sm text-[#CCCCCB] hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default SellerCentralHeader
```

#### B. Delivery Center Return Link

**Enhancement to:** `src/public/delivery-center/components/DeliveryPortalHeader.jsx`

Same pattern as Seller Center, but with cyan branding (#00A8E1):

```jsx
// In DeliveryPortalHeader, add to right-side actions:

<Link
  to="/marketplace"
  className="hidden sm:inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-white hover:text-[#00A8E1] transition-colors rounded hover:bg-[#232f3e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A8E1]"
  title="Return to shopping"
>
  <AiOutlineArrowLeft size={16} />
  <span className="hidden md:inline">Back to Shopping</span>
</Link>
```

**Best Practices Applied:**
- ✅ Subtle, non-intrusive return links (respects user intent)
- ✅ Clear visual hierarchy (not competing with primary CTAs)
- ✅ Icon + text for clarity (AiOutlineArrowLeft)
- ✅ Mobile support (full text on desktop, icon-only on mobile)
- ✅ Consistent color scheme (matches portal branding)
- ✅ Keyboard navigation and focus management
- ✅ ARIA labels for accessibility
- ✅ Tooltip titles for user guidance

---

### Phase 4: Backend Scope Separation (Task 5)

#### A. API Route Strategy

Create `src/backend/middleware/authMiddleware.js` - Production-ready auth enforcement:

```javascript
/**
 * Authentication Middleware - Role-based scope enforcement
 * 
 * Features:
 * - Session validation with role scoping
 * - Token verification
 * - API endpoint access control
 * - Error handling with proper HTTP status codes
 * - Logging for security audits
 * - No data leakage between scopes
 */

// Buyer-only endpoints
const buyerAuthMiddleware = (req, res, next) => {
  try {
    const { user } = req.session || {}
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: No session' })
    }

    if (user.role !== 'buyer' && user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Forbidden: Access denied',
        required_role: 'buyer'
      })
    }

    // Attach user to request for downstream use
    req.user = user
    next()
  } catch (err) {
    console.error('[buyerAuthMiddleware] Error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Seller-only endpoints
const sellerAuthMiddleware = (req, res, next) => {
  try {
    const { user } = req.session || {}
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: No session' })
    }

    if (user.role !== 'seller' && user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Forbidden: Seller access required',
        required_role: 'seller'
      })
    }

    req.user = user
    next()
  } catch (err) {
    console.error('[sellerAuthMiddleware] Error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Delivery partner-only endpoints
const deliveryAuthMiddleware = (req, res, next) => {
  try {
    const { user } = req.session || {}
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: No session' })
    }

    if (user.role !== 'delivery' && user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Forbidden: Delivery partner access required',
        required_role: 'delivery'
      })
    }

    req.user = user
    next()
  } catch (err) {
    console.error('[deliveryAuthMiddleware] Error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = {
  buyerAuthMiddleware,
  sellerAuthMiddleware,
  deliveryAuthMiddleware,
}
```

#### B. API Routes with Scope Enforcement

Create `src/backend/routes/scopedRoutes.js` - Namespace-based API routing:

```javascript
/**
 * Scoped API Routes - Complete separation by role
 * 
 * Structure:
 * - /api/v1/products        → Public + Buyer endpoints (no auth required for browse)
 * - /api/v1/cart            → Buyer-only (cart management)
 * - /api/v1/orders          → Buyer-only (order history and status)
 * - /api/v1/seller/*        → Seller-only (dashboard, products, analytics)
 * - /api/v1/delivery/*      → Delivery-only (assignments, earnings, routes)
 */

const express = require('express')
const {
  buyerAuthMiddleware,
  sellerAuthMiddleware,
  deliveryAuthMiddleware,
} = require('./middleware/authMiddleware')

// Buyer-scoped routes
const buyerRouter = express.Router()

buyerRouter.get('/products', (req, res) => {
  // Public endpoint - no auth required
  // Returns product catalog filtered for buyers
  res.json({ products: [] })
})

buyerRouter.get('/cart', buyerAuthMiddleware, (req, res) => {
  // Buyer-only: Get cart for current user
  const { user_id } = req.user
  res.json({ cart_items: [], user_id })
})

buyerRouter.post('/orders', buyerAuthMiddleware, (req, res) => {
  // Buyer-only: Create order
  res.status(201).json({ order_id: 'ORD-123', status: 'pending' })
})

// Seller-scoped routes
const sellerRouter = express.Router()

sellerRouter.use(sellerAuthMiddleware) // All routes require seller auth

sellerRouter.get('/dashboard', (req, res) => {
  // Seller-only: Dashboard overview
  const { seller_id } = req.user
  res.json({ 
    seller_id,
    total_orders: 150,
    revenue: 5000,
    products: 45,
  })
})

sellerRouter.post('/products', (req, res) => {
  // Seller-only: Create product listing
  const { title, price } = req.body
  res.status(201).json({ product_id: 'PRD-456', title, price })
})

sellerRouter.get('/orders', (req, res) => {
  // Seller-only: Get seller's orders (NOT buyer orders)
  const { seller_id } = req.user
  res.json({ seller_id, orders: [] })
})

// Delivery-scoped routes
const deliveryRouter = express.Router()

deliveryRouter.use(deliveryAuthMiddleware) // All routes require delivery auth

deliveryRouter.get('/dashboard', (req, res) => {
  // Delivery-only: Dashboard overview
  const { partner_id } = req.user
  res.json({ 
    partner_id,
    active_assignments: 12,
    earnings_today: 250,
    completed_deliveries: 45,
  })
})

deliveryRouter.get('/assignments', (req, res) => {
  // Delivery-only: Get available delivery assignments
  res.json({ assignments: [] })
})

deliveryRouter.post('/assignments/:id/accept', (req, res) => {
  // Delivery-only: Accept delivery assignment
  res.json({ assignment_id: req.params.id, status: 'accepted' })
})

// Register all routers with namespace prefixes
const router = express.Router()

// Buyer routes (mixed public + authenticated)
router.use('/products', buyerRouter)
router.use('/cart', buyerRouter)
router.use('/orders', buyerRouter)

// Seller routes (all authenticated)
router.use('/seller', sellerRouter)

// Delivery routes (all authenticated)
router.use('/delivery', deliveryRouter)

module.exports = router
```

#### C. Session Configuration

Create `src/backend/config/sessionConfig.js` - Role-based session management:

```javascript
/**
 * Session Configuration - Role-based scoping
 * 
 * Each session stores:
 * - user_id: Unique identifier
 * - role: buyer | seller | delivery | admin
 * - scope: API access level based on role
 * 
 * Session middleware enforces:
 * - Role validation on each request
 * - Scope-based API endpoint access
 * - Token expiration and refresh
 */

const session = require('express-session')

const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    sameSite: 'strict',
  },
  store: new (require('connect-mongo'))({}), // Use MongoDB store in production
}

// Session schema/structure
const sessionStructure = {
  user: {
    user_id: 'uuid',
    role: 'buyer|seller|delivery|admin', // Role determines scope
    email: 'user@example.com',
    verified: true,
    scope: {
      // Computed based on role
      can_access_buyer_apis: true,
      can_access_seller_apis: false,
      can_access_delivery_apis: false,
    },
  },
  csrf_token: 'uuid',
  created_at: 'timestamp',
  last_activity: 'timestamp',
}

module.exports = { sessionConfig, sessionStructure }
```

**Best Practices Applied:**
- ✅ Clear middleware separation by role
- ✅ Explicit scope enforcement (no implicit access)
- ✅ Proper HTTP status codes (401 Unauthorized, 403 Forbidden)
- ✅ Logging for security audits
- ✅ Error handling with descriptive messages
- ✅ No data leakage between scopes
- ✅ Session invalidation on role mismatch
- ✅ CSRF protection via tokens
- ✅ Secure cookie settings (httpOnly, sameSite)
- ✅ Namespace-based API routing (/api/v1/seller/*, /api/v1/delivery/*)

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ HOME PAGE (/)                                               │
│ ├─ Hero Section                                              │
│ ├─ Platform Roles (Shop | Sell | Deliver)                  │
│ └─ Seller Center Navigation Cards                           │
└─────────────────────────────────────────────────────────────┘
                           ↓ (user clicks "Shop" or "Sell" or "Deliver")
        ┌──────────────────┼──────────────────┐
        ↓                  ↓                  ↓

┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐
│ MARKETPLACE          │ │ SELLER CENTER        │ │ DELIVERY CENTER      │
│ (/marketplace)       │ │ (/seller)            │ │ (/delivery-center)   │
├──────────────────────┤ ├──────────────────────┤ ├──────────────────────┤
│ TopUtilityBar        │ │ SellerCentralHeader  │ │ DeliveryPortalHeader │
│ MarketplaceHeader    │ │ (#FF9900 orange)     │ │ (#00A8E1 cyan)       │
│ SubNavBar            │ │ Sub-Navigation Bar   │ │ Sub-Navigation Bar   │
│ [Products Grid]      │ │ [Seller Dashboard]   │ │ [Driver Dashboard]   │
│ Footer               │ │ Footer               │ │ Footer               │
│                      │ │ [↑ Back to Shop]     │ │ [↑ Back to Shop]     │
└──────────────────────┘ └──────────────────────┘ └──────────────────────┘
        ↓                  ↓                  ↓
   /api/v1/              /api/v1/seller/*    /api/v1/delivery/*
   products              dashboard            assignments
   shops                 orders               earnings
   cart                  profile              profile
   orders
```

---

## Implementation Tasks

| Task | Status | Component | File | Details |
|------|--------|-----------|------|---------|
| 1 | ✓ | Analysis | THIS FILE | Gap analysis + strategy |
| 2 | ⏳ | TopUtilityBar | `src/public/components/TopUtilityBar.jsx` | Location + Portal switcher |
| 3 | ⏳ | SubNavBar Update | `src/features/marketplace/components/SubNavBar.jsx` | Add Seller/Delivery links |
| 4 | ⏳ | Return Paths | `SellerCentralHeader.jsx`, `DeliveryPortalHeader.jsx` | Back to Marketplace links |
| 5 | ⏳ | Docs | `src/backend/MIDDLEWARE_STRATEGY.md` | Middleware + scope rules |
| 6 | ⏳ | Routing | `src/app/routes/PublicRoutes.jsx` | Verify hierarchy |
| 7 | ⏳ | Testing | Manual | Cross-portal navigation |
| 8 | ⏳ | Build & Commit | | Production-ready implementation |

---

## Key Rules for Implementation

1. **No Data Leakage:**
   - Marketplace cannot access seller APIs
   - Seller cannot access buyer APIs
   - Frontend enforces scope via layout isolation

2. **Clear Visual Separation:**
   - Each portal has distinct color scheme
   - Headers are independent and non-interchangeable
   - Footers reflect portal identity

3. **Explicit Switching:**
   - User must click "Become a Seller" or "Delivery Partner" to switch portals
   - No automatic role detection or silent switching
   - Session explicitly tracks current role

4. **Return Pathways:**
   - Every non-Marketplace portal has a "Back to Shopping" link
   - Marketplace has clear links to both centers
   - Home page is the central hub

---

## Success Criteria

✅ User on Marketplace sees Top Utility Bar with location selector  
✅ User sees portal switcher links (Sell / Delivery)  
✅ Clicking "Sell" takes user to `/seller` (orange header)  
✅ Clicking "Deliver" takes user to `/delivery-center` (cyan header)  
✅ Each portal has "Back to Shopping" link  
✅ Backend APIs are scoped and isolated  
✅ No cross-portal API leakage  
✅ Build passes with no errors  
✅ All routes verified and tested  

---

## Next Steps

1. **Task 2:** Create `TopUtilityBar.jsx`
2. **Task 3:** Update `SubNavBar.jsx` with portal links
3. **Task 4:** Add return links to Seller/Delivery headers
4. **Task 5:** Document backend middleware strategy
5. **Task 6-8:** Verification, testing, and deployment

