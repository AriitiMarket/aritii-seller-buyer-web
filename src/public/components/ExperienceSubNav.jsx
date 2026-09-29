import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { experienceForPath, EXPERIENCE_SUBNAV } from '@/public/experiences';

/**
 * ExperienceSubNav — the contextual secondary header under the main public
 * header.
 *
 * When you click an experience (e.g. Marketplace), the sub-header displays that
 * experience's destinations with the same active-item treatment as the main
 * header, in the experience accent. Hidden on <md (the mobile drawer carries
 * the same grouped destinations instead).
 *
 *   - `match`   → prefix that marks the item active (e.g. /product/12 → All Products)
 *   - `hash`    → scrolls to a section id on the experience page
 *   - `cta`     → rendered as a pill button (the experience's main action)
 */
const ExperienceSubNav = () => {
  const location = useLocation();
  const experience = experienceForPath(location.pathname);
  const items = EXPERIENCE_SUBNAV[experience.key] || [];

  // Hide sub-header on homepage
  if (location.pathname === '/') {
    return null;
  }

  // Hash links scroll to the section (same-page anchors, SPA-safe).
  const handleHash = (e, hash) => {
    e.preventDefault();
    const el = document.getElementById(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', `#${hash}`);
  };

  return (
    <div className="hidden md:block sticky top-16 z-40 self-start bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-12 flex items-center gap-1 overflow-x-auto"
        aria-label={`${experience.label} sub navigation`}
      >
        {items.map((item) => {
          // Plain-link rendering with our own active logic — NavLink would mark
          // hash anchors active the moment their base path matches, so every
          // section link would light up at once.
          const isActive = item.cta
            ? false
            : item.hash
              ? location.hash === `#${item.hash}`
              : item.match
                ? location.pathname.startsWith(item.match)
                : location.pathname === item.to;

          if (item.cta) {
            return (
              <Link
                key={item.label}
                to={item.to}
                className={`ml-auto flex-shrink-0 inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 ${experience.ring}`}
                style={{ backgroundColor: experience.accent }}
              >
                {item.label}
              </Link>
            );
          }

          return (
            <Link
              key={item.label}
              to={item.to}
              onClick={item.hash ? (e) => handleHash(e, item.hash) : undefined}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 ${experience.ring} ${
                isActive
                  ? 'font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:text-[#75d04b] hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              style={isActive ? { color: experience.accent, backgroundColor: `${experience.accent}14` } : undefined}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default ExperienceSubNav;
