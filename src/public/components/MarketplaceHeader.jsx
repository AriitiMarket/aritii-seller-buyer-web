import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AiOutlineMenu, AiOutlineClose, AiOutlineSearch, AiOutlineShoppingCart, AiOutlineUser } from 'react-icons/ai'
import { MdLocalShipping, MdLocationOn } from 'react-icons/md'
import BrandLogo from '@/components/common/BrandLogo'
import HeaderSearch from '@/shared/components/header/HeaderSearch'
import { useAuth } from '@/auth/hooks/useAuth'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '@/store/slices/userThunks'
import { toast } from 'react-toastify'
import { categoryHref } from '@/shared/categories/categoryHref'
import { useCatalogCategories } from '@/shared/hooks/useCatalogCategories'
import { useDeliveryLocation } from '@/shared/hooks/useDeliveryLocation'
import { useDeliveryZones } from '@/shared/hooks/useDeliveryZones'

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
  { label: 'New Arrivals', to: '/new-arrivals', match: ['/new-arrivals'] },
  { label: 'Customer Service', to: '/help', match: ['/help', '/support'] },
  { label: 'Orders', to: '/my-dashboard/orders', match: ['/my-dashboard/orders'], protected: true },
  { label: 'Requests', to: '/my-dashboard/requests', match: ['/my-dashboard/requests'], protected: true },
]

const MarketplaceHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [deliverToOpen, setDeliverToOpen] = useState(false)
  const profileRef = useRef(null)
  const deliverToRef = useRef(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { isAuthenticated, user } = useAuth()
  const { cart } = useSelector((state) => state.cart || {})
  const cartItemCount = cart ? cart.reduce((total, item) => total + Number(item.quantity ?? 1), 0) : 0
  const location = useLocation()
  const { categories } = useCatalogCategories()
  const { zones, loading: zonesLoading } = useDeliveryZones()

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

  // Mobile menu drawer: lock body scroll while open, Escape to close.
  useEffect(() => {
    if (!mobileMenuOpen) return undefined
    document.body.style.overflow = 'hidden'
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
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

  const accountItems = isAuthenticated
    ? [
        { label: 'Your Profile', to: '/my-dashboard/profile', icon: AiOutlineUser },
        { label: 'Your Orders', to: '/my-dashboard/orders', icon: MdLocalShipping },
        { label: 'Your Wish List', to: '/my-dashboard/wishlist', icon: AiOutlineUser },
        { label: 'Your Addresses', to: '/my-dashboard/addresses', icon: MdLocationOn },
        { type: 'divider' },
        { label: 'Sign Out', onClick: handleLogout, icon: AiOutlineUser },
      ]
    : [
        { label: 'Sign In', to: '/login', icon: AiOutlineUser },
        { label: 'Create Account', to: '/sign-up', icon: AiOutlineUser, primary: true },
      ]

  const { zoneId: selectedZoneId, cityId: selectedCityId, zoneName, cityName, setLocation } = useDeliveryLocation();

  const getDeliveryLocation = () => {
    if (zoneName) return zoneName;
    if (cityName) return cityName;
    return 'Select location';
  };

  return (
    <>
      {/* ===== Main header — dark, border-bottom rail ===== */}
      <header
        className="sticky top-0 z-[70] w-full border-b border-[#232f3e] bg-[#131921]"
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-2 justify-between">
            {/* Left: logo + wordmark */}
            <Link
              to="/"
              className="flex items-center gap-2 flex-shrink-0 rounded-lg p-1 transition-colors hover:bg-[#232f3e]"
              aria-label="Aritii Market home"
            >
              <BrandLogo size="md" showText showTagline={false} linked={false} tone="light" />
            </Link>

            {/* Center: search — the dominant element (md+ only; phones get a
                full-width search strip below the header row) */}
            <div className="hidden md:flex flex-1 max-w-2xl">
              <HeaderSearch
                dark
                variant="inline"
                destination={(term) => `/products?search=${encodeURIComponent(term)}`}
                placeholder="Search products, shops…"
                ariaLabel="Search products and shops"
                categories={categories.map((cat) => ({ title: cat.name || cat.title }))}
                locations={zones}
                selectedLocationId={selectedZoneId}
                onLocationChange={(id) => setLocation({ zoneId: id })}
                className="w-full"
              />
            </div>
            {/* Right: deliver to · account · cart · menu — the row distributes
                space evenly so the search stays centered and nothing is stranded
                at the right edge on wide screens. */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Deliver to — desktop/tablet only (hidden on phones to keep the
                  header uncluttered; addresses stay reachable via Account) */}
              <div className="relative hidden md:block" ref={deliverToRef}>
                <button
                  type="button"
                  onClick={() => setDeliverToOpen((v) => !v)}
                  onMouseEnter={() => setDeliverToOpen(true)}
                  onMouseLeave={() => setDeliverToOpen(false)}
                  className="flex items-center gap-1.5 px-2 py-1.5 text-white transition-colors hover:bg-[#232f3e] rounded-md"
                  aria-expanded={deliverToOpen}
                  aria-haspopup="listbox"
                  aria-label="Deliver to"
                >
                  <MdLocationOn size={16} className="text-[#9aa6b2]" />
                  <span className="text-[11px] font-medium text-[#9aa6b2] uppercase tracking-wider">Deliver to</span>
                  <span className="text-body-sm font-medium text-white truncate max-w-[120px]">
                    {getDeliveryLocation()}
                  </span>
                  <AiOutlineSearch size={12} className="text-[#9aa6b2]/60 ml-1" />
                </button>
                {deliverToOpen && (
                  <div className="absolute top-full left-0 mt-1 z-[80] w-72 rounded-md border border-[#232f3e] bg-[#1a1a1a] p-3 shadow-lg">
                    <div className="space-y-2.5">
                      <p className="px-1 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wider text-[#9aa6b2] border-b border-[#232f3e]">
                        Delivery zones
                      </p>
                      <div className="max-h-[240px] overflow-y-auto space-y-1">
                        {zonesLoading ? (
                          <div className="px-3 py-4 text-center text-[#9aa6b2] text-sm">Loading zones...</div>
                        ) : zones.length > 0 ? (
                          zones.map((zone) => (
                            <button
                              key={zone._id || zone.id}
                              type="button"
                              onClick={() => {
                                setLocation({
                                  zoneId: zone._id || zone.id,
                                  zoneName: zone.name || zone.title,
                                });
                                setDeliverToOpen(false);
                              }}
                              className={`w-full px-3 py-2 text-body-sm transition-colors rounded-md text-left ${
                                selectedZoneId === (zone._id || zone.id)
                                  ? 'bg-[#75d04b] text-[#131921] font-medium'
                                  : 'text-white hover:bg-[#232f3e]'
                              }`}
                            >
                              {zone.name || zone.title}
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-4 text-center text-[#9aa6b2] text-sm">No zones available</div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setDeliverToOpen(false);
                          navigate('/my-dashboard/addresses');
                        }}
                        className="w-full px-3 py-2 text-body-sm text-[#75d04b] transition-colors hover:bg-[#232f3e] rounded-md font-medium text-left border-t border-[#232f3e]"
                      >
                        Manage addresses →
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {/* Account & Lists — hover dropdown on desktop, tap on mobile.
                  A user icon is ALWAYS visible so the profile entry point is
                  reachable on phones; the text label appears from sm up. */}
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen(true)}
                  className="flex items-center gap-1.5 px-2 py-1.5 text-white transition-colors hover:bg-[#232f3e] rounded-md"
                  aria-expanded={profileOpen}
                  aria-haspopup="listbox"
                  aria-label="Account & Lists"
                >
                  <AiOutlineUser size={20} className="text-white sm:text-[#9aa6b2]" />
                  <span className="hidden text-[11px] font-medium text-[#9aa6b2] uppercase tracking-wider sm:inline">
                    {isAuthenticated ? 'Account & Lists' : 'Hello, Sign in'}
                  </span>
                  {isAuthenticated && (
                    <span className="hidden text-body-sm font-medium text-white truncate max-w-[140px] lg:inline">
                      {user?.name || user?.firstName || 'Account'}
                    </span>
                  )}
                  <AiOutlineSearch size={12} className="hidden text-[#9aa6b2]/60 sm:block" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-1 z-[80] w-64 rounded-md border border-[#232f3e] bg-[#1a1a1a] p-1.5 shadow-lg">
                    <div className="py-1">
                      {accountItems.map((item, index) => (
                        <React.Fragment key={item.label + index}>
                          {item.type === 'divider' ? (
                            <div className="h-px bg-[#232f3e] my-2" />
                          ) : item.onClick ? (
                            <button
                              type="button"
                              onClick={item.onClick}
                              className="w-full flex items-center gap-2 px-3 py-2 text-body-sm text-[#9aa6b2] transition-colors hover:bg-[#232f3e] rounded-md"
                            >
                              {item.icon && <item.icon size={16} className="text-[#9aa6b2]" />}
                              {item.label}
                            </button>
                          ) : (
                            <Link
                              to={item.to}
                              onClick={() => setProfileOpen(false)}
                              className={`w-full flex items-center gap-2 px-3 py-2 text-body-sm transition-colors hover:bg-[#232f3e] rounded-md ${item.primary ? 'text-[#75d04b] font-semibold' : 'text-white'}`}
                            >
                              {item.icon && <item.icon size={16} className="text-[#9aa6b2]" />}
                              {item.label}
                            </Link>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* Cart */}
              <Link
                to="/my-dashboard/cart"
                className="relative flex items-center gap-1.5 p-1.5 text-white transition-colors hover:bg-[#232f3e] rounded-md"
                aria-label={`Cart, ${cartItemCount} items`}
              >
                <AiOutlineShoppingCart size={20} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 text-white text-xs font-bold rounded-full bg-[#75d04b]">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
              </Link>

              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="flex items-center justify-center w-10 h-10 text-white transition-colors hover:bg-[#232f3e] rounded-md lg:hidden"
                aria-label="Open navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                <AiOutlineMenu size={21} />
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
          sub-nav below reaches its top-16 offset exactly as the strip is
          covered, so no other sticky offsets change. */}
      <div className="md:hidden w-full bg-[#131921] border-b border-[#232f3e] px-4 py-2.5">
        <HeaderSearch
          dark
          variant="inline"
          destination={(term) => `/products?search=${encodeURIComponent(term)}`}
          placeholder="Search products, shops…"
          ariaLabel="Search products and shops"
          locations={zones}
          selectedLocationId={selectedZoneId}
          onLocationChange={(id) => setLocation({ zoneId: id })}
          className="w-full"
        />
      </div>

      {/* ===== Mobile menu ===== */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[65] bg-black/50"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-y-0 left-0 z-[70] flex w-72 flex-col rounded-r-xl border border-[#232f3e] bg-[#131921] shadow-level-3"
          >
            <div className="flex items-center justify-between border-b border-[#232f3e] p-4">
              <h2 className="text-base font-bold text-white">Menu</h2>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-[#9aa6b2] transition-colors hover:text-white"
                aria-label="Close menu"
              >
                <AiOutlineClose size={22} />
              </button>
            </div>
            <nav className="p-4 space-y-1 overflow-y-auto flex-1">
              {/* Main navigation */}
              <div className="border-b border-[#232f3e] pb-4">
                {NAV_LINKS.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      if (item.protected && !isAuthenticated) {
                        e.preventDefault();
                        toast.error(`Please sign in to ${item.label.toLowerCase()}.`);
                      }
                    }}
                    className={`block w-full px-3 py-2.5 rounded-lg transition-colors ${isActive(item.match) ? 'bg-[#232f3e] text-white font-semibold' : 'text-[#c9d1d9] hover:bg-[#232f3e]'}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Account section */}
              <div className="pt-4 border-t border-[#232f3e]">
                <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-[#9aa6b2]">Account</p>
                {accountItems.map((item, index) => (
                  <React.Fragment key={item.label + index}>
                    {item.type === 'divider' ? (
                      <div className="h-px bg-[#232f3e] my-2" />
                    ) : item.onClick ? (
                      <button
                        type="button"
                        onClick={() => {
                          item.onClick()
                          setMobileMenuOpen(false)
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-body-sm text-[#9aa6b2] transition-colors hover:bg-[#232f3e] rounded-lg"
                      >
                        {item.icon && <item.icon size={16} className="text-[#9aa6b2]" />}
                        {item.label}
                      </button>
                    ) : (
                      <Link
                        to={item.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`w-full flex items-center gap-2 px-3 py-2.5 text-body-sm transition-colors hover:bg-[#232f3e] rounded-lg ${item.primary ? 'text-[#75d04b] font-semibold' : 'text-[#c9d1d9]'}`}
                      >
                        {item.icon && <item.icon size={16} className="text-[#9aa6b2]" />}
                        {item.label}
                      </Link>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

export default MarketplaceHeader
