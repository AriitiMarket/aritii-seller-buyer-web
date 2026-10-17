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
  MdTrendingUp,
  MdShoppingBag,
  MdErrorOutline,
} from 'react-icons/md';
import { AiOutlineSearch, AiOutlineMenu, AiOutlineUser, AiOutlineLogout } from 'react-icons/ai';
import RoleSwitcher from '@/shared/components/RoleSwitcher';

/**
 * ModernSellerHeader - Amazon Seller Central style header
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

  const [searchTerm, setSearchTerm] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  // Calculate metrics
  const pendingOrders = ShopOrders.filter(o => normalizeStatus(o.status) === ORDER_STATUSES.PROCESSING).length;
  const todaysSales = ShopOrders
    .filter(o => {
      const orderDate = new Date(o.createdAt);
      const today = new Date();
      return orderDate.toDateString() === today.toDateString();
    })
    .reduce((acc, o) => acc + (Number(o.totalPrice) || 0), 0);
  const activeListings = shopProducts.length;
  const outOfStock = shopProducts.filter(p => Number(p.stock ?? 0) <= 0).length;
  const lowStock = shopProducts.filter(p => {
    const available = Math.max(0, Number(p.stock ?? 0) - Number(p.reserved ?? 0));
    return available > 0 && available <= 5;
  }).length;
  const healthStatus = outOfStock > 0 ? 'warning' : lowStock > 2 ? 'caution' : 'healthy';

  // Handle search
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (q) {
      navigate(`/business/products?search=${encodeURIComponent(q)}`);
      setSearchTerm('');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) setNotificationsOpen(false);
    };
    if (profileOpen || notificationsOpen) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [profileOpen, notificationsOpen]);

  // Close dropdowns on route change
  useEffect(() => {
    setProfileOpen(false);
    setNotificationsOpen(false);
  }, [location.pathname]);

  const storeName = activeShop?.name || seller?.name || 'My Store';

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-900 dark:to-slate-950 border-b border-slate-700 dark:border-slate-800 shadow-sm" role="banner">
      {/* Main header bar */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Menu + Sidebar Toggle */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              aria-label="Open navigation menu"
            >
              <AiOutlineMenu size={20} />
            </button>

            {/* Desktop Sidebar Toggle */}
            <button
              type="button"
              onClick={onToggleSidebar}
              className="hidden lg:flex p-2 rounded text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
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
          </div>

          {/* Center: Logo + Shop Selector - Amazon Style */}
          <div className="flex items-center gap-2 flex-shrink-0 flex-1 justify-center">
            <Link to="/business" className="flex items-center gap-2.5 flex-shrink-0 hover:opacity-80 transition-opacity">
              <div className="bg-white rounded-sm p-1">
                <BrandLogo size="sm" showText={false} linked={false} tone="light" />
              </div>
              <div className="flex flex-col hidden sm:flex">
                <span className="text-sm font-bold text-white">Aritii</span>
                <span className="text-[10px] text-slate-300 font-medium">Seller Central</span>
              </div>
            </Link>

            {/* Shop Selector Dropdown */}
            {shops && shops.length > 1 && (
              <div className="relative ml-4 hidden sm:block">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-sm"
                  title="Switch shop"
                >
                  <MdStorefront size={16} />
                  <span className="truncate max-w-[120px]">{storeName}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Help */}
            <button
              className="p-2 rounded text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              aria-label="Help"
              title="Help & Documentation"
            >
              <MdHelpOutline size={20} />
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
                aria-haspopup="menu"
              >
                <MdNotifications size={20} />
                {pendingOrders > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full">
                    {pendingOrders > 99 ? '99+' : pendingOrders}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-[90]">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Orders Pending</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {pendingOrders > 0 ? (
                      <div className="space-y-2 p-4">
                        <Link
                          to="/business/orders"
                          className="block p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                          onClick={() => setNotificationsOpen(false)}
                        >
                          <div className="flex items-start gap-3">
                            <MdShoppingBag className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" size={20} />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 dark:text-white">
                                {pendingOrders} pending order{pendingOrders !== 1 ? 's' : ''}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Ready to process
                              </p>
                            </div>
                          </div>
                        </Link>

                        {lowStock > 0 && (
                          <Link
                            to="/business/inventory"
                            className="block p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
                            onClick={() => setNotificationsOpen(false)}
                          >
                            <div className="flex items-start gap-3">
                              <MdErrorOutline className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" size={20} />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {lowStock} low stock items
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Reorder soon
                                </p>
                              </div>
                            </div>
                          </Link>
                        )}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                        <p>No pending orders</p>
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
                className="p-2 rounded text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                aria-label="Account menu"
                aria-expanded={profileOpen}
                aria-haspopup="menu"
              >
                <AiOutlineUser size={20} />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-[90]">
                  {/* Seller Info Header */}
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{seller?.name || 'Seller'}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{seller?.email || 'seller@aritii.local'}</p>
                  </div>

                  {/* Shop Selector (if multiple shops) */}
                  {shops && shops.length > 1 && (
                    <>
                      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Select Shop</h3>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {shops.map((shop) => (
                            <button
                              key={shop._id}
                              onClick={() => {
                                selectShop(shop._id);
                                setProfileOpen(false);
                              }}
                              className={`w-full px-3 py-2 text-sm text-left rounded transition-colors ${
                                activeShopId === shop._id
                                  ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-900 dark:text-orange-100 font-medium'
                                  : 'text-gray-900 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="truncate">{shop.name || 'Unnamed Shop'}</span>
                                {activeShopId === shop._id && (
                                  <span className="text-xs">✓</span>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700">
                        <Link
                          to="/business/shops"
                          className="block px-3 py-2 text-xs text-center text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium"
                          onClick={() => setProfileOpen(false)}
                        >
                          + Add New Shop
                        </Link>
                      </div>
                    </>
                  )}

                  {/* Account Menu Items */}
                  <div className="space-y-1 p-2">
                    <Link
                      to="/business/settings"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-gray-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
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
