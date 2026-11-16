import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineMenu, AiOutlineClose, AiOutlineShoppingCart, AiOutlineUser, AiOutlineHeart } from 'react-icons/ai';
import { MdLocalShipping, MdLocationOn, MdDashboard, MdSettings } from 'react-icons/md';
import BrandLogo from '@/components/common/BrandLogo';
import HeaderSearch from '@/features/marketplace/components/HeaderSearch';
import SubNavBar from '@/features/marketplace/components/SubNavBar';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '@/store/slices/userThunks';
import { toast } from 'react-toastify';
import { useCatalogCategories } from '@/shared/hooks/useCatalogCategories';
import { useDeliveryLocation } from '@/shared/hooks/useDeliveryLocation';
import DeliveryZoneSelector from '@/features/marketplace/components/DeliveryZoneSelector';
import { useLayout } from '@/app/providers/LayoutContext';

/**
 * MarketplaceHeader — Primary sticky header for the public shopping experience.
 *
 * Design tokens:
 *  - Clean light/dark surfaces: bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800
 *  - Primary brand green: #75d04b (focus rings, badges, brand CTA)
 *  - Text: text-[#141414] dark:text-white
 *  - Pill-rounded controls (rounded-full)
 *  - Cart badge: #75d04b pill
 *  - Deliver-to popup: clean rounded-xl card
 */
