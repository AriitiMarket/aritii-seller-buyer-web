import React, { useState } from "react";
import BrandLogo from '@/components/common/BrandLogo';
import { MdNotifications, MdHelpOutline, MdWifi, MdWifiOff } from 'react-icons/md';
import { AiOutlineSearch } from 'react-icons/ai';
import { BiMenuAltRight } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from '@/store/slices/userThunks';
import { FiCheckCircle } from 'react-icons/fi';
import RoleSwitcher from '@/shared/components/RoleSwitcher';

/**
 * ProviderHeader — top bar for the delivery provider workspace.
 *
 * Left:  hamburger (mobile) + logo + breadcrumb
 * Center/right: search, notifications, help, availability toggle
 * Far right: provider identity (name + verified provider badge)
 */
const ProviderHeader = ({ onMenuClick }) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  const providerName = user?.name || user?.fullName || 'Provider';

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (q) {
      navigate(`/provider/deliveries?search=${encodeURIComponent(q)}`);
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

  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
    // TODO: Update availability via API
  };

  // Generate breadcrumb from current path
  const getBreadcrumb = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.length === 0 || pathSegments[0] === 'provider') {
      return { title: 'Overview', path: '/provider' };
    }

    const pageMap = {
      'dashboard': { title: 'Overview', path: '/provider' },
      'available-work': { title: 'Available Work', path: '/provider/available-work' },
      'deliveries': { title: 'My Deliveries', path: '/provider/deliveries' },
      'batches': { title: 'Batches', path: '/provider/batches' },
      'warnings': { title: 'Warnings', path: '/provider/warnings' },
      'profile': { title: 'Profile', path: '/provider/profile' },
    };

    const lastSegment = pathSegments[pathSegments.length - 1];
    return pageMap[lastSegment] || { title: lastSegment, path: location.pathname };
  };

  const breadcrumb = getBreadcrumb();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
      <div className="h-16 px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Side */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open provider menu"
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
          >
            <BiMenuAltRight size={24} />
          </button>

          {/* Logo */}
          <Link to="/provider" className="flex items-center gap-2 shrink-0">
            <BrandLogo className="h-8 w-auto" linked={false} />
            <span className="hidden sm:inline-flex text-sm font-semibold text-[#75d04b]">
              Provider Portal
            </span>
          </Link>

          {/* Breadcrumb */}
          <nav className="hidden md:flex items-center gap-2 text-sm min-w-0">
            <Link to="/provider" className="text-gray-500 hover:text-gray-900">
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium truncate">{breadcrumb.title}</span>
          </nav>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center border border-gray-200 rounded-lg px-3 bg-gray-50 h-9 focus-within:ring-2 focus-within:ring-[#75d04b] focus-within:border-transparent">
            <AiOutlineSearch className="text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search deliveries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-sm focus:outline-none px-2 w-40 xl:w-48"
              aria-label="Search deliveries"
            />
          </form>

          {/* Availability Toggle */}
          <button
            onClick={toggleAvailability}
            aria-label={isAvailable ? "Set unavailable" : "Set available"}
            className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border transition ${
              isAvailable 
                ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100' 
                : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
            title={isAvailable ? "You're available for deliveries" : "You're currently unavailable"}
          >
            {isAvailable ? <MdWifi size={18} /> : <MdWifiOff size={18} />}
            <span className="text-sm font-medium">{isAvailable ? 'Available' : 'Unavailable'}</span>
          </button>

          {/* Notifications */}
          <Link
            to="/provider/warnings"
            aria-label="Notifications"
            className="relative flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition text-gray-600"
          >
            <MdNotifications size={22} />
          </Link>

          {/* Help */}
          <button
            aria-label="Help"
            className="hidden lg:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition text-gray-600"
          >
            <MdHelpOutline size={22} />
          </button>

          {/* Provider identity */}
          <div
            className="hidden sm:flex flex-col items-end justify-center px-3 py-1.5 border-l border-gray-200 ml-1"
            aria-label="Provider identity"
          >
            <p className="text-sm font-semibold text-gray-900 truncate max-w-[160px] lg:max-w-[220px]">
              {providerName}
            </p>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <FiCheckCircle className="text-[#75d04b]" size={12} />
              Verified Provider
            </span>
          </div>

          {/* Mobile-only compact branding */}
          <div className="sm:hidden flex flex-col items-end">
            <p className="text-xs font-semibold text-gray-900 truncate max-w-[80px]">
              {providerName}
            </p>
            <span className="flex items-center gap-0.5 text-[10px] text-gray-500">
              <FiCheckCircle className="text-[#75d04b]" size={10} />
              Verified
            </span>
          </div>

          {/* Role chooser — lets a provider who is also a seller (or buyer) switch */}
          <RoleSwitcher />

          {/* Logout */}
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

export default ProviderHeader;
