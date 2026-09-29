import React from 'react';
import { Link } from 'react-router-dom';

/**
 * SectionHeader - the standard section header used across public catalog pages
 * (Products, Shops, Categories, BestSelling…).
 *
 * Same type scale as the experience pages: h2 title + muted description, with
 * an optional "view all" action that always sits right-aligned and never wraps
 * under the title.
 */
const SectionHeader = ({
  title,
  description,
  viewAllLink,
  viewAllText = 'View all',
  className = '',
}) => {
  return (
    <div className={`flex items-end justify-between gap-4 mb-6 md:mb-8 ${className}`}>
      <div className="min-w-0">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        )}
      </div>
      {viewAllLink && (
        <Link
          to={viewAllLink}
          className="text-sm font-semibold text-[#75d04b] hover:text-[#5ac12f] flex-shrink-0 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75d04b]"
        >
          {viewAllText} →
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;
