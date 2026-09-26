import React from 'react';
import { Link } from 'react-router-dom';

/**
 * SectionHeader — standardised h2 title with optional "View all" link.
 *
 * Replaces the 10+ near-duplicate section title + link blocks across
 * landing shelves, buyer dashboard and seller dashboard.
 */
export default function SectionHeader({
  title,
  description,
  link,
  as: Tag = 'h2',
  className = '',
}) {
  return (
    <div className={`mb-4 md:mb-6 flex items-end justify-between gap-4 ${className}`}>
      <div>
        <Tag className="text-xl md:text-2xl font-bold text-gray-800">{title}</Tag>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>
      {link && (
        <Link
          to={link.to}
          className="text-sm font-semibold text-[#75d04b] hover:text-[#5ac12f] flex items-center gap-1 transition-colors whitespace-nowrap flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75d04b] rounded"
        >
          {link.label || 'View All'}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );
}
