import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { logoutUser } from '@/store/slices/userThunks';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
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

const SIDEBAR_ICONS = {
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

const getNavIcon = (iconName) => SIDEBAR_ICONS[iconName];

const ProviderSidebar = ({ onClose, className = '' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await dispatch(logoutUser());
      toast.success(res?.message || 'Logged out successfully');
      navigate('/delivery', { replace: true });
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Logout failed');
    }
  };

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <aside
      className={`relative flex flex-col h-full bg-[#141414] text-white border-r border-white/15 transition-all duration-300 ${
        isCollapsed ? 'w-[68px]' : 'w-[240px]'
      } ${className}`}
      aria-label="Provider navigation"
    >
      {/* Collapse Button */}
      <button
        onClick={toggleCollapse}
        className="absolute -right-3 top-6 w-6 h-6 bg-[#141414] text-white border border-white/30 rounded-full flex items-center justify-center shadow-sm hover:bg-white/15 hover:shadow-md transition z-10"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <FiChevronRight size={14} /> : <FiChevronLeft size={14} />}
      </button>

      {/* Navigation — only this list scrolls if it overflows; the sidebar shell stays fixed */}
      <div className="flex-1 min-h-0 space-y-1 px-3 py-6 overflow-y-auto">
        {DELIVERY_NAV_ITEMS.map((item, index) => {
          if (item.section) {
            return (
              <p key={index} className="text-[10px] font-bold uppercase tracking-wider text-white/55 px-2 mb-2 mt-4">
                {isCollapsed ? '' : item.section}
              </p>
            );
          }

          if (item.type === 'logout') {
            return (
              <button
                key={index}
                onClick={() => {
                  logoutHandler();
                  onClose?.();
                }}
                className="mt-2 flex items-center gap-3 px-3 py-2.5 rounded-lg bg-red-500/15 text-red-100 hover:bg-red-500/25 font-semibold border border-red-300/20 transition text-sm w-full text-left"
                aria-label="Log out"
              >
                {(() => {
                  const Icon = getNavIcon('MdLogout');
                  return Icon ? <Icon className="text-lg flex-shrink-0" /> : null;
                })()}
                {!isCollapsed && <span className="truncate">Log out</span>}
              </button>
            );
          }

          const Icon = getNavIcon(item.icon);
          const isActive =
            location.pathname === item.to || (item.end && location.pathname === item.to);

          return (
            <NavLink
              key={item.to || index}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-sm relative group ${
                isActive
                  ? 'bg-white/15 text-white font-semibold border-l-2 border-[#75d04b]'
                  : 'text-white/80 hover:bg-white/10 hover:text-white border-l-2 border-transparent'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              {Icon && <Icon className="text-lg flex-shrink-0" />}
              {!isCollapsed && <span className="truncate">{item.label}</span>}

              {/* Tooltip for collapsed mode */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
                  {item.label}
                </div>
              )}
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};

export default ProviderSidebar;
