import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { IoIosArrowDown } from 'react-icons/io';
import { getNavIcon } from '@/config/navIcons';
import { Avatar } from '@/components/common/ImageWithFallback';

/**
 * ProfileMenu — shared profile dropdown for BuyerHeader.
 *
 * Renders user info block + nav items from a config array (BUYER_PROFILE_DROPDOWN
 * or SELLER_PROFILE_DROPDOWN), with sections, separators, and logout.
 * Keyboard: Escape closes, arrow keys navigate, Tab works naturally.
 */
export default function ProfileMenu({
  items = [],
  user,
  fallback,
  isSeller = false,
  onLogout,
  menuId = 'profile-menu',
  tone = 'default',
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        close();
        triggerRef.current?.focus();
      }
    };
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && !triggerRef.current?.contains(e.target)) {
        close();
      }
    };
    document.addEventListener('keydown', handleEsc);
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [open, close]);

  const handleKeyDown = useCallback((e) => {
    if (!menuRef.current) return;
    const links = Array.from(menuRef.current.querySelectorAll('a, button'));
    const idx = links.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = idx < links.length - 1 ? idx + 1 : 0;
      links[next]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = idx > 0 ? idx - 1 : links.length - 1;
      links[prev]?.focus();
    }
  }, []);

  const filteredItems = items.filter((item) => {
    if (item.visibleWhen === 'isSeller' && !isSeller) return false;
    return true;
  });

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all duration-200 ${tone === 'light' ? 'text-white hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/50' : 'hover:bg-gray-100'}`}
      >
        {user ? (
          <Avatar data={user} fallback={fallback} alt={user.name}
            className={`w-9 h-9 rounded-full object-cover border-2 ${tone === 'light' ? 'border-white/70' : 'border-[#75d04b]'}`} />
        ) : (
          <div className="w-9 h-9 rounded-full bg-[#f3ffee] flex items-center justify-center">
            <span className="text-[#75d04b] text-sm font-bold">?</span>
          </div>
        )}
        <div className="hidden xl:block text-left">
          <p className={`text-sm font-semibold ${tone === 'light' ? 'text-white' : 'text-gray-900'} leading-tight line-clamp-1`}>{user?.name || 'Account'}</p>
          <p className={`text-[11px] ${tone === 'light' ? 'text-white/70' : 'text-gray-500'}`}>{isSeller ? 'Seller' : 'Buyer'}</p>
        </div>
        <IoIosArrowDown size={14} className={`transition-transform ${tone === 'light' ? 'text-white/80' : 'text-gray-500'} ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div ref={menuRef} id={menuId} onKeyDown={handleKeyDown}>
          <div className="fixed inset-0 z-40" onClick={close} aria-hidden="true" />
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 py-2">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>

            <div className="py-1">
              {filteredItems.map((item, idx) => {
                if (item.type === 'separator') {
                  return <div key={idx} className="my-1 border-t border-gray-100" />;
                }
                if (item.section) {
                  return (
                    <p key={idx} className="px-4 py-1 mt-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {item.section}
                    </p>
                  );
                }
                if (item.type === 'logout') {
                  return (
                    <button
                      key={idx}
                      onClick={() => { onLogout?.(); close(); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      {(() => { const Icon = getNavIcon('MdLogout'); return Icon ? <Icon size={18} /> : null; })()}
                      <span>Log out</span>
                    </button>
                  );
                }
                const Icon = getNavIcon(item.icon);
                return (
                  <Link
                    key={idx}
                    to={item.to}
                    onClick={close}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    {Icon && <Icon size={18} />}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
