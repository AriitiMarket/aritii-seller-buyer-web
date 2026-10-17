import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineMenu, AiOutlineClose, AiOutlineShoppingCart, AiOutlineUser, AiOutlineHeart } from 'react-icons/ai';
import { MdLocalShipping, MdLocationOn, MdHelpOutline, MdArrowDropDown } from 'react-icons/md';
import BrandLogo from '@/components/common/BrandLogo';
import HeaderSearch from '@/shared/components/header/HeaderSearch';
import { useAuth } from '@/auth/hooks/useAuth';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '@/store/slices/userThunks';
import { toast } from 'react-toastify';
import { useDeliveryLocation } from '@/shared/hooks/useDeliveryLocation';
import { locationService } from '@/services';

/**
 * BuyerHeader — the public-shop-style bar for the buyer account shell.
 *
 * Design standard (shopping-app UX, Aritii-branded — original assets/copy):
 *  - near-black header bar #131921, bottom border #232f3e, sticky top-0 z-[70]
 *  - wordmark logo on the left
 *  - prominent centered search with autocomplete
 *  - "Account & Lists" opens on hover (same UX as the public marketplace header)
 *  - cart with brand-green badge
 *  - a sticky 64px rail, never a floating pill
 */

const ACCOUNT_ITEMS = isAuthenticated => [
  { label: 'Your Orders', to: '/my-dashboard/orders', icon: MdLocalShipping },
  { label: 'Saved Items', to: '/my-dashboard/wishlist', icon: AiOutlineHeart },
  { label: 'Your Addresses', to: '/my-dashboard/addresses', icon: MdLocationOn },
  { label: 'Messages', to: '/my-dashboard/requests', icon: MdHelpOutline },
  { label: 'Settings', to: '/my-dashboard/settings', icon: AiOutlineUser },
  { type: 'separator' },
  { label: 'Sign Out', onClick: null, icon: AiOutlineUser },
];

