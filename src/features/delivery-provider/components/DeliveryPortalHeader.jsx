import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdLocalShipping, MdHelpOutline } from 'react-icons/md';
import { AiOutlineMenu, AiOutlineUser } from 'react-icons/ai';
import BrandLogo from '@/components/common/BrandLogo';
import { useAuth } from '@/auth/hooks/useAuth';
import { useDispatch } from 'react-redux';
import { logoutUser } from '@/store/slices/userThunks';
import { toast } from 'react-toastify';

const DELIVERY_NAV = [
  { label: 'Overview', to: '/delivery', hash: 'overview' },
  { label: 'How It Works', to: '/delivery', hash: 'how-it-works' },
  { label: 'Services', to: '/delivery', hash: 'services' },
  { label: 'Operating Areas', to: '/delivery', hash: 'operating-areas' },
  { label: 'Help & Support', to: '/delivery', hash: 'help' },
];

const DeliveryPortalHeader = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const providerCapability =
    user?.capabilities?.includes('PROVIDER') || user?.role === 'PROVIDER';

  useEffect(() => {
    if (!loading && isAuthenticated && providerCapability) {
      navigate('/provider', { replace: true });
    }
  }, [loading, isAuthenticated, providerCapability, navigate]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      navigate('/delivery', { replace: true });
      toast.success('Logged out successfully');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  const isActive = (to) => {
    const path = location.pathname;
    const base = to.split('#')[0];
    return path === base || path.startsWith(base + '/');
  };
  const accountItems = (
    <>
      <div className="px-4 py-2 text-[11px] uppercase tracking-wider text-gray-400">
        Account
      </div>
      {isAuthenticated ? (
        <>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-red-700 hover:bg-red-50 transition"
          >
            <AiOutlineUser size={18} />
            Sign out
          </button>
          {providerCapability && (
            <Link
              to="/provider"
              onClick={() => setAccountOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-[#2563eb] hover:bg-blue-50 transition"
            >
              <MdLocalShipping size={18} />
              Go to Delivery Workspace
            </Link>
          )}
        </>
      ) : (
        <>
          <Link
            to="/login"
            onClick={() => setAccountOpen(false)}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            <AiOutlineUser size={18} />
            Sign in
          </Link>
          <Link
            to="/delivery-sign-up"
            onClick={() => setAccountOpen(false)}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-white bg-[#2563eb] hover:bg-[#1d4ed8] transition"
          >
            Register as delivery provider
          </Link>
        </>
      )}
      <div className="border-t border-gray-100 pt-4">
        <p className="px-4 py-2 text-[11px] uppercase tracking-wider text-gray-400">
          Not available yet
        </p>
        <p className="px-4 pb-2 text-xs text-gray-500">
          Earnings and payment summaries appear here once your provider account
          is active. Payments are in Ethiopian Birr (ETB).
        </p>
      </div>
    </>
  );

  if (loading) return null;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm flex-shrink-0" aria-label="Delivery portal header">
      <div className="h-16 px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Open menu"
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-700 hover:bg-gray-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]"
          >
            <AiOutlineMenu size={24} />
          </button>
          <Link to="/delivery" className="flex items-center gap-2 sm:gap-3" onClick={() => setMobileOpen(false)}>
            <BrandLogo size="sm" showText showTagline={false} linked={false} tone="default" />
            <span className="font-bold text-gray-900 text-sm sm:text-base tracking-tight">Delivery Portal</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-sm font-medium" aria-label="Main delivery navigation">
          {DELIVERY_NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to + (item.hash || '')}
              onClick={() => setMobileOpen(false)}
              className={`px-3 py-2.5 rounded-lg transition-colors ${
                isActive(item.to)
                  ? 'bg-[#2563eb]/10 text-[#2563eb] font-semibold border border-[#2563eb]/20'
                  : 'text-gray-600 hover:text-[#2563eb] hover:bg-gray-50'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3 ml-auto">
          <Link
            to="/delivery#help"
            aria-label="Help & support"
            className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:text-[#2563eb] hover:bg-gray-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]"
          >
            <MdHelpOutline size={20} />
          </Link>
          <button
            onClick={() => setAccountOpen(!accountOpen)}
            aria-label="Account menu"
            aria-expanded={accountOpen}
            className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-700 hover:text-[#2563eb] hover:bg-gray-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]"
          >
            <AiOutlineUser size={20} />
          </button>
        </div>
        <div className="md:hidden flex items-center gap-2">
          <Link
            to="/delivery#help"
            aria-label="Help & support"
            className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:text-[#2563eb] hover:bg-gray-50 transition"
          >
            <MdHelpOutline size={20} />
          </Link>
          <button
            onClick={() => setAccountOpen(!accountOpen)}
            aria-label="Account menu"
            className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-700 hover:text-[#2563eb] hover:bg-gray-50 transition"
          >
            <AiOutlineUser size={20} />
          </button>
        </div>
      </div>

      {accountOpen && !mobileOpen && (
        <div className="absolute right-0 mt-16 w-72 bg-white rounded-xl border border-gray-200 shadow-lg z-50">
          {accountItems}
        </div>
      )}
      <DeliveryPortalMobileDrawer
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        accountOpen={accountOpen}
        setAccountOpen={setAccountOpen}
        accountItems={accountItems}
      />
    </header>
  );
};

const DeliveryPortalMobileDrawer = ({
  isOpen,
  onClose,
  accountOpen,
  setAccountOpen,
  accountItems,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed inset-y-0 left-0 z-50 w-full md:w-[75%] max-w-md bg-white shadow-2xl md:hidden flex flex-col transform transition-transform duration-300 ease-in-out"
        style={{ transform: isOpen ? 'translateX(0)' : 'translateX(-100%)' }}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <p className="font-semibold text-gray-900 text-sm">Menu</p>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
            aria-label="Close menu"
          >
            <span className="text-gray-600">✕</span>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
          <p className="px-4 mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Delivery
          </p>
          {DELIVERY_NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to + (item.hash || '')}
              onClick={onClose}
              className="block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.to)
                  ? 'bg-[#2563eb]/10 text-[#2563eb] font-semibold border border-[#2563eb]/20'
                  : 'text-gray-600 hover:text-[#2563eb] hover:bg-gray-50'
              }"
            >
              {item.label}
            </Link>
          ))}
          <p className="px-4 mt-4 mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Account
          </p>
          {accountItems}
        </nav>
      </div>
    </>
  );
};

export default DeliveryPortalHeader;

