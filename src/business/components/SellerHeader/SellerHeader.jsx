import React, { useState, useEffect } from 'react';
import BrandLogo from '@/components/common/BrandLogo';
import { MdNotifications, MdHelpOutline } from 'react-icons/md';
import { AiOutlineSearch, AiOutlineMenu, AiOutlineClose, AiOutlineUser } from 'react-icons/ai';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logoutUser } from '@/store/slices/userThunks';
import { useBusinessShops } from '@/business/hooks/useBusinessShops';
import { FiCheckCircle } from 'react-icons/fi';
import { normalizeStatus, ORDER_STATUSES } from '@/shared/utils/orderStatus';
import RoleSwitcher from '@/shared/components/RoleSwitcher';

const SellerHeader = ({ onMenuClick }) => {
  const { seller } = useSelector((state) => state.seller);
  const { ShopOrders = [] } = useSelector((state) => state.order || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const { activeShopId, activeShop } = useBusinessShops();

  const storeName = activeShop?.name || seller?.name || 'My Store';

  const pendingOrders = ShopOrders?.filter(o => normalizeStatus(o.status) === ORDER_STATUSES.PROCESSING).length || 0;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (q) {
      const shopId = activeShopId || seller?._id;
      navigate(`/business/products?search=${encodeURIComponent(q)}&shop=${shopId}`);
      setSearchTerm('');
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Close profile dropdown on route change
  useEffect(() => {
    setProfileOpen(false);
  }, [location.pathname]);

  const profileItems = [
    { label: 'Seller Profile', to: '/business/settings', icon: AiOutlineUser },
    { label: 'Orders', to: '/business/orders' },
    { label: 'Products', to: '/business/products' },
    { label: 'Settings', to: '/business/settings' },
    { type: 'divider' },
    { label: 'Sign Out', onClick: handleLogout },
  ];

  const getBreadcrumb = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.length === 0 || pathSegments[0] === 'business') {
      return { title: 'Dashboard', path: '/business' };
    }

    const pageMap = {
      'dashboard': { title: 'Dashboard', path: '/business' },
      'products': { title: 'Products', path: '/business/products' },
      'orders': { title: 'Orders', path: '/business/orders' },
      'customers': { title: 'Customers', path: '/business/customers' },
      'requests': { title: 'Product Requests', path: '/business/requests' },
      'analytics': { title: 'Analytics', path: '/business/analytics' },
      'reports': { title: 'Reports', path: '/business/reports' },
      'promotions': { title: 'Promotions', path: '/business/promotions' },
      'events': { title: 'Events', path: '/business/events' },
      'revenue': { title: 'Revenue', path: '/business/revenue' },
      'transactions': { title: 'Transactions', path: '/business/transactions' },
      'shops': { title: 'Shops', path: '/business/shops' },
      'reviews': { title: 'Reviews', path: '/business/reviews' },
      'settings': { title: 'Settings', path: '/business/settings' },
      'inventory': { title: 'Inventory', path: '/business/inventory' },
      'refunds': { title: 'Refunds', path: '/business/refunds' },
    };

    const lastSegment = pathSegments[pathSegments.length - 1];
    return pageMap[lastSegment] || { title: lastSegment, path: location.pathname };
  };

  const { title: breadcrumbTitle, path: breadcrumbPath } = getBreadcrumb();

  return (
    <header className="seller-header-bar" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: hamburger + logo + breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Open navigation menu"
            >
              <AiOutlineMenu size={20} />
            </button>
            <Link to="/business" className="flex items-center gap-2">
              <BrandLogo className="h-8 w-auto" linked={false} />
              <span className="hidden sm:inline font-bold text-gray-900 dark:text-white text-sm">Seller Portal</span>
            </Link>
            <Link
              to={breadcrumbPath || '/business'}
              className="hidden sm:flex items-center gap-1 text-sm text-market-on-surface-variant hover:text-market-primary transition-colors"
              aria-label={breadcrumbTitle}
            >
              {breadcrumbTitle}
            </Link>
          </div>

          {/* Center: search */}
          <div className="hidden md:flex flex-1 max-w-2xl">
            <form onSubmit={handleSearchSubmit} className="relative">
              <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size={16}" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search products…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onSubmit={handleSearchSubmit}
                className="w-full pl-9 pr-4 py-2 border border-market-border rounded-lg text-market-on-surface focus:outline-none focus:ring-2 focus:ring-market-primary/30"
                aria-label="Search products"
              />
            </form>
          </div>

          {/* Right: notifications, help, profile, role switcher, marketplace, logout */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Link
              to="/business/orders"
              className="relative p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Notifications"
            >
              <MdNotifications size={20} />
              {pendingOrders > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {pendingOrders > 9 ? '9+' : pendingOrders}
                </span>
              )}
            </Link>

            <button
              aria-label="Help"
              className="hidden lg:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <MdHelpOutline size={20} />
            </button>

            {/* Profile dropdown */}
            <div className="relative group">
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Seller profile menu"
                aria-expanded={profileOpen}
              >
                <AiOutlineUser size={20} />
                <span className="hidden sm:inline text-sm font-medium">{seller?.name || 'Seller'}</span>
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1a1f2a] border border-market-border rounded-lg shadow-xl py-2 z-50"
                  role="menu"
                >
                  {profileItems.map((item, i) => {
                    if (item.type === 'divider') {
                      return <div key="div" className="h-px bg-market-border my-1" />;
                    }
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm rounded-none hover:bg-market-surface-container-high transition-colors cursor-pointer"
                        onClick={() => { setProfileOpen(false); if (!item.onClick) navigate(item.to); }}
                        role="menuitem"
                      >
                        {item.icon && <item.icon size={18} className="text-market-on-surface-variant" />}
                        <span className="flex-1 text-market-on-surface">{item.label}</span>
                      </div>
                    );
                  })}
                  <div className="border-t border-market-border pt-3 mt-2">
                    <button
                      type="button"
                      onClick={() => { setProfileOpen(false); handleLogout(); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <AiOutlineUser size={18} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <RoleSwitcher />

            <Link
              to="/marketplace"
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-white/90"
              aria-label="Marketplace"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 21 10 21" />
              </svg>
            </Link>

            <button
              onClick={handleLogout}
              aria-label="Log out"
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-red-600/20 hover:scale-105 active:scale-95 transition-all duration-200 text-red-600 dark:text-red-400"
              title="Log out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SellerHeader;