const BuyerHeader = ({ onMenuClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const { cart } = useSelector((state) => state.cart || {});
  const cartItemCount = cart ? cart.reduce((total, item) => total + Number(item.quantity ?? 1), 0) : 0;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    if (profileOpen) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [profileOpen]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      toast.success('You have been signed out.');
      setProfileOpen(false);
      setMobileMenuOpen(false);
      navigate('/');
    } catch (err) {
      toast.error('Failed to sign out');
    }
  };

  const accountItems = isAuthenticated
    ? ACCOUNT_ITEMS(isAuthenticated)
    : [
        { label: 'Sign In', to: '/login', icon: AiOutlineUser },
        { label: 'Create Account', to: '/sign-up', icon: AiOutlineUser, primary: true },
      ];

  const { cityName, zoneName, setLocation, clearLocation, isSelected } =
    useDeliveryLocation();

  const [locationOpen, setLocationOpen] = useState(false);
  const [zones, setZones] = useState([]);

  // Load zones for the location selector when opened
  const loadZones = async () => {
    try {
      const zoneList = await locationService.listZones();
      setZones(zoneList);
    } catch {
      setZones([]);
    }
  };

  const handleSelectZone = (zone) => {
    setLocation({
      cityId: zone.cityId || null,
      cityName: zone.cityName || zone.name || '',
      zoneId: zone._id || zone.id,
      zoneName: zone.name || '',
    });
    setLocationOpen(false);
    toast.success(`Delivery zone set to ${zone.name}`);
  };

  const currentLocationLabel = isSelected
    ? `${cityName || ''}${zoneName ? ` • ${zoneName}` : ''}`
    : 'Select delivery zone';

  return (
    <>
      {/* ===== Main header — dark, border-bottom rail ===== */}
      <header
        className="sticky top-0 z-[70] w-full border-b border-[#232f3e] bg-[#131921]"
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-2">
            {/* Left: logo + wordmark */}
            <Link
              to="/my-dashboard"
              className="flex items-center gap-2 flex-shrink-0 rounded-lg p-1 transition-colors hover:bg-[#232f3e]"
              aria-label="Aritii Market home"
            >
              <BrandLogo size="md" showText showTagline={false} linked={false} tone="light" />
            </Link>

            {/* Center: search — the dominant element */}
            <div className="flex-1 max-w-2xl">
              <HeaderSearch
                dark
                variant="inline"
                destination={(term) => `/products?search=${encodeURIComponent(term)}`}
                placeholder="Search products, shops…"
                ariaLabel="Search products and shops"
                categories={[]}
                className="w-full"
              />
            </div>

            {/* Right: account & lists · cart · menu */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Delivery zone selector */}
              <div className="relative group">
                <button
                  type="button"
                  onClick={() => {
                    setLocationOpen(!locationOpen);
                    if (!locationOpen) loadZones();
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-white transition-colors hover:bg-[#232f3e] rounded-md border border-transparent hover:border-[#232f3e]/30"
                  aria-label="Select delivery zone"
                  aria-haspopup="listbox"
                  aria-expanded={locationOpen}
                >
                  <MdLocationOn size={18} />
                  <span className="text-xs font-medium text-white">
                    {currentLocationLabel}
                  </span>
                  <MdArrowDropDown size={16} />
                </button>
                {locationOpen && (
                  <div
                    className="absolute right-0 top-full mt-1 z-[80] w-80 rounded-md border border-[#232f3e] bg-[#1a1a1a] p-2 shadow-lg text-sm"
                    role="listbox"
                  >
                    {zones.length === 0 ? (
                      <div className="px-3 py-2 text-[#9aa6b2] text-xs">
                        No delivery zones available
                      </div>
                    ) : (
                      <div className="max-h-60 overflow-y-auto">
                        {zones.map((zone) => (
                          <button
                            key={zone._id || zone.id}
                            type="button"
                            onClick={() => handleSelectZone(zone)}
                            role="option"
                            className="w-full flex items-center gap-2 px-3 py-2 text-[#9aa6b2] transition-colors hover:bg-[#232f3e] hover:text-white rounded-lg"
                          >
                            {zone.name}
                            {zone.cityName && (
                              <span className="text-[10px] text-[#6b7280] ml-auto">
                                {zone.cityName}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="border-t border-[#232f3e]/30 mt-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          clearLocation();
                          setLocationOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-[#de7921] hover:text-[#f0a851] text-xs rounded-lg"
                      >
                        Clear location
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {isSelected && (
                <button
                  type="button"
                  onClick={() => {
                    clearLocation();
                    toast.success('Delivery zone cleared');
                  }}
                  className="flex items-center gap-1.5 px-2 py-1.5 text-[#9aa6b2] hover:text-white transition-colors hover:bg-[#232f3e] rounded-md"
                  aria-label="Clear delivery zone"
                >
                  <span className="text-xs">Clear zone</span>
                </button>
              )}
              {/* Account & Lists — opens on hover */}
              <div
                className="relative"
                ref={profileRef}
                onMouseEnter={() => setProfileOpen(true)}
                onMouseLeave={() => setProfileOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setProfileOpen(true)}
                  className="flex items-center gap-1.5 px-2 py-1.5 text-white transition-colors hover:bg-[#232f3e] rounded-md"
                  aria-expanded={profileOpen}
                  aria-haspopup="listbox"
                  aria-label="Account & Lists"
                >
                  <span className="text-[11px] font-medium text-[#9aa6b2] uppercase tracking-wider">
                    Account & Lists
                  </span>
                  {isAuthenticated && (
                    <span className="text-body-sm font-medium text-white truncate max-w-[140px]">
                      {user?.name || 'Account'}
                    </span>
                  )}
                  <AiOutlineUser size={14} className="text-[#9aa6b2]" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-1 z-[80] w-64 rounded-md border border-[#232f3e] bg-[#1a1a1a] p-1.5 shadow-lg">
                    <div className="py-1">
                      {accountItems.map((item, index) => (
                        <React.Fragment key={item.label + index}>
                          {item.type === 'separator' ? (
                            <div className="h-px bg-[#232f3e] my-2" />
                          ) : item.onClick ? (
                            <button
                              type="button"
                              onClick={() => {
                                item.onClick();
                                setProfileOpen(false);
                                setMobileMenuOpen(false);
                              }}
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

      {/* ===== Mobile menu ===== */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[65] bg-black/50"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        >
          <div className="fixed inset-y-0 left-0 z-[70] w-72 rounded-r-xl border border-[#232f3e] bg-[#131921] shadow-level-3">
            <div className="flex items-center justify-between border-b border-[#232f3e] p-4">
              <h2 className="text-base font-bold text-white">Account</h2>
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
              {/* Account navigation */}
              <div className="border-b border-[#232f3e] pb-4">
                <Link
                  to="/my-dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={"block w-full px-3 py-2.5 rounded-lg transition-colors " + (location.pathname === '/my-dashboard' ? 'bg-[#232f3e] text-white font-semibold' : 'text-[#c9d1d9] hover:bg-[#232f3e]')}
                >
                  Dashboard
                </Link>
                <Link
                  to="/my-dashboard/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className={"block w-full px-3 py-2.5 rounded-lg transition-colors " + (location.pathname === '/my-dashboard/orders' ? 'bg-[#232f3e] text-white font-semibold' : 'text-[#c9d1d9] hover:bg-[#232f3e]')}
                >
                  Orders
                </Link>
                <Link
                  to="/my-dashboard/requests"
                  onClick={() => setMobileMenuOpen(false)}
                  className={"block w-full px-3 py-2.5 rounded-lg transition-colors " + (location.pathname === '/my-dashboard/requests' ? 'bg-[#232f3e] text-white font-semibold' : 'text-[#c9d1d9] hover:bg-[#232f3e]')}
                >
                  Messages
                </Link>
              </div>

              <div className="pt-4 border-t border-[#232f3e]">
                <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-[#9aa6b2]">Account</p>
                <Link
                  to="/my-dashboard/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={"flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors text-[#c9d1d9] hover:bg-[#232f3e] " + (location.pathname === '/my-dashboard/profile' ? 'bg-[#232f3e] text-white font-semibold' : '')}
                >
                  <AiOutlineUser size={16} />
                  Profile
                </Link>
                <Link
                  to="/my-dashboard/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className={"flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors text-[#c9d1d9] hover:bg-[#232f3e] " + (location.pathname === '/my-dashboard/wishlist' ? 'bg-[#232f3e] text-white font-semibold' : '')}
                >
                  <AiOutlineHeart size={16} />
                  Wishlist
                </Link>
                <Link
                  to="/my-dashboard/addresses"
                  onClick={() => setMobileMenuOpen(false)}
                  className={"flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors text-[#c9d1d9] hover:bg-[#232f3e] " + (location.pathname === '/my-dashboard/addresses' ? 'bg-[#232f3e] text-white font-semibold' : '')}
                >
                  <MdLocationOn size={16} />
                  Addresses
                </Link>
                <Link
                  to="/my-dashboard/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className={"flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors text-[#c9d1d9] hover:bg-[#232f3e] " + (location.pathname === '/my-dashboard/settings' ? 'bg-[#232f3e] text-white font-semibold' : '')}
                >
                  <MdHelpOutline size={16} />
                  Settings
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-[#c9d1d9] transition-colors hover:bg-[#232f3e]"
                >
                  <AiOutlineUser size={16} />
                  Sign Out
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default BuyerHeader;
