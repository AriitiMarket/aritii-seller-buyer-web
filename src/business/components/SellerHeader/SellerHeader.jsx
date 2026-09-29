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
import RoleSwitcher from '@/shared/components/RoleSwitcher';

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
    <header className="sticky top-0 z-40 bg-[#20305c] text-white border-b border-white/15 shadow-[0_4px_18px_rgba(15,23,42,0.16)] flex-shrink-0 transition-shadow duration-300">
      <div className="h-16 px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Side */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open seller menu"
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl text-white hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <BiMenuAltRight size={24} />
          </button>

          {/* Logo */}
          <Link to="/business" className="flex items-center gap-2 shrink-0 transition-transform duration-200 hover:-translate-y-0.5">
            <BrandLogo className="h-8 w-auto" linked={false} tone="light" />
            <span className="hidden sm:inline-flex text-sm font-semibold text-white">
              Seller Portal
            </span>
          </Link>

          {/* Breadcrumb */}
          <nav className="hidden md:flex items-center gap-2 text-sm min-w-0">
            <Link to="/business" className="text-white/70 hover:text-white transition-colors duration-200">
              Home
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-white font-medium truncate">{breadcrumb.title}</span>
          </nav>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center border border-white/20 rounded-xl px-3 bg-[#141414]/90 h-10 focus-within:ring-2 focus-within:ring-[#75d04b]/70 focus-within:border-transparent focus-within:shadow-[0_0_0_4px_rgba(117,208,75,0.12)] transition-all duration-200">
            <AiOutlineSearch className="text-white/65" size={18} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-sm text-white placeholder-white/50 focus:outline-none px-2 w-40 xl:w-48"
              aria-label="Search"
            />
          </form>

          {/* Notifications */}
          <Link
            to="/business/orders"
            aria-label="Notifications"
            className="relative flex items-center justify-center w-10 h-10 rounded-xl hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-200 text-white/90"
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
            className="hidden lg:flex items-center justify-center w-10 h-10 rounded-xl hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-200 text-white/90"
          >
            <MdHelpOutline size={22} />
          </button>

          {/* Store branding title — static, no dropdown */}
          <div
            className="hidden sm:flex flex-col items-end justify-center px-3 py-1.5 border-l border-white/20 ml-1"
            aria-label="Store identity"
          >
            <p className="text-sm font-semibold text-white truncate max-w-[160px] lg:max-w-[220px]">
              {storeName}
            </p>
            <span className="flex items-center gap-1 text-xs text-white/70">
              <FiCheckCircle className="text-[#75d04b]" size={12} />
              Verified Seller
            </span>
          </div>

          {/* Mobile-only compact branding */}
          <div className="sm:hidden flex flex-col items-end">
            <p className="text-xs font-semibold text-white truncate max-w-[80px]">
              {storeName}
            </p>
            <span className="flex items-center gap-0.5 text-[10px] text-white/70">
              <FiCheckCircle className="text-[#75d04b]" size={10} />
              Verified
            </span>
          </div>

          {/* Role chooser — lets a seller who is also a provider (or buyer) switch */}
          <RoleSwitcher />

          {/* Logout — sidebar also has logout; header keeps a compact one for mobile reachability */}
          <button
            onClick={handleLogout}
            aria-label="Log out"
            className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-red-500/20 hover:scale-105 active:scale-95 transition-all duration-200 text-red-100"
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
