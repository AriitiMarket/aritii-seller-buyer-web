/**
 * MegaMenu - Professional mega menu for desktop navigation
 * 
 * Features:
 * - Keyboard accessible (Enter/Space to open, Escape to close)
 * - Hover and click support
 * - Smooth animations
 * - Experience-specific content
 * - Proper ARIA attributes
 * - Focus trap when open
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { EXPERIENCES } from '@/public/experiences';

/**
 * Mega menu content for each experience
 */
const MEGA_MENU_CONTENT = {
  marketplace: {
    title: 'Marketplace',
    description: 'Discover local products and shops',
    columns: [
      {
        heading: 'Browse',
        links: [
          { label: 'All Products', to: '/products', icon: '🛍️' },
          { label: 'Categories', to: '/categories', icon: '📂' },
          { label: 'Shops', to: '/shops', icon: '🏪' },
          { label: "Today's Deals", to: '/deals', icon: '🏷️' },
          { label: 'Best Sellers', to: '/best-selling', icon: '⭐' },
        ],
      },
      {
        heading: 'Discover',
        links: [
          { label: 'Search', to: '/search', icon: '🔍' },
          { label: 'Events', to: '/events', icon: '🎉' },
        ],
      },
      {
        heading: 'Learn',
        links: [
          { label: 'How Shopping Works', to: '/how-it-works', icon: '📖' },
          { label: 'FAQ', to: '/faq', icon: '❓' },
        ],
      },
    ],
    cta: { label: 'Start Shopping', to: '/products' },
  },
  seller: {
    title: 'Sell on Aritii',
    description: 'Grow your business with Aritii',
    columns: [
      {
        heading: 'Get Started',
        links: [
          { label: 'Benefits', to: '/sell-on-aritii#benefits', icon: '🎯' },
          { label: 'Seller Workspace', to: '/sell-on-aritii#seller-workspace', icon: '🏢' },
          { label: 'How to Start', to: '/sell-on-aritii#how-it-works', icon: '📋' },
          { label: 'Start Selling', to: '/seller-sign-up', icon: '🚀' },
        ],
      },
      {
        heading: 'Learn',
        links: [
          { label: 'Marketplace', to: '/marketplace', icon: '🛍️' },
          { label: 'FAQ', to: '/faq', icon: '❓' },
        ],
      },
    ],
    cta: { label: 'Become a Seller', to: '/seller-sign-up' },
  },
  delivery: {
    title: 'Delivery Services',
    description: 'Connect orders to customers',
    columns: [
      {
        heading: 'How It Works',
        links: [
          { label: 'Delivery Flow', to: '/delivery#how-it-works', icon: '🔄' },
          { label: 'Capabilities', to: '/delivery#delivery-capabilities', icon: '⚡' },
          { label: 'Provider Network', to: '/delivery#providers', icon: '🌐' },
          { label: 'Tracking', to: '/delivery#tracking', icon: '📍' },
        ],
      },
      {
        heading: 'For Providers',
        links: [
          { label: 'Join Network', to: '/delivery-sign-up', icon: '🤝' },
          { label: 'Application Status', to: '/provider-application/status', icon: '📋' },
        ],
      },
      {
        heading: 'Learn',
        links: [
          { label: 'FAQ', to: '/faq', icon: '❓' },
        ],
      },
    ],
    cta: { label: 'Join Delivery', to: '/delivery-sign-up' },
  },
};

/**
 * Single mega menu panel
 */
