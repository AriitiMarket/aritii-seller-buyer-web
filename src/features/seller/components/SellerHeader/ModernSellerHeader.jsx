import React, { useState, useEffect, useRef } from 'react';
import BrandLogo from '@/components/common/BrandLogo';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logoutUser } from '@/store/slices/userThunks';
import { useBusinessShops } from '@/features/seller/hooks/useBusinessShops';
import { normalizeStatus, ORDER_STATUSES } from '@/shared/utils/orderStatus';
import {
  MdNotifications,
  MdHelpOutline,
  MdStorefront,
  MdShoppingBag,
  MdErrorOutline,
} from 'react-icons/md';
import { AiOutlineMenu, AiOutlineUser, AiOutlineLogout } from 'react-icons/ai';
import RoleSwitcher from '@/shared/components/RoleSwitcher';

/**
 * ModernSellerHeader - Professional Seller Portal header
 *
 * Features:
 * - Aritii branding + Seller Portal label
 * - Store switcher dropdown (multi-store support)
 * - Global search for orders/inventory/SKUs
 * - Quick metrics bar (Today's Sales, Pending Orders, Active Listings, Health)
 * - Notifications center with pending orders badge
 * - Account menu with settings and logout
 * - Role switcher to switch between buyer/seller/provider
 * - Sidebar collapse/expand toggle (desktop)
 * - Responsive design (hamburger menu on mobile)
 */
