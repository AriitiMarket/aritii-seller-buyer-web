import React from 'react';
import Breadcrumbs from '@/shared/components/Breadcrumbs';

/**
 * PageHeader — standardised h1 title block for all pages.
 *
 * Replaces the 25+ near-duplicate h1 + description + action blocks.
 * Exactly one h1 per page. Breadcrumbs are optional and rendered above.
 *
 * Layout: flex column on mobile, row on sm+ with title left, actions right.
 */
export default function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  as: Tag = 'h1',
  className = '',
}) {
  return (
    <div className={`mb-6 md:mb-8 ${className}`}>
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Tag className="text-2xl md:text-3xl font-bold text-gray-800">{title}</Tag>
          {description && (
            <p className="mt-1 text-sm md:text-base text-gray-500">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}
