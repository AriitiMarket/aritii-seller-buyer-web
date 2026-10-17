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
import { useProviderAvailability } from '../hooks/useProviderAvailability';

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
  const { isOnline, toggling, toggleAvailability: toggle } = useProviderAvailability();

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
      navigate('/delivery', { replace: true });
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleToggleAvailability = async () => {
    await toggle();
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
      'warnings': { title: 'Warnings & Support', path: '/provider/warnings' },
      'profile': { title: 'Profile & Settings', path: '/provider/profile' },
      'operating-area': { title: 'Operating Area', path: '/provider/operating-area' },
    };

    const lastSegment = pathSegments[pathSegments.length - 1];
    return pageMap[lastSegment] || { title: lastSegment, path: location.pathname };
  };

  const breadcrumb = getBreadcrumb();

  return (
    <header className="sticky top-0 z-40 bg-[#20305C] border-b border-white/15 shadow-sm flex-shrink-0 text-white">
      <div className="h-16 px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Side */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open provider menu"
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-white/90 hover:bg-white/10 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75d04b]"
          >
            <BiMenuAltRight size={24} />
          </button>

          {/* Logo */}
          <Link to="/provider" className="flex items-center gap-2 shrink-0">
            <BrandLogo size="sm" showText={false} showTagline={false} linked={false} tone="light" />
            <span className="hidden sm:inline-flex text-sm font-semibold text-[#75d04b]">
              Delivery Provider
            </span>
          </Link>

          {/* Breadcrumb */}
          <nav className="hidden md:flex items-center gap-2 text-sm min-w-0">
            <Link to="/provider" className="text-white/65 hover:text-white">
              Home
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-white font-medium truncate">{breadcrumb.title}</span>
          </nav>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center border border-white/20 rounded-lg px-3 bg-white/10 h-9 focus-within:ring-2 focus-within:ring-[#75d04b] focus-within:border-transparent">
            <AiOutlineSearch className="text-white/60" size={18} />
            <input
              type="text"
              placeholder="Search deliveries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-sm text-white placeholder:text-white/45 focus:outline-none px-2 w-40 xl:w-48"
              aria-label="Search deliveries"
            />
          </form>

          {/* Availability Toggle */}
          <button
            onClick={handleToggleAvailability}
            disabled={toggling}
            aria-label={isOnline ? "Set unavailable" : "Set available"}
            className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border transition ${
              isOnline
                ? 'border-[#75d04b]/50 bg-[#75d04b]/15 text-[#a3ed83] hover:bg-[#75d04b]/25'
                : 'border-white/20 bg-white/5 text-white/70 hover:bg-white/10'
            }`}
            title={isOnline ? "You're available for deliveries" : "You're currently unavailable"}
          >
            {isOnline ? <MdWifi size={18} /> : <MdWifiOff size={18} />}
            <span className="text-sm font-medium">{isOnline ? 'Available' : 'Unavailable'}</span>
          </button>

          {/* Notifications */}
          <Link
            to="/provider/warnings"
            aria-label="Notifications"
            className="relative flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/10 transition text-white/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75d04b]"
          >
            <MdNotifications size={22} />
          </Link>

          {/* Help */}
          <button
            aria-label="Help"
            className="hidden lg:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/10 transition text-white/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75d04b]"
          >
            <MdHelpOutline size={22} />
          </button>

          {/* Provider identity */}
          <div
            className="hidden sm:flex flex-col items-end justify-center px-3 py-1.5 border-l border-white/20 ml-1"
            aria-label="Provider identity"
          >
            <p className="text-sm font-semibold text-white truncate max-w-[160px] lg:max-w-[220px]">
              {providerName}
            </p>
            <span className="flex items-center gap-1 text-xs text-white/65">
              <FiCheckCircle className="text-[#75d04b]" size={12} />
              Verified Provider
            </span>
          </div>

          {/* Mobile-only compact branding */}
          <div className="sm:hidden flex flex-col items-end">
            <p className="text-xs font-semibold text-white truncate max-w-[80px]">
              {providerName}
            </p>
            <span className="flex items-center gap-0.5 text-[10px] text-white/65">
              <FiCheckCircle className="text-[#75d04b]" size={10} />
              Verified
            </span>
          </div>

          {/* Role chooser — lets a provider who is also a seller (or buyer) switch */}
          <RoleSwitcher tone="light" />

          <Link
            to="/marketplace"
            className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/10 transition-all duration-200 text-white/90"
            aria-label="Marketplace"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 21 10 21" />
            </svg>
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            aria-label="Log out"
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/10 transition text-red-300 hover:text-red-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
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
