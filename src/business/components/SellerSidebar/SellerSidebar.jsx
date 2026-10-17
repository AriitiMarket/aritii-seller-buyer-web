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
      className={`relative flex flex-col h-full seller-sidebar ${isCollapsed ? 'seller-sidebar-collapsed' : ''} ${className}`}
      aria-label="Business navigation"
    >
      {/* Collapse button (desktop only) */}
      {!isCollapsed && (
        <button
          onClick={toggleCollapse}
          className="absolute top-6 right-2 w-6 h-6 rounded-lg bg-white dark:bg-[#1a1f2a] text-market-on-surface border border-market-border flex items-center justify-center shadow-sm hover:bg-market-surface-container-high hover:border-market-primary hover:shadow-level-2 hover:scale-110 active:scale-95 transition-all duration-200 z-10"
          aria-label="Collapse sidebar"
        >
          <FiChevronLeft size={14} />
        </button>
      )}

      {/* Shop switcher — one business may own multiple shops */}
      {!isCollapsed && shops.length > 0 && (
        <div className="px-3 pb-3 border-b border-market-border">
          <label
            htmlFor="sidebar-shop-switcher"
            className="mb-1 block text-xs font-semibold text-market-on-surface-variant uppercase tracking-wider"
          >
            Active shop
          </label>
          <select
            id="sidebar-shop-switcher"
            value={activeShopId || ''}
            onChange={(e) => selectShop(e.target.value)}
            className="w-full rounded-lg border border-market-border bg-white dark:bg-[#1a1f2a] px-2 py-2 text-sm font-medium text-market-on-surface focus:border-market-primary focus:outline-none"
            aria-label="Select active shop"
          >
            {shops.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name || 'Unnamed shop'}
              </option>
            ))}
          </select>
          {activeShop?.status && activeShop.status !== 'ACTIVE' && activeShop.status !== 'APPROVED' && (
            <p className="mt-1 text-[11px] text-amber-600 dark:text-amber-400">
              {activeShop.status === 'PENDING_APPROVAL' ? 'Pending approval' : activeShop.status}
            </p>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 min-h-0 space-y-1 px-3 py-6 overflow-y-auto">
        {SELLER_SIDEBAR.map((item, index) => {
          if (item.type === 'separator') {
            return <div key={index} className="border-t border-market-border my-3" />;
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
                onClick={() => { logoutHandler(); onClose?.(); }}
                className="mt-2 seller-sidebar-item text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold border border-transparent w-full text-left"
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
              className={`seller-sidebar-item ${isActive ? 'active' : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              {Icon && <Icon className="text-lg flex-shrink-0" />}
              {!isCollapsed && <span className="truncate">{item.label}</span>}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-[#1a1f2a] text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
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