function MegaMenuPanel({ content, experienceKey, isOpen, onClose, buttonRef }) {
  const panelRef = useRef(null);
  const firstFocusableRef = useRef(null);
  const lastFocusableRef = useRef(null);

  // Focus trap when menu is open
  useEffect(() => {
    if (!isOpen) return;

    const handleTab = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusableRef.current) {
          e.preventDefault();
          lastFocusableRef.current?.focus();
        }
      } else {
        if (document.activeElement === lastFocusableRef.current) {
          e.preventDefault();
          firstFocusableRef.current?.focus();
        }
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleTab);
    document.addEventListener('keydown', handleEscape);

    firstFocusableRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleTab);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, buttonRef]);

  if (!isOpen) return null;

  const experience = EXPERIENCES[experienceKey] || EXPERIENCES.marketplace;

  return (
    <div
      ref={panelRef}
      className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-xl z-50"
      role="menu"
      aria-label={`${content.title} menu`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.columns.map((column, colIndex) => (
            <div key={column.heading} className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wider">
                {column.heading}
              </h3>
              <ul className="space-y-2" role="none">
                {column.links.map((link, linkIndex) => {
                  const isFirst = colIndex === 0 && linkIndex === 0;
                  const isLast = colIndex === content.columns.length - 1 && linkIndex === column.links.length - 1;
                  
                  return (
                    <li key={link.to}>
                      <Link
                        ref={isFirst ? firstFocusableRef : isLast ? lastFocusableRef : null}
                        to={link.to}
                        onClick={onClose}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[#75d04b] transition-colors focus:outline-none focus:ring-2 focus:ring-[#75d04b] focus:ring-inset"
                        role="menuitem"
                        tabIndex={-1}
                      >
                        <span className="text-lg" aria-hidden="true">{link.icon}</span>
                        <span className="text-sm font-medium">{link.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        {content.cta && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {content.description}
              </p>
            </div>
            <Link
              to={content.cta.to}
              onClick={onClose}
              className="px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ backgroundColor: experience.accent }}
            >
              {content.cta.label}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * MegaMenu component
 */
export default function MegaMenu() {
  const [openMenu, setOpenMenu] = useState(null);
  const [triggerMethod, setTriggerMethod] = useState(null);
  const location = useLocation();
  const timeoutRef = useRef(null);
  const buttonRefs = useRef({});

  // Close menu when route changes
  useEffect(() => {
    setOpenMenu(null);
  }, [location.pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openMenu && !e.target.closest('[data-mega-menu]')) {
        setOpenMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenu]);

  const handleMouseEnter = (menuKey) => {
    if (triggerMethod === 'click') return;
    
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setOpenMenu(menuKey);
      setTriggerMethod('hover');
    }, 150);
  };

  const handleMouseLeave = () => {
    if (triggerMethod === 'click') return;
    
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setOpenMenu(null);
    }, 200);
  };

  const handleClick = (menuKey, e) => {
    e.preventDefault();
    
    if (openMenu === menuKey) {
      setOpenMenu(null);
    } else {
      setOpenMenu(menuKey);
      setTriggerMethod('click');
    }
  };

  const handleKeyDown = (menuKey, e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(menuKey, e);
    }
  };

  const getButtonClass = (menuKey) => {
    const isActive = activeExperience === menuKey;
    
    return `flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 ${
      isActive
        ? 'text-gray-900 dark:text-white font-semibold'
        : 'text-gray-700 dark:text-gray-300 hover:text-[#75d04b] hover:bg-gray-50 dark:hover:bg-gray-800'
    }`;
  };

  const closeMenu = () => setOpenMenu(null);

  return (
    <div data-mega-menu className="relative hidden lg:block">
      <nav className="flex items-center gap-1" aria-label="Main navigation">
        {/* Marketplace */}
        <div
          className="relative"
          onMouseEnter={() => handleMouseEnter('marketplace')}
          onMouseLeave={handleMouseLeave}
        >
          <button
            ref={(el) => buttonRefs.current.marketplace = el}
            type="button"
            onClick={(e) => handleClick('marketplace', e)}
            onKeyDown={(e) => handleKeyDown('marketplace', e)}
            className={getButtonClass('marketplace')}
            aria-expanded={openMenu === 'marketplace'}
            aria-haspopup="true"
          >
            <span className="relative whitespace-nowrap">Marketplace</span>
            {activeExperience === 'marketplace' && (
              <span
                aria-hidden="true"
                className="absolute left-3 right-3 -bottom-[13px] h-[3px] rounded-full"
                style={{ backgroundColor: '#75d04b' }}
              />
            )}
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${openMenu === 'marketplace' ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <MegaMenuPanel
            content={MEGA_MENU_CONTENT.marketplace}
            experienceKey="marketplace"
            isOpen={openMenu === 'marketplace'}
            onClose={closeMenu}
            buttonRef={buttonRefs.current.marketplace}
          />
        </div>

        {/* Sell on Aritii */}
        <div
          className="relative"
          onMouseEnter={() => handleMouseEnter('seller')}
          onMouseLeave={handleMouseLeave}
        >
          <button
            ref={(el) => buttonRefs.current.seller = el}
            type="button"
            onClick={(e) => handleClick('seller', e)}
            onKeyDown={(e) => handleKeyDown('seller', e)}
            className={getButtonClass('seller')}
            aria-expanded={openMenu === 'seller'}
            aria-haspopup="true"
          >
            <span className="relative whitespace-nowrap">Sell on Aritii</span>
            {activeExperience === 'seller' && (
              <span
                aria-hidden="true"
                className="absolute left-3 right-3 -bottom-[13px] h-[3px] rounded-full"
                style={{ backgroundColor: '#2f6e4f' }}
              />
            )}
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${openMenu === 'seller' ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <MegaMenuPanel
            content={MEGA_MENU_CONTENT.seller}
            experienceKey="seller"
            isOpen={openMenu === 'seller'}
            onClose={closeMenu}
            buttonRef={buttonRefs.current.seller}
          />
        </div>

        {/* Delivery */}
        <div
          className="relative"
          onMouseEnter={() => handleMouseEnter('delivery')}
          onMouseLeave={handleMouseLeave}
        >
          <button
            ref={(el) => buttonRefs.current.delivery = el}
            type="button"
            onClick={(e) => handleClick('delivery', e)}
            onKeyDown={(e) => handleKeyDown('delivery', e)}
            className={getButtonClass('delivery')}
            aria-expanded={openMenu === 'delivery'}
            aria-haspopup="true"
          >
            <span className="relative whitespace-nowrap">Delivery</span>
            {activeExperience === 'delivery' && (
              <span
                aria-hidden="true"
                className="absolute left-3 right-3 -bottom-[13px] h-[3px] rounded-full"
                style={{ backgroundColor: '#2563eb' }}
              />
            )}
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${openMenu === 'delivery' ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <MegaMenuPanel
            content={MEGA_MENU_CONTENT.delivery}
            experienceKey="delivery"
            isOpen={openMenu === 'delivery'}
            onClose={closeMenu}
            buttonRef={buttonRefs.current.delivery}
          />
        </div>
      </nav>
    </div>
  );
}
