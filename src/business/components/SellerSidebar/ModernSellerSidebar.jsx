import React, { useState, useMemo } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { SELLER_SIDEBAR } from '@/config/navigation';
import { getNavIcon } from '@/config/navIcons';
import { logoutUser } from '@/store/slices/userThunks';
import { useBusinessShops } from '@/business/hooks/useBusinessShops';
import { FiChevronDown } from 'react-icons/fi';

/**
 * ModernSellerSidebar - Unified navigation with collapsible sections
 *
 * Features:
 * - Collapsible sections (Dashboard, Catalog, Sales, Growth, Finance, Store, Settings)
 * - Shop switcher for multi-store support
 * - Full height layout
 * - Active link highlighting
 * - Section-based organization
 * - Dark mode support
 * - Controlled collapse state from parent (header button)
 * - Simplified, unified visual hierarchy
 */
const ModernSellerSidebar = ({ onClose, isCollapsed = false, className = '' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({
    'DASHBOARD': true,
    'CATALOG': true,
    'SALES': true,
  });
  const { shops, activeShop, activeShopId, selectShop } = useBusinessShops();

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
      navigate('/');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Logout failed');
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const isLinkActive = (to) => {
    return location.pathname === to || location.pathname.startsWith(to + '/');
  };

  return (
    <aside
      className={`relative flex flex-col h-full bg-white dark:bg-[#1a1f2a] border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-60'
      } ${className}`}
      aria-label="Business navigation"
    >
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {Object.entries(groupedNav).map(([section, items]) => (
          <div key={section}>
            {/* Section Header - Only if not collapsed, simplified styling */}
            {!isCollapsed && (
              <button
                onClick={() => toggleSection(section)}
                className="w-full flex items-center justify-between px-2 py-1.5 text-[10px] font-semibold text-gray-600 dark:text-gray-500 uppercase tracking-wider hover:text-gray-900 dark:hover:text-gray-400 transition-colors group mb-1"
              >
                <span>{section}</span>
                <FiChevronDown
                  size={12}
                  className={`transition-transform ${expandedSections[section] ? 'rotate-0' : '-rotate-90'}`}
                />
              </button>
            )}

            {/* Section Items - Compact and unified */}
            {(isCollapsed || expandedSections[section]) && (
              <div className="space-y-0.5">
                {items.map((item) => {
                  if (item.type === 'separator') {
                    return null; // Remove separators for unified look
                  }

                  if (item.type === 'logout') {
                    return (
                      <button
                        key="logout"
                        onClick={() => {
                          handleLogout();
                          onClose?.();
                        }}
                        className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
                      className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs font-medium transition-all group relative ${
                        active
                          ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                      }`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      {Icon && !isCollapsed && (
                        <Icon className="flex-shrink-0" size={16} />
                      )}
                      {!isCollapsed && (
                        <span className="flex-1">{item.label}</span>
                      )}
                      {isCollapsed && Icon && (
                        <Icon className="flex-shrink-0 mx-auto" size={18} />
                      )}

                      {/* Tooltip on collapsed state */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                          {item.label}
                        </div>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer - Seller Portal Branding */}
      <div className={`border-t border-gray-200 dark:border-gray-800 transition-all duration-300 ${
        isCollapsed ? 'px-2 py-4' : 'px-4 py-3'
      }`}>
        {isCollapsed ? (
          <div className="text-center text-[10px] text-gray-500 dark:text-gray-500 leading-tight">
            <p className="font-bold">Aritii</p>
            <p className="text-[9px]">Seller</p>
          </div>
        ) : (
          <div className="text-xs text-gray-600 dark:text-gray-400">
            <p className="font-semibold text-gray-900 dark:text-white">Aritii Market</p>
            <p className="text-[11px]">Seller Portal v1.0</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default ModernSellerSidebar;