const ModernSellerHeader = ({ onMenuClick, onToggleSidebar, sidebarCollapsed }) => {
  const { seller } = useSelector((state) => state.seller);
  const { ShopOrders = [] } = useSelector((state) => state.order || {});
  const { shopProducts = [] } = useSelector((state) => state.products || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { activeShopId, activeShop, shops, selectShop } = useBusinessShops();

  const [shopOpen, setShopOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);
  const shopSelectorRef = useRef(null);

  // Calculate metrics
  const pendingOrders = ShopOrders.filter(o => normalizeStatus(o.status) === ORDER_STATUSES.PROCESSING).length;
  const lowStock = shopProducts.filter(p => {
    const available = Math.max(0, Number(p.stock ?? 0) - Number(p.reserved ?? 0));
    return available > 0 && available <= 5;
  }).length;

  // Handle search

  // Handle logout
  const handleLogout = async () => {
    try {
      const res = await dispatch(logoutUser());
      toast.success(res?.message || 'Signed out successfully');
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Logout failed:', err);
      navigate('/', { replace: true });
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) setNotificationsOpen(false);
      if (shopSelectorRef.current && !shopSelectorRef.current.contains(e.target)) setShopOpen(false);
    };
    if (profileOpen || notificationsOpen || shopOpen) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [profileOpen, notificationsOpen, shopOpen]);

  // Close dropdowns on route change
  useEffect(() => {
    setProfileOpen(false);
    setNotificationsOpen(false);
    setShopOpen(false);
  }, [location.pathname]);

  const storeName = activeShop?.name || seller?.name || 'My Store';

  return (
    <header className="min-h-[72px] sm:min-h-[80px] bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 flex items-center text-gray-900 dark:text-white" role="banner">
      {/* Main header bar */}
      <div className="w-full px-3 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between h-13 py-1.5 gap-3">
          {/* Left: Mobile Menu + Logo & Seller Central Wordmark */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Open navigation menu"
            >
              <AiOutlineMenu size={20} />
            </button>

            {/* Desktop Sidebar Toggle */}
            <button
              type="button"
              onClick={onToggleSidebar}
              className="hidden lg:flex p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              )}
            </button>

            {/* Logo + Aritii Seller Hub Brand */}
            <Link to="/business" className="flex items-center gap-2 flex-shrink-0 p-1 rounded-lg hover:opacity-90 transition-opacity">
              <BrandLogo size="sm" showText={false} linked={false} />
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-gray-900 dark:text-white tracking-tight leading-none">Aritii</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30">
                  Seller Hub
                </span>
              </div>
            </Link>

            {/* Store Switcher Dropdown */}
            {shops && shops.length > 0 && (
              <div className="relative ml-1 sm:ml-3" ref={shopSelectorRef}>
                <button
                  type="button"
                  onClick={() => setShopOpen((open) => !open)}
                  aria-haspopup="menu"
                  aria-expanded={shopOpen}
                  disabled={shops.length < 2}
                  className="flex max-w-[160px] sm:max-w-[220px] items-center gap-2 rounded-full px-3 py-1.5 text-xs text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-[#75d04b] dark:hover:border-[#75d04b] focus:border-[#75d04b] focus:ring-2 focus:ring-[#75d04b]/20 transition-all disabled:cursor-default"
                  title="Switch shop"
                >
                  <MdStorefront size={16} className="text-[#75d04b]" />
                  <span className="truncate max-w-[90px] sm:max-w-[140px] font-medium">{storeName}</span>
                  {shops.length > 1 && (
                    <span className="text-[9px] text-gray-400">▼</span>
                  )}
                </button>
                {shopOpen && shops.length > 1 && (
                  <div role="menu" aria-label="Select shop" className="absolute left-0 top-full z-[100] mt-1.5 w-64 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-1 text-gray-900 dark:text-white shadow-xl">
                    <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-700">Your Stores</p>
                    <div className="max-h-64 overflow-y-auto py-1">
                      {shops.map((shop) => (
                        <button
                          key={shop._id}
                          type="button"
                          role="menuitemradio"
                          aria-checked={activeShopId === shop._id}
                          onClick={() => {
                            selectShop(shop._id);
                            setShopOpen(false);
                          }}
                          className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-xs transition hover:bg-gray-50 dark:hover:bg-gray-700 ${activeShopId === shop._id ? 'text-[#75d04b] font-bold bg-[#f3ffee] dark:bg-[#75d04b]/15' : 'text-gray-700 dark:text-gray-200'}`}
                        >
                          <span className="truncate">{shop.name || 'Unnamed shop'}</span>
                          {activeShopId === shop._id && <span aria-hidden="true" className="text-[#75d04b]">✓</span>}
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-900/50">
                      <Link to="/business/shops" onClick={() => setShopOpen(false)} className="block text-center rounded-lg px-2 py-1.5 text-xs font-semibold text-[#75d04b] hover:underline">Manage Stores →</Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Center search strip or marketplace fast link */}
          <div className="hidden md:flex items-center justify-center flex-1 max-w-md">
            <Link
              to="/products"
              className="text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-[#75d04b] dark:hover:text-[#75d04b] px-3.5 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 hover:border-[#75d04b] dark:hover:border-[#75d04b] bg-gray-50 dark:bg-gray-800 transition-all flex items-center gap-1.5 shadow-xs"
            >
              <span>← Back to Shopping</span>
            </Link>
          </div>

          {/* Right: Quick actions (Notifications, Role Switcher, Account menu) */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Help & Support */}
            <Link
              to="/help"
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Help"
              title="Help & Support"
            >
              <MdHelpOutline size={19} />
            </Link>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
                aria-haspopup="menu"
              >
                <MdNotifications size={19} />
                {pendingOrders > 0 && (
                  <span className="absolute top-0 right-0 flex items-center justify-center min-w-[18px] h-4 px-1 bg-[#75d04b] text-white text-[10px] font-bold rounded-full">
                    {pendingOrders > 99 ? '99+' : pendingOrders}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-[90]">
                  <div className="p-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center justify-between">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-gray-900 dark:text-white">Pending Action</h3>
                    <span className="text-[11px] text-[#75d04b] font-semibold">{pendingOrders} Orders</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto p-2">
                    {pendingOrders > 0 ? (
                      <div className="space-y-2">
                        <Link
                          to="/business/orders"
                          className="block p-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-[#75d04b] transition-colors"
                          onClick={() => setNotificationsOpen(false)}
                        >
                          <div className="flex items-start gap-2.5">
                            <MdShoppingBag className="text-[#75d04b] flex-shrink-0 mt-0.5" size={18} />
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-gray-900 dark:text-white text-xs">
                                {pendingOrders} pending order{pendingOrders !== 1 ? 's' : ''}
                              </p>
                              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                Ready to confirm & ship
                              </p>
                            </div>
                          </div>
                        </Link>

                        {lowStock > 0 && (
                          <Link
                            to="/business/inventory"
                            className="block p-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-[#75d04b] transition-colors"
                            onClick={() => setNotificationsOpen(false)}
                          >
                            <div className="flex items-start gap-2.5">
                              <MdErrorOutline className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-900 dark:text-white text-xs">
                                  {lowStock} low stock items
                                </p>
                                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                  Replenish inventory
                                </p>
                              </div>
                            </div>
                          </Link>
                        )}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-xs text-gray-500 dark:text-gray-400">
                        <p>No orders pending action</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher */}
            <RoleSwitcher />

            {/* Account Menu */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1 sm:px-2.5 py-1 rounded-full border-2 border-[#75d04b] bg-white dark:bg-gray-800 hover:opacity-90 transition-all"
                aria-label="Account menu"
                aria-expanded={profileOpen}
                aria-haspopup="menu"
              >
                <AiOutlineUser size={18} className="text-[#75d04b]" />
                <div className="text-left hidden sm:flex sm:flex-col leading-tight">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 font-normal leading-none truncate max-w-[100px]">
                    {seller?.name || 'Seller'}
                  </span>
                  <span className="text-xs font-bold text-gray-900 dark:text-white leading-tight flex items-center">
                    Settings
                    <span className="text-[8px] ml-1 text-gray-400">▼</span>
                  </span>
                </div>
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-[90]">
                  {/* Seller Info Header */}
                  <div className="p-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{seller?.name || 'Seller Account'}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{seller?.email || 'seller@aritii.local'}</p>
                  </div>

                  {/* Account Menu Items */}
                  <div className="p-1 space-y-0.5">
                    <Link
                      to="/business/settings"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <AiOutlineUser size={16} />
                      Settings
                    </Link>
                    <Link
                      to="/business/shops"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <MdStorefront size={16} />
                      My Stores
                    </Link>
                  </div>
                  <div className="border-t border-gray-100 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-900/50">
                    <button
                      type="button"
                      onClick={() => {
                        handleLogout();
                        setProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors font-semibold"
                    >
                      <AiOutlineLogout size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ModernSellerHeader;
