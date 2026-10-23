import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AiOutlineMenu, AiOutlineClose, AiOutlineShoppingCart, AiOutlineUser, AiOutlineHeart } from 'react-icons/ai'
import { MdLocalShipping, MdLocationOn, MdDashboard } from 'react-icons/md'
import BrandLogo from '@/components/common/BrandLogo'
import HeaderSearch from '@/shared/components/header/HeaderSearch'
import { useAuth } from '@/auth/hooks/useAuth'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '@/store/slices/userThunks'
import { toast } from 'react-toastify'
import { useCatalogCategories } from '@/shared/hooks/useCatalogCategories'
import { useDeliveryLocation } from '@/shared/hooks/useDeliveryLocation'
import DeliveryZoneSelector from '@/features/marketplace/components/DeliveryZoneSelector'
import { useLayout } from '@/app/providers/LayoutContext'

/**
 * MarketplaceHeader — the ONE shared header for every public shopping page
 * (home, catalog, marketplace, shop, product detail, requests).
 *
 * Design standard (shopping-app UX, Aritii-branded — original assets/copy):
 *  - Near-black header bar #131921, bottom border #232f3e (market-header tokens)
 *  - Icon + wordmark logo on the left
 *  - Prominent centered search with autocomplete + department chips
 *  - "Deliver to" dropdown (first-class, right after the logo)
 *  - "Account & Lists" opens on hover (avoid the native click toggle)
 *  - Cart with brand-green badge
 *  - A sticky, border-bottomed rail (not a floating pill)
 *
 * The secondary tab row ("All · Products · Shops · Categories · Deals · …")
 * lives in SubNavBar, mounted only on catalog routes (PublicCatalogLayout),
 * so the header itself stays identical on every page.
 */

const NAV_LINKS = [
  { label: 'Products', to: '/products', match: ['/products', '/product/'] },
  { label: 'Shops', to: '/shops', match: ['/shops', '/shop/'] },
  { label: 'Categories', to: '/categories', match: ['/categories', '/category/'] },
  { label: "Today's Deals", to: '/deals', match: ['/deals'] },
  { label: 'Best Sellers', to: '/best-selling', match: ['/best-selling'] },
  { label: 'Orders', to: '/my-dashboard/orders', match: ['/my-dashboard/orders'], protected: true },
  { label: 'Saved Items', to: '/my-dashboard/wishlist', match: ['/my-dashboard/wishlist'], protected: true },
  { label: 'Requests', to: '/my-dashboard/requests', match: ['/my-dashboard/requests'], protected: true },
  { label: 'Customer Service', to: '/help', match: ['/help', '/support', '/faq'] },
]

const MarketplaceHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [deliverToOpen, setDeliverToOpen] = useState(false)
  const profileRef = useRef(null)
  const deliverToRef = useRef(null)
  const menuButtonRef = useRef(null)
  const drawerCloseRef = useRef(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { isAuthenticated, user } = useAuth()
  const { cart } = useSelector((state) => state.cart || {})
  const cartItemCount = cart ? cart.reduce((total, item) => total + Number(item.quantity ?? 1), 0) : 0
  const location = useLocation()
  const { categories } = useCatalogCategories()

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
      if (deliverToRef.current && !deliverToRef.current.contains(e.target)) setDeliverToOpen(false)
    }
    if (profileOpen || deliverToOpen) {
      document.addEventListener('mousedown', handleClick)
      return () => document.removeEventListener('mousedown', handleClick)
    }
  }, [profileOpen, deliverToOpen])

  // Mobile menu drawer: lock body scroll while open, Escape to close,
  // move focus into the drawer and return it to the trigger on close.
  useEffect(() => {
    if (!mobileMenuOpen) return undefined
    const trigger = menuButtonRef.current
    document.body.style.overflow = 'hidden'
    drawerCloseRef.current?.focus()
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
      trigger?.focus()
    }
  }, [mobileMenuOpen])

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser())
      toast.success('Signed out successfully')
      setProfileOpen(false)
      setMobileMenuOpen(false)
      navigate('/')
    } catch (err) {
      toast.error('Failed to sign out')
    }
  }

  const isActive = (paths) =>
    Array.isArray(paths) ? paths.some((p) => location.pathname.startsWith(p)) : location.pathname.startsWith(paths)

  const { openLoginModal } = useLayout();

  const accountItems = isAuthenticated
    ? [
        { label: 'Buyer Dashboard', to: '/my-dashboard', icon: MdDashboard, primary: true },
        { label: 'Your Profile', to: '/my-dashboard/profile', icon: AiOutlineUser },
        { label: 'Your Orders', to: '/my-dashboard/orders', icon: MdLocalShipping },
        { label: 'Your Wish List', to: '/my-dashboard/wishlist', icon: AiOutlineHeart },
        { label: 'Your Addresses', to: '/my-dashboard/addresses', icon: MdLocationOn },
        { label: 'Messages', to: '/my-dashboard/requests', icon: AiOutlineUser },
        { label: 'Settings', to: '/my-dashboard/settings', icon: AiOutlineUser },
        { type: 'divider' },
        { label: 'Sign Out', onClick: handleLogout, icon: AiOutlineUser },
      ]
    : [];

  const { regionId, regionName, zoneId: selectedZoneId, cityId: selectedCityId, zoneName, cityName, setLocation } = useDeliveryLocation();

  const getDeliveryLocation = () => {
    if (zoneName) return zoneName;
    if (cityName) return cityName;
    if (regionName) return regionName;
    return 'Select location';
  };

  const handleDeliverySelect = (selection) => {
    setLocation(selection);
    if (!['/products', '/shops'].includes(location.pathname)) return;
    const params = new URLSearchParams(location.search);
    for (const key of ['regionId', 'regionName', 'cityId', 'cityName', 'zoneId', 'zoneName']) {
      if (selection[key]) params.set(key, selection[key]); else params.delete(key);
    }
    navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
  };

  return (
    <>
      {/* ===== Main header — dark Amazon-style border-bottom rail ===== */}
      <header
        className="sticky top-0 z-[70] w-full border-b border-[#232f3e] bg-[#131921]"
        role="banner"
      >
        <div className="w-full px-2 sm:px-4 lg:px-6">
          <div className="flex items-center h-12 gap-1.5 sm:gap-3 justify-between">
            {/* Left: logo + wordmark */}
            <Link
              to="/"
              className="flex items-center gap-1.5 flex-shrink-0 rounded p-1 sm:p-1.5 transition-colors hover:outline hover:outline-1 hover:outline-white"
              aria-label="Aritii Market home"
            >
              <BrandLogo size="sm" showText showTagline={false} linked={false} tone="light" />
            </Link>

            {/* Deliver to - Amazon style (hidden on xs, compact on sm+) */}
            <div className="relative flex-shrink-0" ref={deliverToRef}>
              <button
                type="button"
                onClick={() => setDeliverToOpen((v) => !v)}
                className="flex items-center gap-1 p-1 sm:px-2 sm:py-1 text-white transition-colors hover:outline hover:outline-1 hover:outline-white rounded"
                aria-expanded={deliverToOpen}
                aria-haspopup="dialog"
                aria-label="Deliver to"
              >
                <MdLocationOn size={18} className="text-[#febd69] flex-shrink-0" />
                <div className="text-left hidden sm:flex sm:flex-col leading-tight">
                  <span className="text-[10px] text-[#cccccc] font-normal leading-none">Deliver to</span>
                  <span className="text-xs font-bold text-white truncate max-w-[100px] lg:max-w-[130px] leading-tight">
                    {getDeliveryLocation()}
                  </span>
                </div>
              </button>
              {deliverToOpen && (
                <div
                  className="absolute top-full left-0 mt-1 z-[80] w-[min(19rem,calc(100vw-1rem))] rounded-md border border-[#232f3e] bg-[#1a1a1a] p-3.5 shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#232f3e]">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9aa6b2]">
                        Delivery Location
                      </p>
                      <button
                        type="button"
                        onClick={() => setDeliverToOpen(false)}
                        className="text-xs text-gray-400 hover:text-white p-1 rounded"
                        aria-label="Close"
                      >
                        ✕
                      </button>
                    </div>
                    <DeliveryZoneSelector
                      mode="zone"
                      initialValues={{ regionId, regionName, cityId: selectedCityId, cityName, zoneId: selectedZoneId, zoneName }}
                      onSelect={handleDeliverySelect}
                      label="Select Zone"
                      placeholder="All locations"
                    />
                    <div className="pt-2 border-t border-[#232f3e] flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setDeliverToOpen(false);
                          navigate('/my-dashboard/addresses');
                        }}
                        className="text-xs text-[#febd69] hover:underline font-medium text-left"
                      >
                        Manage addresses →
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliverToOpen(false)}
                        className="px-3 py-1 bg-[#febd69] hover:bg-[#f3a847] text-black text-xs font-bold rounded"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Center: Amazon-style prominent search */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-1 lg:mx-2">
              <HeaderSearch
                variant="inline"
                destination={(term) => `/products?search=${encodeURIComponent(term)}`}
                placeholder="Search Aritii..."
                ariaLabel="Search products and shops"
                categories={categories.map((cat) => ({ title: cat.name || cat.title }))}
                className="w-full"
              />
            </div>

            {/* Right side controls: Seller/Driver portals · Account & Lists · Returns & Orders · Cart */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* Quick portal links (desktop) */}
              <div className="hidden xl:flex items-center gap-1 text-xs">
                <Link
                  to="/seller-center"
                  className="px-2 py-1 text-[#cccccc] hover:text-white rounded hover:outline hover:outline-1 hover:outline-white whitespace-nowrap"
                >
                  Sell
                </Link>
                <Link
                  to="/delivery-center"
                  className="px-2 py-1 text-[#cccccc] hover:text-white rounded hover:outline hover:outline-1 hover:outline-white whitespace-nowrap"
                >
                  Driver
                </Link>
              </div>

              {/* Account & Lists — Amazon-style hover dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((v) => !v)}
                  onMouseEnter={() => setProfileOpen(true)}
                  className="flex items-center gap-1 p-1 sm:px-2 sm:py-1 text-white transition-colors hover:outline hover:outline-1 hover:outline-white rounded"
                  aria-expanded={profileOpen}
                  aria-haspopup="listbox"
                  aria-label="Account & Lists"
                >
                  <AiOutlineUser size={18} className="text-[#febd69] sm:hidden" />
                  <div className="text-left hidden sm:flex sm:flex-col leading-tight">
                    <span className="text-[10px] text-[#cccccc] font-normal leading-none truncate max-w-[110px]">
                      {isAuthenticated ? `Hello, ${user?.name || user?.firstName || 'User'}` : 'Hello, Sign in'}
                    </span>
                    <span className="text-xs font-bold text-white flex items-center leading-tight">
                      Account & Lists
                      <span className="text-[8px] ml-1 text-gray-400">▼</span>
                    </span>
                  </div>
                </button>
                {profileOpen && (
                  <div
                    onMouseLeave={() => setProfileOpen(false)}
                    className="absolute right-0 top-full mt-1 z-[80] w-64 rounded-md border border-[#232f3e] bg-[#1a222d] p-2 shadow-2xl"
                  >
                    {!isAuthenticated && (
                      <div className="p-3 mb-2 bg-[#131921] rounded border border-[#232f3e] text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setProfileOpen(false);
                            openLoginModal('BUYER');
                          }}
                          className="w-full py-1.5 px-4 bg-[#febd69] hover:bg-[#f3a847] text-[#131921] text-xs font-bold rounded transition shadow-sm"
                        >
                          Sign In
                        </button>
                        <p className="text-[11px] text-gray-400 mt-2">
                          New customer?{' '}
                          <Link
                            to="/sign-up"
                            onClick={() => setProfileOpen(false)}
                            className="text-[#febd69] hover:underline"
                          >
                            Start here.
                          </Link>
                        </p>
                      </div>
                    )}
                    <div className="py-1">
                      {accountItems.map((item, index) => (
                        <React.Fragment key={item.label + index}>
                          {item.type === 'divider' ? (
                            <div className="h-px bg-[#232f3e] my-1.5" />
                          ) : item.onClick ? (
                            <button
                              type="button"
                              onClick={item.onClick}
                              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-300 hover:text-white transition-colors hover:bg-[#232f3e] rounded"
                            >
                              {item.icon && <item.icon size={15} className="text-gray-400" />}
                              {item.label}
                            </button>
                          ) : (
                            <Link
                              to={item.to}
                              onClick={() => setProfileOpen(false)}
                              className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-colors hover:bg-[#232f3e] rounded ${item.primary ? 'text-[#febd69] font-bold' : 'text-gray-300 hover:text-white'}`}
                            >
                              {item.icon && <item.icon size={15} className="text-gray-400" />}
                              {item.label}
                            </Link>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Returns & Orders (Amazon style link) */}
              <Link
                to="/my-dashboard/orders"
                onClick={(e) => {
                  if (!isAuthenticated) {
                    e.preventDefault();
                    openLoginModal('BUYER');
                  }
                }}
                className="hidden lg:flex flex-col text-left p-1 sm:px-2 sm:py-1 text-white transition-colors hover:outline hover:outline-1 hover:outline-white rounded leading-tight"
                aria-label="Returns and Orders"
              >
                <span className="text-[10px] text-[#cccccc] font-normal leading-none">Returns</span>
                <span className="text-xs font-bold text-white leading-tight">& Orders</span>
              </Link>

              {/* Cart — Amazon Shopping Cart with badge */}
              <Link
                to="/my-dashboard/cart"
                className="relative flex items-center gap-1 p-1 sm:px-2 sm:py-1 text-white transition-colors hover:outline hover:outline-1 hover:outline-white rounded"
                aria-label={`Cart, ${cartItemCount} items`}
              >
                <div className="relative flex items-center">
                  <AiOutlineShoppingCart size={22} className="text-white" />
                  <span className="absolute -top-1.5 left-2.5 flex items-center justify-center min-w-[18px] h-4 px-1 text-white text-[11px] font-extrabold rounded-full bg-[#f08804]">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                </div>
                <span className="hidden sm:inline text-xs font-bold text-white self-end mb-0.5 ml-1">
                  Cart
                </span>
              </Link>

              {/* Menu trigger — icon only at the top right-most position */}
              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 text-white transition-colors hover:outline hover:outline-1 hover:outline-white hover:bg-[#232f3e] rounded cursor-pointer ml-0.5"
                aria-label="Open navigation menu"
                aria-expanded={mobileMenuOpen}
                title="Navigation menu"
              >
                <AiOutlineMenu size={20} className="text-[#febd69] sm:text-white flex-shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ===== Mobile search strip — full-width second row on phones =====
          The in-header search only shows from md up; below that the search
          lives here at full width (no department dropdown — it can't render
          meaningfully in the narrow in-row search). In normal flow (NOT
          sticky): it scrolls away under the pinned header, and the sticky
          sub-nav below reaches its pinned offset as the strip is
          covered, so no other sticky offsets change. */}
      <div className="md:hidden w-full bg-[#131921] border-b border-[#232f3e] px-4 py-2">
        <HeaderSearch
          variant="inline"
          destination={(term) => `/products?search=${encodeURIComponent(term)}`}
          placeholder="Search products, shops…"
          ariaLabel="Search products and shops"
          className="w-full"
        />
      </div>

      {/* ===== Slide-out Menu Drawer (accessible on all screen sizes from top-right icon) ===== */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[75]"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        >
          {/* Backdrop — inert keeps focus out of the page behind the drawer */}
          <div className="fixed inset-0 bg-black/60 transition-opacity" inert />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-y-0 right-0 z-[80] flex w-80 max-w-[88vw] flex-col border-l border-[#232f3e] bg-[#131921] shadow-2xl"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-[#232f3e] p-4 bg-[#1a222d]">
              {isAuthenticated ? (
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#febd69] text-[#131921] flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {(user?.name || user?.firstName || 'B')[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-[#9aa6b2] block leading-none">Hello,</span>
                    <span className="text-sm font-bold text-white truncate block max-w-[170px] leading-tight">
                      {user?.name || user?.firstName || 'Buyer'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <AiOutlineUser size={20} className="text-[#febd69]" />
                  <span className="text-sm font-bold text-white">Hello, Sign in</span>
                </div>
              )}
              <button
                ref={drawerCloseRef}
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-[#9aa6b2] transition-colors hover:text-white rounded"
                aria-label="Close menu"
              >
                <AiOutlineClose size={22} />
              </button>
            </div>

            {/* Drawer Body */}
            <nav className="p-4 space-y-4 overflow-y-auto flex-1">
              {/* If authenticated: Prominent Buyer Dashboard banner */}
              {isAuthenticated ? (
                <div className="p-3 bg-gradient-to-r from-[#232f3e] to-[#1a222d] rounded-lg border border-[#febd69]/40 shadow-sm">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#febd69]">
                      Buyer Portal
                    </span>
                    <span className="text-[10px] bg-[#febd69]/20 text-[#febd69] px-2 py-0.5 rounded-full font-medium">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mb-2.5">
                    Track orders, manage addresses, cart, and account settings.
                  </p>
                  <Link
                    to="/my-dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-[#febd69] hover:bg-[#f3a847] text-[#131921] text-xs font-bold rounded transition shadow-sm"
                  >
                    <MdDashboard size={16} />
                    <span>View Buyer Dashboard</span>
                  </Link>
                </div>
              ) : (
                <div className="p-3 bg-[#1a222d] rounded-lg border border-[#232f3e] text-center space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openLoginModal('BUYER');
                    }}
                    className="w-full py-2.5 px-4 bg-[#febd69] hover:bg-[#f3a847] text-[#131921] text-xs font-bold rounded transition text-center shadow-sm"
                  >
                    Sign In
                  </button>
                  <Link
                    to="/sign-up"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-1 text-center text-xs text-[#febd69] hover:underline"
                  >
                    New customer? Start here
                  </Link>
                </div>
              )}

              {/* Buyer Account Links */}
              {isAuthenticated && (
                <div className="border-b border-[#232f3e] pb-3">
                  <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-[#9aa6b2]">
                    Buyer Account
                  </p>
                  <div className="space-y-0.5">
                    <Link
                      to="/my-dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors ${
                        location.pathname === '/my-dashboard'
                          ? 'bg-[#febd69]/15 text-[#febd69] font-bold'
                          : 'text-[#c9d1d9] hover:bg-[#232f3e] hover:text-white'
                      }`}
                    >
                      <MdDashboard size={16} className="text-[#febd69]" />
                      <span>Buyer Dashboard</span>
                    </Link>
                    <Link
                      to="/my-dashboard/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors ${
                        location.pathname.startsWith('/my-dashboard/orders')
                          ? 'bg-[#232f3e] text-white font-bold'
                          : 'text-[#c9d1d9] hover:bg-[#232f3e] hover:text-white'
                      }`}
                    >
                      <MdLocalShipping size={16} className="text-[#9aa6b2]" />
                      <span>Your Orders & Returns</span>
                    </Link>
                    <Link
                      to="/my-dashboard/wishlist"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors ${
                        location.pathname.startsWith('/my-dashboard/wishlist')
                          ? 'bg-[#232f3e] text-white font-bold'
                          : 'text-[#c9d1d9] hover:bg-[#232f3e] hover:text-white'
                      }`}
                    >
                      <AiOutlineHeart size={16} className="text-[#9aa6b2]" />
                      <span>Saved Items / Wishlist</span>
                    </Link>
                    <Link
                      to="/my-dashboard/addresses"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors ${
                        location.pathname.startsWith('/my-dashboard/addresses')
                          ? 'bg-[#232f3e] text-white font-bold'
                          : 'text-[#c9d1d9] hover:bg-[#232f3e] hover:text-white'
                      }`}
                    >
                      <MdLocationOn size={16} className="text-[#9aa6b2]" />
                      <span>Delivery Addresses</span>
                    </Link>
                    <Link
                      to="/my-dashboard/requests"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors ${
                        location.pathname.startsWith('/my-dashboard/requests')
                          ? 'bg-[#232f3e] text-white font-bold'
                          : 'text-[#c9d1d9] hover:bg-[#232f3e] hover:text-white'
                      }`}
                    >
                      <AiOutlineUser size={16} className="text-[#9aa6b2]" />
                      <span>Messages & Requests</span>
                    </Link>
                    <Link
                      to="/my-dashboard/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors ${
                        location.pathname.startsWith('/my-dashboard/profile')
                          ? 'bg-[#232f3e] text-white font-bold'
                          : 'text-[#c9d1d9] hover:bg-[#232f3e] hover:text-white'
                      }`}
                    >
                      <AiOutlineUser size={16} className="text-[#9aa6b2]" />
                      <span>Your Profile</span>
                    </Link>
                    <Link
                      to="/my-dashboard/settings"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors ${
                        location.pathname.startsWith('/my-dashboard/settings')
                          ? 'bg-[#232f3e] text-white font-bold'
                          : 'text-[#c9d1d9] hover:bg-[#232f3e] hover:text-white'
                      }`}
                    >
                      <AiOutlineUser size={16} className="text-[#9aa6b2]" />
                      <span>Account Settings</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Marketplace Navigation */}
              <div className="border-b border-[#232f3e] pb-3">
                <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-[#9aa6b2]">
                  Explore Marketplace
                </p>
                <div className="space-y-0.5">
                  <Link
                    to="/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-2.5 py-2 rounded-lg text-xs transition-colors ${
                      location.pathname.startsWith('/products')
                        ? 'bg-[#232f3e] text-white font-bold'
                        : 'text-[#c9d1d9] hover:bg-[#232f3e] hover:text-white'
                    }`}
                  >
                    All Products
                  </Link>
                  <Link
                    to="/shops"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-2.5 py-2 rounded-lg text-xs transition-colors ${
                      location.pathname.startsWith('/shops')
                        ? 'bg-[#232f3e] text-white font-bold'
                        : 'text-[#c9d1d9] hover:bg-[#232f3e] hover:text-white'
                    }`}
                  >
                    Shops Directory
                  </Link>
                  <Link
                    to="/categories"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-2.5 py-2 rounded-lg text-xs transition-colors ${
                      location.pathname.startsWith('/categories')
                        ? 'bg-[#232f3e] text-white font-bold'
                        : 'text-[#c9d1d9] hover:bg-[#232f3e] hover:text-white'
                    }`}
                  >
                    Shop by Category
                  </Link>
                  <Link
                    to="/deals"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-2.5 py-2 rounded-lg text-xs text-[#c9d1d9] hover:bg-[#232f3e] hover:text-white transition-colors"
                  >
                    Today's Deals
                  </Link>
                  <Link
                    to="/best-selling"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-2.5 py-2 rounded-lg text-xs text-[#c9d1d9] hover:bg-[#232f3e] hover:text-white transition-colors"
                  >
                    Best Sellers
                  </Link>
                </div>
              </div>

              {/* Portals & Support */}
              <div className="border-b border-[#232f3e] pb-3">
                <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-[#9aa6b2]">
                  Portals & Support
                </p>
                <div className="space-y-0.5">
                  <Link
                    to="/seller-center"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-2.5 py-2 rounded-lg text-xs text-[#c9d1d9] hover:bg-[#232f3e] hover:text-white transition-colors"
                  >
                    Sell on Aritii
                  </Link>
                  <Link
                    to="/delivery-center"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-2.5 py-2 rounded-lg text-xs text-[#c9d1d9] hover:bg-[#232f3e] hover:text-white transition-colors"
                  >
                    Become a Delivery Driver
                  </Link>
                  <Link
                    to="/help"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-2.5 py-2 rounded-lg text-xs text-[#c9d1d9] hover:bg-[#232f3e] hover:text-white transition-colors"
                  >
                    Customer Service & Help
                  </Link>
                </div>
              </div>

              {/* Sign Out */}
              {isAuthenticated && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <AiOutlineUser size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

export default MarketplaceHeader
