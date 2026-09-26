import React, { useState } from "react";
import BrandLogo from '@/components/common/BrandLogo';
import { MdNotifications, MdHelpOutline } from 'react-icons/md';
import { AiOutlineSearch } from 'react-icons/ai';
import { BiMenuAltRight } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from '@/store/slices/userThunks';
import { useBusinessShops } from '@/business/hooks/useBusinessShops';
import { FiCheckCircle } from 'react-icons/fi';
import { normalizeStatus, ORDER_STATUSES } from '@/shared/utils/orderStatus';

/**
 * SellerHeader — top bar for the business workspace.
 *
 * Left:  hamburger (mobile) + logo + breadcrumb
 * Center/right: search, notifications, help
 * Far right: STATIC store branding title (shop name + Verified Seller).
 *            No profile dropdown — navigation lives in the sidebar only.
 */
const SellerHeader = ({ onMenuClick }) => {
  const { seller } = useSelector((state) => state.seller);
  const { ShopOrders = [] } = useSelector((state) => state.order || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const { activeShopId, activeShop } = useBusinessShops();

  const storeName = activeShop?.name || seller?.name || 'My Store';

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

  // Generate breadcrumb from current path
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

  const breadcrumb = getBreadcrumb();
  const pendingOrders = ShopOrders.filter(o => normalizeStatus(o.status) === ORDER_STATUSES.PROCESSING || normalizeStatus(o.status) === 'Pending').length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
      <div className="h-16 px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Side */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open seller menu"
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
          >
            <BiMenuAltRight size={24} />
          </button>

          {/* Logo */}
          <Link to="/business" className="flex items-center gap-2 shrink-0">
            <BrandLogo className="h-8 w-auto" linked={false} />
            <span className="hidden sm:inline-flex text-sm font-semibold text-brand-primary">
              Seller Portal
            </span>
          </Link>

          {/* Breadcrumb */}
          <nav className="hidden md:flex items-center gap-2 text-sm min-w-0">
            <Link to="/business" className="text-gray-500 hover:text-gray-900">
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium truncate">{breadcrumb.title}</span>
          </nav>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center border border-gray-200 rounded-lg px-3 bg-gray-50 h-9 focus-within:ring-2 focus-within:ring-brand-primary focus-within:border-transparent">
            <AiOutlineSearch className="text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-sm focus:outline-none px-2 w-40 xl:w-48"
              aria-label="Search"
            />
          </form>

          {/* Notifications */}
          <Link
            to="/business/orders"
            aria-label="Notifications"
            className="relative flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition text-gray-600"
          >
            <MdNotifications size={22} />
            {pendingOrders > 0 && (
              <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                {pendingOrders > 9 ? '9+' : pendingOrders}
              </span>
            )}
          </Link>

          {/* Help */}
          <button
            aria-label="Help"
            className="hidden lg:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition text-gray-600"
          >
            <MdHelpOutline size={22} />
          </button>

          {/* Store branding title — static, no dropdown */}
          <div
            className="hidden sm:flex flex-col items-end justify-center px-3 py-1.5 border-l border-gray-200 ml-1"
            aria-label="Store identity"
          >
            <p className="text-sm font-semibold text-gray-900 truncate max-w-[160px] lg:max-w-[220px]">
              {storeName}
            </p>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <FiCheckCircle className="text-brand-primary" size={12} />
              Verified Seller
            </span>
          </div>

          {/* Mobile-only compact branding */}
          <div className="sm:hidden flex flex-col items-end">
            <p className="text-xs font-semibold text-gray-900 truncate max-w-[80px]">
              {storeName}
            </p>
            <span className="flex items-center gap-0.5 text-[10px] text-gray-500">
              <FiCheckCircle className="text-brand-primary" size={10} />
              Verified
            </span>
          </div>

          {/* Logout — sidebar also has logout; header keeps a compact one for mobile reachability */}
          <button
            onClick={handleLogout}
            aria-label="Log out"
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-red-50 transition text-red-600"
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
    </header>
  );
};

export default SellerHeader;
