import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Breadcrumb - Navigation breadcrumb for public pages
 * Shows the current page path for better UX
 */
const Breadcrumb = ({ items, className = '' }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav className={`flex items-center gap-2 text-sm mb-6 ${className}`} aria-label="Breadcrumb">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span className="text-gray-400">/</span>
          )}
          {item.to ? (
            <Link
              to={item.to}
              className="text-gray-600 dark:text-gray-400 hover:text-[#75d04b] transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 dark:text-white font-medium">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
