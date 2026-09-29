import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { SELLER_SIDEBAR } from '@/config/navigation';
import { getNavIcon } from '@/config/navIcons';
import { logoutUser } from '@/store/slices/userThunks';
import { useBusinessShops } from '@/business/hooks/useBusinessShops';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const SellerSidebar = ({ onClose, className = '' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { shops, activeShop, activeShopId, hasMultipleShops, selectShop } = useBusinessShops();

  const logoutHandler = async () => {
    try {
      const res = await dispatch(logoutUser());
      toast.success(res?.message || 'Logged out successfully');
      navigate('/');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Logout failed');
    }
  };

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <aside
      className={`relative flex flex-col h-full bg-[#141414] text-white border-r border-white/15 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      } ${className}`}
      aria-label="Business navigation"
    >
      {/* Collapse Button */}
      <button
        onClick={toggleCollapse}
        className="absolute -right-3 top-6 w-6 h-6 bg-[#141414] text-white border border-white/30 rounded-full flex items-center justify-center shadow-sm hover:bg-[#20305c] hover:border-[#75d04b] hover:shadow-[0_0_0_4px_rgba(117,208,75,0.12)] hover:scale-110 active:scale-95 transition-all duration-200 z-10"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <FiChevronRight size={14} /> : <FiChevronLeft size={14} />}
      </button>

      {/* Shop switcher — one business may own multiple shops */}
      {!isCollapsed && shops.length > 0 && (
        <div className="px-3 pb-3 border-b border-white/15">
          <label
            htmlFor="sidebar-shop-switcher"
            className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-white/60"
          >
            Active shop
          </label>
          <select
            id="sidebar-shop-switcher"
            value={activeShopId || ''}
            onChange={(e) => selectShop(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-sm font-medium text-gray-900 focus:border-brand-primary focus:outline-none"
            aria-label="Select active shop"
          >
            {shops.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name || 'Unnamed shop'}
              </option>
            ))}
          </select>
          {activeShop?.status && activeShop.status !== 'ACTIVE' && activeShop.status !== 'APPROVED' && (
            <p className="mt-1 text-[11px] text-amber-600">
              {activeShop.status === 'PENDING_APPROVAL' ? 'Pending approval' : activeShop.status}
            </p>
          )}
        </div>
      )}

      {/* Navigation — only this list scrolls if it overflows; the sidebar shell stays fixed */}
      <div className="flex-1 min-h-0 space-y-1 px-3 py-6 overflow-y-auto">
        {SELLER_SIDEBAR.map((item, index) => {
          if (item.type === 'separator') {
            return <div key={index} className="border-t border-white/15 my-3" />;
          }

          if (item.section) {
            return (
              <p key={index} className="text-[10px] font-semibold uppercase tracking-wider text-white/55 px-2 mb-2 mt-4">
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
                className="mt-2 flex items-center gap-3 px-3 py-2.5 rounded-lg bg-red-500/15 text-red-100 hover:bg-red-500/25 hover:translate-x-0.5 font-semibold border border-red-300/20 transition-all duration-200 text-sm w-full text-left"
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
          const isActive = location.pathname === item.to || (item.end && location.pathname === item.to);

          return (
            <NavLink
              key={item.to || index}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:translate-x-0.5 text-sm relative group ${
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

export default SellerSidebar;
