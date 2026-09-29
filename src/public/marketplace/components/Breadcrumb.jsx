import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineRight } from 'react-icons/ai';

/**
 * Breadcrumb - the standard breadcrumb for public pages that render inside a
 * container (catalog pages). Same visual language as ExperiencePageHeader:
 * gray-500 links, current page emphasized, chevron separators, focus rings.
 */
const Breadcrumb = ({ items, className = '' }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav className={`flex items-center flex-wrap gap-1.5 text-sm mb-5 ${className}`} aria-label="Breadcrumb">
      {items.map((item, index) => {
        const last = index === items.length - 1;
        return (
          <React.Fragment key={`${item.label}-${index}`}>
            {index > 0 && (
              <AiOutlineRight
                size={12}
                className="text-gray-300 dark:text-gray-600 flex-shrink-0"
                aria-hidden="true"
              />
            )}
            {item.to && !last ? (
              <Link
                to={item.to}
                className="text-gray-500 dark:text-gray-400 hover:text-[#75d04b] transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75d04b]"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 dark:text-white font-medium" aria-current={last ? 'page' : undefined}>
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
