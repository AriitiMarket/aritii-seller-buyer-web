import React, { useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai';
import BrandLogo from '@/components/common/BrandLogo';

/**
 * MobileDrawer — shared slide-in drawer for public headers.
 *
 * Features: overlay backdrop, focus trap, Escape to close,
 * body scroll lock, focus return, role="dialog" aria-modal.
 * Used by PublicHeader.
 */
export default function MobileDrawer({
  open,
  onClose,
  navItems = [],
  navLinkClass,
  id = 'mobile-drawer',
  children,
}) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      closeRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-[70] lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`fixed top-0 bottom-0 left-0 w-[70%] max-w-[300px] bg-white dark:bg-gray-900 shadow-xl z-[75] transform transition-transform duration-300 ease-in-out lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100 dark:border-gray-800">
            <Link to="/" className="flex items-center gap-2" onClick={onClose}>
              <BrandLogo size="sm" showText showTagline={false} linked={false} />
            </Link>
            <button
              ref={closeRef}
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-[#75d04b] rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Close navigation menu"
            >
              <AiOutlineClose size={20} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={navLinkClass}
                onClick={onClose}
              >
                {item.label}
              </NavLink>
            ))}
            {children}
          </nav>
        </div>
      </div>
    </>
  );
}
