import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { logoutUser } from '@/store/slices/userThunks';
import { FiX } from 'react-icons/fi';
import {
  MdDashboard,
  MdWorkOutline,
  MdLocalShipping,
  MdInventory,
  MdPerson,
  MdLogout,
  MdLocationOn,
  MdHelpOutline,
} from 'react-icons/md';
import DELIVERY_NAV_ITEMS from './deliveryNavConfig';

const DRAWER_ICONS = {
  MdDashboard,
  MdWorkOutline,
  MdLocalShipping,
  MdInventory,
  MdWarning,
  MdPerson,
  MdLogout,
  MdLocationOn,
  MdHelpOutline,
};

const getNavIcon = (iconName) => DRAWER_ICONS[iconName];

const ProviderMobileDrawer = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const logoutHandler = async () => {
    try {
      const res = await dispatch(logoutUser());
      toast.success(res?.message || 'Logged out successfully');
      navigate('/delivery', { replace: true });
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
          className="fixed inset-0 bg-black/50"
          inert
          aria-hidden="true"
        />
      </div>

      {/* Drawer */}
      <div
        className="fixed top-0 left-0 z-50 h-full w-80 bg-white shadow-2xl lg:hidden flex flex-col transform transition-transform duration-300 ease-in-out"
        role="dialog"
        aria-label="Mobile navigation"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <p className="font-semibold text-gray-900 text-sm">Menu</p>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
            aria-label="Close menu"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 min-h-0 overflow-y-auto py-4">
          {DELIVERY_NAV_ITEMS.map((item, index) => {
            if (item.section) {
              return (
                <p key={index} className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 px-4 mb-2 mt-4">
                  {item.section}
                </p>
              );
            }

            if (item.type === 'logout') {
              return (
                <button
                  key={index}
                  onClick={() => {
                    logoutHandler();
                    onClose();
                  }}
                  className="mx-4 mt-2 flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-semibold border border-red-200 transition text-sm w-full text-left"
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
            const isActive =
              location.pathname === item.to ||
              (item.end && location.pathname === item.to);

            return (
              <NavLink
                key={item.to || index}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 mx-4 rounded-lg transition text-sm ${
                  isActive
                    ? 'bg-green-50 text-green-700 font-semibold border border-green-200'
                    : 'text-gray-700 hover:bg-gray-50 border border-transparent'
                }`}
              >
                {Icon && <Icon className="text-lg flex-shrink-0" />}
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            \u00a9 Aritii Market Provider Portal
          </p>
        </div>
      </div>
    </>
  );
};

export default ProviderMobileDrawer;
