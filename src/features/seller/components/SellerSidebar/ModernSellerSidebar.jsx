import React, { useMemo } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { SELLER_SIDEBAR } from '@/app/config/navigation';
import { getNavIcon } from '@/app/config/navIcons';
import { logoutUser } from '@/store/slices/userThunks';

/**
 * ModernSellerSidebar - Unified navigation with clear, persistent sections
 *
 * Features:
 * - Persistent static sections (Dashboard, Catalog, Sales, Growth, Store, Finance & Account)
 * - Always-visible navigation items (no accidental collapsing)
 * - Full height layout with modern Aritii design system (#75d04b / dark surfaces)
 * - Active link highlighting
 * - Tooltip support on collapsed state
 */
const ModernSellerSidebar = ({ onClose, isCollapsed = false, className = '' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Group navigation items by section
  const groupedNav = useMemo(() => {
    const groups = {};
    let currentSection = null;

    SELLER_SIDEBAR.forEach((item) => {
      if (item.section) {
        currentSection = item.section;
        if (!groups[currentSection]) {
          groups[currentSection] = [];
        }
      } else if (item.type !== 'separator') {
        if (currentSection) {
          groups[currentSection].push(item);
        }
      }
    });

    return groups;
  }, []);

  const handleLogout = async () => {
    try {
      const res = await dispatch(logoutUser());
      toast.success(res?.message || 'Logged out successfully');
      navigate('/', { replace: true });
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Logout failed');
      navigate('/', { replace: true });
    }
  };

  const isLinkActive = (to) => {
    const path = to.split('?')[0];
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <aside
      className={`relative flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-60'
      } ${className}`}
      aria-label="Business navigation"
    >
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-2 no-scrollbar">
        {Object.entries(groupedNav).map(([section, items]) => (
          <div key={section} className="mb-2">
            {/* Static Section Header (No collapsing) */}
            {!isCollapsed && (
              <div className="px-2.5 pt-1.5 pb-1 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide select-none">
                {section}
              </div>
            )}

            {/* Section Items - Always visible */}
            <div className="space-y-0.5">
              {items.map((item) => {
                if (item.type === 'separator') {
                  return null;
                }

                if (item.type === 'logout') {
                  return (
                    <button
                      key="logout"
                      type="button"
                      onClick={() => {
                        handleLogout();
                        onClose?.();
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-semibold text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                      aria-label="Log out"
                    >
                      {!isCollapsed && <span>Log out</span>}
                    </button>
                  );
                }

                const Icon = getNavIcon(item.icon);
                const active = isLinkActive(item.to);

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={onClose}
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all group relative border ${
                      active
                        ? 'bg-[#f3ffee] dark:bg-[#75d04b]/15 text-[#75d04b] font-semibold border-[#75d04b]/30'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 border-transparent'
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    {Icon && (
                      <Icon
                        className={`flex-shrink-0 ${active ? 'text-[#75d04b]' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'} ${isCollapsed ? 'mx-auto' : ''}`}
                        size={16}
                      />
                    )}
                    {!isCollapsed && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}

                    {/* Tooltip on collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-2.5 py-1 bg-gray-900 dark:bg-gray-800 border border-gray-700 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                        {item.label}
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer - Aritii Seller Hub Branding */}
      <div className={`border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 transition-all duration-300 ${
        isCollapsed ? 'px-2 py-3 text-center' : 'px-4 py-3'
      }`}>
        {isCollapsed ? (
          <div className="text-center text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
            <p className="font-extrabold text-[#75d04b]">SH</p>
          </div>
        ) : (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              <span>Aritii</span>
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold uppercase">Seller Hub</span>
            </p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">Seller Management Console</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default ModernSellerSidebar;