const MarketplaceHeader = ({ hideSubNav = false, onOpenAll, ..._rest }) => {
  const headerRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deliverToOpen, setDeliverToOpen] = useState(false);
  const deliverToRef = useRef(null);
  const menuButtonRef = useRef(null);
  const drawerCloseRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Track header height for viewport offsets and modal overlays
  useEffect(() => {
    if (!headerRef.current) return;
    const updateHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty('--market-header-height', `${height}px`);
      }
    };
    updateHeight();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateHeight) : null;
    if (observer && headerRef.current) {
      observer.observe(headerRef.current);
    }
    window.addEventListener('resize', updateHeight);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', updateHeight);
      document.documentElement.style.removeProperty('--market-header-height');
    };
  }, []);

  const { isAuthenticated, user, isSeller, isProvider } = useAuth();
  const { cart } = useSelector((state) => state.cart || {});
  const cartItemCount = cart ? cart.reduce((total, item) => total + Number(item.quantity ?? 1), 0) : 0;
  const location = useLocation();
  const { categories } = useCatalogCategories();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (deliverToRef.current && !deliverToRef.current.contains(e.target)) setDeliverToOpen(false);
    };
    if (deliverToOpen) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [deliverToOpen]);

  // Mobile menu drawer accessibility
  useEffect(() => {
    if (!mobileMenuOpen) return undefined;
    const trigger = menuButtonRef.current;
    document.body.style.overflow = 'hidden';
    drawerCloseRef.current?.focus();
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
      trigger?.focus();
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      toast.success('Signed out successfully');
      setMobileMenuOpen(false);
      navigate('/', { replace: true });
    } catch (_err) {
      toast.error('Failed to sign out');
      navigate('/', { replace: true });
    }
  };

  const { openLoginModal } = useLayout();

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
      {/* ===== Main sticky header ===== */}
      <header
        ref={headerRef}
        className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-xs transition-colors"
        role="banner"
      >
        <div className="w-full px-2 sm:px-4 lg:px-6">
          <div className="flex items-center h-14 gap-1.5 sm:gap-3 justify-between">
            {/* Left: logo + wordmark */}
            <Link
              to="/"
              className="flex items-center gap-1.5 flex-shrink-0 rounded-full p-1 sm:p-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75d04b]"
              aria-label="Aritii Market home"
            >
              <BrandLogo size="sm" showText showTagline={false} linked={false} />
            </Link>

            {/* Deliver to - Dropdown trigger */}
            <div className="relative flex-shrink-0" ref={deliverToRef}>
              <button
                type="button"
                onClick={() => setDeliverToOpen((v) => !v)}
                className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75d04b]"
                aria-expanded={deliverToOpen}
                aria-haspopup="dialog"
                aria-label="Deliver to"
              >
                <MdLocationOn size={18} className="text-[#75d04b] flex-shrink-0" />
                <div className="text-left hidden sm:flex sm:flex-col leading-tight">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 font-normal leading-none">Deliver to</span>
                  <span className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[100px] lg:max-w-[130px] leading-tight">
                    {getDeliveryLocation()}
                  </span>
                </div>
              </button>
              {deliverToOpen && (
                <div
                  className="absolute top-full left-0 mt-2 z-[80] w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                  role="dialog"
                  aria-label="Delivery location selector"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#75d04b]">
                        Delivery Location
                      </p>
                      <button
                        type="button"
                        onClick={() => setDeliverToOpen(false)}
                        className="text-xs text-gray-400 hover:text-gray-700 dark:hover:text-white p-1 rounded-full"
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
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setDeliverToOpen(false);
                          navigate('/my-dashboard/addresses');
                        }}
                        className="text-xs text-[#75d04b] hover:underline font-medium text-left"
                      >
                        Manage addresses →
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliverToOpen(false)}
                        className="px-3.5 py-1.5 bg-[#75d04b] hover:brightness-95 text-white text-xs font-semibold rounded-full transition-all"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Center: Aritii prominent pill search */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-1 lg:mx-2">
              <HeaderSearch
                variant="inline"
                destination={(term) => `/products?search=${encodeURIComponent(term)}`}
                placeholder="Search products, shops, and categories..."
                ariaLabel="Search products and shops"
                categories={categories.map((cat) => ({ title: cat.name || cat.title }))}
                className="w-full"
              />
            </div>

            {/* Right side controls: Seller/Driver portals · Account & Lists · Orders · Cart */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* Quick portal links (desktop) */}
              <div className="hidden xl:flex items-center gap-1 text-xs">
                <Link
                  to={isSeller ? '/business' : '/seller-center'}
                  className="px-2.5 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-full transition-colors whitespace-nowrap"
                >
                  {isSeller ? 'Seller Central' : 'Sell'}
                </Link>
                <Link
                  to={isProvider ? '/provider' : '/delivery-center'}
                  className="px-2.5 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/30 rounded-full transition-colors whitespace-nowrap"
                >
                  {isProvider ? 'Driver Portal' : 'Driver'}
                </Link>
              </div>

              {/* Account / User Menu */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75d04b]"
                aria-expanded={mobileMenuOpen}
                aria-label="Account & Lists"
              >
                <AiOutlineUser size={18} className="text-[#75d04b] sm:hidden" />
                <div className="text-left hidden sm:flex sm:flex-col leading-tight">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 font-normal leading-none truncate max-w-[110px]">
                    {isAuthenticated ? `Hi, ${user?.name?.split(' ')[0] || user?.firstName || 'User'}` : 'Sign in'}
                  </span>
                  <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center leading-tight">
                    My Account
                    <span className="text-[8px] ml-1 text-gray-400">▼</span>
                  </span>
                </div>
              </button>

              {/* Orders link */}
              <Link
                to="/my-dashboard/orders"
                onClick={(e) => {
                  if (!isAuthenticated) {
                    e.preventDefault();
                    openLoginModal('BUYER');
                  }
                }}
                className="hidden lg:flex flex-col text-left p-1 sm:px-2.5 sm:py-1.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full leading-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75d04b]"
                aria-label="Orders"
              >
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-normal leading-none">Track</span>
                <span className="text-xs font-bold text-gray-900 dark:text-white leading-tight">Orders</span>
              </Link>

              {/* Cart — Aritii Shopping Cart with brand badge */}
              <Link
                to="/cart"
                className="relative flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75d04b]"
                aria-label={`Cart, ${cartItemCount} items`}
              >
                <div className="relative flex items-center">
                  <AiOutlineShoppingCart size={22} className="text-gray-800 dark:text-gray-100" />
                  <span className="absolute -top-1.5 left-2.5 flex items-center justify-center min-w-[20px] h-5 px-1 text-white text-[11px] font-extrabold rounded-full bg-[#75d04b] shadow-xs">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                </div>
                <span className="hidden sm:inline text-xs font-bold text-gray-900 dark:text-white self-end mb-0.5 ml-1">
                  Cart
                </span>
              </Link>

              {/* Menu trigger */}
              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer ml-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75d04b]"
                aria-label="Open navigation menu"
                aria-expanded={mobileMenuOpen}
                title="Navigation menu"
              >
                <AiOutlineMenu size={20} className="text-[#75d04b] sm:text-gray-700 dark:sm:text-white flex-shrink-0" />
              </button>
            </div>
          </div>
        </div>

        {/* ===== Mobile search strip ===== */}
        <div className="md:hidden w-full bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-3 sm:px-4 py-2">
          <HeaderSearch
            variant="inline"
            destination={(term) => `/products?search=${encodeURIComponent(term)}`}
            placeholder="Search products, shops…"
            ariaLabel="Search products and shops"
            className="w-full"
          />
        </div>

        {/* ===== Integrated Sub Navigation Bar ===== */}
        {!hideSubNav && <SubNavBar isEmbedded={true} onOpenAll={onOpenAll} />}
      </header>

      {/* ===== Slide-out Menu Drawer ===== */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[75]"
          onClick={() => setMobileMenuOpen(false)}
        >
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/60 transition-opacity" aria-hidden="true" />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-y-0 right-0 z-[80] flex w-80 max-w-[88vw] flex-col border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl text-gray-900 dark:text-white"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-800/60">
              {isAuthenticated ? (
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#75d04b] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {(user?.name || user?.firstName || 'B')[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 block leading-none">Hello,</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white truncate block max-w-[170px] leading-tight">
                      {user?.name || user?.firstName || 'Buyer'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <AiOutlineUser size={20} className="text-[#75d04b]" />
                  <span className="text-sm font-bold text-gray-900 dark:text-white">Hello, Sign in</span>
                </div>
              )}
              <button
                ref={drawerCloseRef}
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <AiOutlineClose size={22} />
              </button>
            </div>

            {/* Drawer Body */}
            <nav className="p-4 space-y-4 overflow-y-auto flex-1">
              {/* If authenticated: Prominent Buyer Dashboard banner */}
              {isAuthenticated ? (
                <div className="p-3 bg-[#f3ffee] dark:bg-gray-800 rounded-xl border border-[#75d04b]/30 shadow-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#75d04b]">
                      Buyer Portal
                    </span>
                    <span className="text-[10px] bg-[#75d04b]/20 text-[#5ac12f] px-2 py-0.5 rounded-full font-medium">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-2.5">
                    Track orders, manage addresses, cart, and account settings.
                  </p>
                  <Link
                    to="/my-dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-[#75d04b] hover:brightness-95 text-white text-xs font-semibold rounded-full transition shadow-xs"
                  >
                    <MdDashboard size={16} />
                    <span>View Buyer Dashboard</span>
                  </Link>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 dark:bg-gray-800/70 rounded-xl border border-gray-200 dark:border-gray-700 text-center space-y-3 shadow-xs">
                  <div className="w-10 h-10 mx-auto rounded-full bg-[#75d04b]/15 text-[#75d04b] flex items-center justify-center font-bold">
                    <AiOutlineUser size={22} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">Welcome to Aritii</h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                      Sign in for your orders, saved items, and personalized shopping
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openLoginModal('BUYER');
                    }}
                    className="w-full py-2.5 px-4 bg-[#75d04b] hover:brightness-95 text-white text-xs font-semibold rounded-full transition text-center shadow-xs cursor-pointer"
                  >
                    Sign In
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    New customer?{' '}
                    <Link
                      to="/sign-up"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-[#75d04b] font-bold hover:underline"
                    >
                      Start here.
                    </Link>
                  </p>
                </div>
              )}

              {/* Buyer Account Links */}
              {isAuthenticated && (
                <div className="border-b border-gray-200 dark:border-gray-800 pb-3">
                  <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Buyer Account
                  </p>
                  <div className="space-y-0.5">
                    {isSeller && (
                      <Link
                        to="/business"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors ${
                          location.pathname.startsWith('/business')
                            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold'
                            : 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20'
                        }`}
                      >
                        <MdDashboard size={16} className="text-amber-500" />
                        <span>Seller Central Portal</span>
                      </Link>
                    )}
                    {isProvider && (
                      <Link
                        to="/provider"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors ${
                          location.pathname.startsWith('/provider')
                            ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400 font-bold'
                            : 'text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/20'
                        }`}
                      >
                        <MdLocalShipping size={16} className="text-sky-500" />
                        <span>Delivery Provider Portal</span>
                      </Link>
                    )}
                    <Link
                      to="/my-dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors ${
                        location.pathname === '/my-dashboard'
                          ? 'bg-[#f3ffee] dark:bg-[#75d04b]/15 text-[#75d04b] font-bold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <MdDashboard size={16} className="text-[#75d04b]" />
                      <span>Buyer Dashboard</span>
                    </Link>
                    <Link
                      to="/my-dashboard/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors ${
                        location.pathname.startsWith('/my-dashboard/orders')
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <MdLocalShipping size={16} className="text-gray-500" />
                      <span>Your Orders & Returns</span>
                    </Link>
                    <Link
                      to="/my-dashboard/wishlist"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors ${
                        location.pathname.startsWith('/my-dashboard/wishlist')
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <AiOutlineHeart size={16} className="text-gray-500" />
                      <span>Saved Items / Wishlist</span>
                    </Link>
                    <Link
                      to="/my-dashboard/addresses"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors ${
                        location.pathname.startsWith('/my-dashboard/addresses')
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <MdLocationOn size={16} className="text-gray-500" />
                      <span>Delivery Addresses</span>
                    </Link>
                    <Link
                      to="/my-dashboard/requests"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors ${
                        location.pathname.startsWith('/my-dashboard/requests')
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <AiOutlineUser size={16} className="text-gray-500" />
                      <span>Messages & Requests</span>
                    </Link>
                    <Link
                      to="/my-dashboard/settings"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors ${
                        location.pathname.startsWith('/my-dashboard/settings') || location.pathname.startsWith('/my-dashboard/profile')
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <MdSettings size={16} className="text-gray-500" />
                      <span>Account Settings</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Marketplace Navigation */}
              <div className="border-b border-gray-200 dark:border-gray-800 pb-3">
                <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Explore Marketplace
                </p>
                <div className="space-y-0.5">
                  <Link
                    to="/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-2.5 py-2 rounded-lg text-xs transition-colors ${
                      location.pathname.startsWith('/products')
                        ? 'bg-[#f3ffee] dark:bg-[#75d04b]/15 text-[#75d04b] font-bold'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    All Products
                  </Link>
                  <Link
                    to="/shops"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-2.5 py-2 rounded-lg text-xs transition-colors ${
                      location.pathname.startsWith('/shops')
                        ? 'bg-[#f3ffee] dark:bg-[#75d04b]/15 text-[#75d04b] font-bold'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Shops Directory
                  </Link>
                  <Link
                    to="/categories"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-2.5 py-2 rounded-lg text-xs transition-colors ${
                      location.pathname.startsWith('/categories')
                        ? 'bg-[#f3ffee] dark:bg-[#75d04b]/15 text-[#75d04b] font-bold'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Shop by Category
                  </Link>
                  <Link
                    to="/deals"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-2.5 py-2 rounded-lg text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Today's Deals
                  </Link>
                  <Link
                    to="/best-selling"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-2.5 py-2 rounded-lg text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Best Sellers
                  </Link>
                </div>
              </div>

              {/* Cross-Portal Links & Support */}
              <div className="border-b border-gray-200 dark:border-gray-800 pb-3">
                <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Cross-Portal Navigation
                </p>
                <div className="space-y-0.5">
                  <Link
                    to={isSeller ? '/business' : '/seller-center'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-2.5 py-2 rounded-lg text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 font-medium transition-colors"
                  >
                    {isSeller ? '🏪 Seller Central (Merchant Portal)' : '🏪 Sell on Aritii (Merchant Hub)'}
                  </Link>
                  <Link
                    to={isProvider ? '/provider' : '/delivery-center'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-2.5 py-2 rounded-lg text-xs text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/20 font-medium transition-colors"
                  >
                    {isProvider ? '🚚 Delivery Driver (Courier Portal)' : '🚚 Become a Delivery Driver (Hub)'}
                  </Link>
                  <Link
                    to="/help"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-2.5 py-2 rounded-lg text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
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
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors font-medium"
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
  );
};

export default MarketplaceHeader;
