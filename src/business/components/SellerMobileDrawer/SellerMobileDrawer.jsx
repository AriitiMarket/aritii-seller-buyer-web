import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { SELLER_SIDEBAR } from '@/config/navigation';
import { getNavIcon } from '@/config/navIcons';
import { logoutUser } from '@/store/slices/userThunks';
import { FiX } from 'react-icons/fi';

const SellerMobileDrawer = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const logoutHandler = async () => {
    try {
      const res = await dispatch(logoutUser());
      toast.success(res?.message || 'Logged out successfully');
      navigate('/');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Logout failed');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 lg:hidden"
        onClick={onClose}
      >
        {/* Backdrop overlay — inert attribute prevents focus on main page */}
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          inert
          aria-hidden="true"
        />
      </div>

      {/* Drawer */}
      <div
        className="fixed inset-y-0 left-0 z-50 w-80 flex flex-col bg-white dark:bg-[#1a1f2a] shadow-xl border-r border-market-border lg:hidden transform transition-transform duration-300 ease-in-out"
        role="dialog"
        aria-label="Mobile navigation"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-market-border">
          <p className="font-semibold text-market-on-surface text-sm">Menu</p>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-market-on-surface-variant hover:text-market-primary hover:bg-market-surface-container-high transition-colors"
            aria-label="Close menu"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 min-h-0 overflow-y-auto py-4">
          {SELLER_SIDEBAR.map((item, index) => {
            if (item.type === 'separator') {
              return <div key={index} className="border-t border-market-border my-3 mx-4" />;
            }

            if (item.section) {
              return (
                <p key={index} className="seller-sidebar-section">
                  {item.section}
                </p>
              );
            }

            if (item.type === 'logout') {
              return (
                <button
                  key={index}
                  onClick={() => { logoutHandler(); onClose(); }}
                  className="mx-4 mt-2 seller-sidebar-item text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold border border-transparent w-full text-left"
                  aria-label="Log out"
                >
                  {(() => {
                    const Icon = getNavIcon('MdLogout');
                    return Icon ? <Icon className="text-lg flex-shrink-0" /> : null;
                  })()}
                  <span>Log out</span>
                </button>
              );
            }

            const Icon = getNavIcon(item.icon);
            const isActive = location.pathname === item.to || (item.end && location.pathname === item.to);

            return (
              <NavLink
                key={item.to || index}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={`seller-sidebar-item ${isActive ? 'active' : ''}`}
              >
                {Icon && <Icon className="text-lg flex-shrink-0" />}
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-market-border">
          <p className="text-xs text-market-on-surface-variant text-center">
            © Aritii Market Seller Portal
          </p>
        </div>
      </div>
    </>
  );
};

export default SellerMobileDrawer;
