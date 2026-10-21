import React, { useState, useMemo } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { SELLER_SIDEBAR } from '@/config/navigation';
import { getNavIcon } from '@/config/navIcons';
import { logoutUser } from '@/store/slices/userThunks';
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
    'FINANCE': true,
    'SETTINGS': true,
  });

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
    const path = to.split('?')[0];
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <aside
      className={`relative flex flex-col h-full bg-[#131921] border-r border-[#232f3e] text-white transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-60'
      } ${className}`}
      aria-label="Business navigation"
    >
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1 no-scrollbar">
        {Object.entries(groupedNav).map(([section, items]) => (
          <div key={section} className="mb-2">
            {/* Section Header */}
            {!isCollapsed && (
              <button
                onClick={() => toggleSection(section)}
                className="w-full flex items-center justify-between px-2.5 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider hover:text-white transition-colors group mb-1"
              >
                <span>{section}</span>
                <FiChevronDown
                  size={12}
                  className={`text-gray-400 group-hover:text-white transition-transform ${expandedSections[section] ? 'rotate-0' : '-rotate-90'}`}
                />
              </button>
            )}

            {/* Section Items */}
            {(isCollapsed || expandedSections[section]) && (
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
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-semibold text-red-400 rounded hover:bg-[#232f3e] hover:text-red-300 transition-colors"
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
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded text-xs font-medium transition-all group relative ${
                        active
                          ? 'bg-[#232f3e] text-[#febd69] font-bold border-l-2 border-[#febd69]'
                          : 'text-gray-300 hover:bg-[#232f3e]/60 hover:text-white'
                      }`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      {Icon && (
                        <Icon
                          className={`flex-shrink-0 ${active ? 'text-[#febd69]' : 'text-gray-400 group-hover:text-white'} ${isCollapsed ? 'mx-auto' : ''}`}
                          size={16}
                        />
                      )}
                      {!isCollapsed && (
                        <span className="flex-1 truncate">{item.label}</span>
                      )}

                      {/* Tooltip on collapsed state */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-2 px-2.5 py-1 bg-[#1a222d] border border-[#232f3e] text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
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

      {/* Footer - Amazon Seller Central Branding */}
      <div className={`border-t border-[#232f3e] bg-[#0c1015] transition-all duration-300 ${
        isCollapsed ? 'px-2 py-3 text-center' : 'px-4 py-3'
      }`}>
        {isCollapsed ? (
          <div className="text-center text-[10px] text-gray-400 leading-tight">
            <p className="font-extrabold text-[#febd69]">SC</p>
          </div>
        ) : (
          <div className="text-xs text-gray-400">
            <p className="font-bold text-white flex items-center gap-1.5">
              <span>Aritii</span>
              <span className="text-[10px] text-[#febd69] font-semibold uppercase">Seller Central</span>
            </p>
            <p className="text-[10px] text-gray-500 mt-0.5">Seller Management Console</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default ModernSellerSidebar;
