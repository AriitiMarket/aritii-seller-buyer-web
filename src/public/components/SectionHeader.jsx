import React from 'react';
import { Link } from 'react-router-dom';

/**
 * SectionHeader - Consistent section header for public marketplace
 * Used across Products, Shops, Categories, and other sections
 */
const SectionHeader = ({ 
  title, 
  description, 
  viewAllLink, 
  viewAllText = 'View all',
  className = ''
}) => {
  return (
    <div className={`flex items-center justify-between mb-6 md:mb-8 ${className}`}>
      <div className="min-w-0">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        )}
      </div>
      {viewAllLink && (
        <Link 
          to={viewAllLink}
          className="text-sm font-semibold text-[#75d04b] hover:text-[#5ac12f] flex-shrink-0"
        >
          {viewAllText} →
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;
