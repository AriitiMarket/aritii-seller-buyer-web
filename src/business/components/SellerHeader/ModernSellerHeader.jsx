import React, { useState, useEffect, useRef } from 'react';
import BrandLogo from '@/components/common/BrandLogo';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logoutUser } from '@/store/slices/userThunks';
import { useBusinessShops } from '@/business/hooks/useBusinessShops';
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
      await dispatch(logoutUser());
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Logout failed:', err);
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
    <header className="sticky top-0 z-50 bg-[#131921] border-b border-[#232f3e] shadow-sm text-white" role="banner">
      {/* Main header bar */}
      <div className="px-3 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between h-13 py-1.5 gap-3">
          {/* Left: Mobile Menu + Logo & Seller Central Wordmark */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={onMenuClick}
              className="lg:hidden p-1.5 rounded text-gray-300 hover:text-white hover:bg-[#232f3e] transition-colors"
              aria-label="Open navigation menu"
            >
              <AiOutlineMenu size={20} />
            </button>

            {/* Desktop Sidebar Toggle */}
            <button
              type="button"
              onClick={onToggleSidebar}
              className="hidden lg:flex p-1.5 rounded text-gray-300 hover:text-white hover:bg-[#232f3e] transition-colors"
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

            {/* Logo + Aritii Seller Central Brand */}
            <Link to="/business" className="flex items-center gap-2 flex-shrink-0 p-1 rounded hover:outline hover:outline-1 hover:outline-white transition-all">
              <BrandLogo size="sm" showText={false} linked={false} tone="light" />
              <div className="flex flex-col leading-none">
                <span className="text-sm font-black text-white tracking-tight leading-tight">Aritii</span>
                <span className="text-[10px] font-bold text-[#febd69] uppercase tracking-wider leading-none">
                  Seller Central
                </span>
              </div>
            </Link>

            {/* Store Switcher Dropdown - Aritii style */}
            {shops && shops.length > 0 && (
              <div className="relative ml-1 sm:ml-3" ref={shopSelectorRef}>
                <button
                  type="button"
                  onClick={() => setShopOpen((open) => !open)}
                  aria-haspopup="menu"
                  aria-expanded={shopOpen}
                  disabled={shops.length < 2}
                  className="flex max-w-[150px] sm:max-w-[220px] items-center gap-1.5 rounded px-2.5 py-1 text-xs text-white hover:outline hover:outline-1 hover:outline-white bg-[#232f3e]/60 transition-all disabled:cursor-default"
                  title="Switch shop"
                >
                  <MdStorefront size={16} className="text-[#febd69]" />
                  <span className="truncate max-w-[90px] sm:max-w-[140px] font-medium">{storeName}</span>
                  {shops.length > 1 && (
                    <span className="text-[9px] text-gray-400">▼</span>
                  )}
                </button>
                {shopOpen && shops.length > 1 && (
                  <div role="menu" aria-label="Select shop" className="absolute left-0 top-full z-[100] mt-1.5 w-64 overflow-hidden rounded-md border border-[#232f3e] bg-[#1a222d] py-1 text-white shadow-2xl">
                    <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-[#232f3e]">Your Stores</p>
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
                          className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-xs transition hover:bg-[#232f3e] ${activeShopId === shop._id ? 'text-[#febd69] font-bold bg-[#232f3e]/50' : 'text-gray-300'}`}
                        >
                          <span className="truncate">{shop.name || 'Unnamed shop'}</span>
                          {activeShopId === shop._id && <span aria-hidden="true" className="text-[#febd69]">✓</span>}
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-[#232f3e] p-2 bg-[#131921]">
                      <Link to="/business/shops" onClick={() => setShopOpen(false)} className="block text-center rounded px-2 py-1.5 text-xs font-semibold text-[#febd69] hover:underline">Manage Stores →</Link>
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
              className="text-xs text-gray-300 hover:text-white px-3 py-1 rounded hover:bg-[#232f3e] flex items-center gap-1.5 transition-colors"
            >
              <span>View Customer Marketplace</span>
              <span className="text-[#febd69]">→</span>
            </Link>
          </div>

          {/* Right: Quick actions (Notifications, Role Switcher, Account menu) */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Help & Support */}
            <Link
              to="/help"
              className="p-1.5 rounded text-gray-300 hover:text-white hover:bg-[#232f3e] transition-colors"
              aria-label="Help"
              title="Help & Support"
            >
              <MdHelpOutline size={19} />
            </Link>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-1.5 rounded text-gray-300 hover:text-white hover:bg-[#232f3e] transition-colors"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
                aria-haspopup="menu"
              >
                <MdNotifications size={19} />
                {pendingOrders > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-4 px-1 bg-[#f08804] text-white text-[10px] font-extrabold rounded-full">
                    {pendingOrders > 99 ? '99+' : pendingOrders}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#1a222d] rounded-md shadow-2xl border border-[#232f3e] overflow-hidden z-[90]">
                  <div className="p-3 border-b border-[#232f3e] bg-[#131921] flex items-center justify-between">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-white">Pending Action</h3>
                    <span className="text-[11px] text-[#febd69] font-semibold">{pendingOrders} Orders</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto p-2">
                    {pendingOrders > 0 ? (
                      <div className="space-y-2">
                        <Link
                          to="/business/orders"
                          className="block p-2.5 bg-[#232f3e] border border-[#37475a] rounded hover:border-[#febd69] transition-colors"
                          onClick={() => setNotificationsOpen(false)}
                        >
                          <div className="flex items-start gap-2.5">
                            <MdShoppingBag className="text-[#febd69] flex-shrink-0 mt-0.5" size={18} />
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-white text-xs">
                                {pendingOrders} pending order{pendingOrders !== 1 ? 's' : ''}
                              </p>
                              <p className="text-[11px] text-gray-400">
                                Ready to confirm & ship
                              </p>
                            </div>
                          </div>
                        </Link>

                        {lowStock > 0 && (
                          <Link
                            to="/business/inventory"
                            className="block p-2.5 bg-[#232f3e] border border-[#37475a] rounded hover:border-[#febd69] transition-colors"
                            onClick={() => setNotificationsOpen(false)}
                          >
                            <div className="flex items-start gap-2.5">
                              <MdErrorOutline className="text-amber-400 flex-shrink-0 mt-0.5" size={18} />
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-white text-xs">
                                  {lowStock} low stock items
                                </p>
                                <p className="text-[11px] text-gray-400">
                                  Replenish inventory
                                </p>
                              </div>
                            </div>
                          </Link>
                        )}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-xs text-gray-400">
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
                className="flex items-center gap-1.5 p-1 sm:px-2 rounded text-white hover:outline hover:outline-1 hover:outline-white transition-all"
                aria-label="Account menu"
                aria-expanded={profileOpen}
                aria-haspopup="menu"
              >
                <AiOutlineUser size={18} className="text-[#febd69]" />
                <div className="text-left hidden sm:flex sm:flex-col leading-tight">
                  <span className="text-[10px] text-gray-300 font-normal leading-none truncate max-w-[100px]">
                    {seller?.name || 'Seller'}
                  </span>
                  <span className="text-xs font-bold text-white leading-tight flex items-center">
                    Settings
                    <span className="text-[8px] ml-1 text-gray-400">▼</span>
                  </span>
                </div>
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#1a222d] rounded-md shadow-2xl border border-[#232f3e] overflow-hidden z-[90]">
                  {/* Seller Info Header */}
                  <div className="p-3 border-b border-[#232f3e] bg-[#131921]">
                    <p className="text-xs font-bold text-white truncate">{seller?.name || 'Seller Account'}</p>
                    <p className="text-[11px] text-gray-400 truncate">{seller?.email || 'seller@aritii.local'}</p>
                  </div>

                  {/* Account Menu Items */}
                  <div className="p-1 space-y-0.5">
                    <Link
                      to="/business/settings"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-gray-200 hover:text-white hover:bg-[#232f3e] rounded transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <AiOutlineUser size={16} />
                      Settings
                    </Link>
                    <Link
                      to="/business/shops"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-gray-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <MdStorefront size={16} />
                      My Stores
                    </Link>
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-700 p-2">
                    <button
                      type="button"
                      onClick={() => {
                        handleLogout();
                        setProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors font-medium"
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
