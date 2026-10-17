import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Experience Page Header
 *
 * Standardised h1 title block for marketplace experience pages.
 * Extends the shared PageHeader with marketplace-specific branding.
 *
 * Layout: flex column on mobile, row on sm+ with title left, actions right.
 */
export default function ExperiencePageHeader({
  experience,
  breadcrumb,
  badge,
  title,
  description,
  visual,
  actions,
  as: Tag = 'h1',
  className = '',
}) {
  return (
    <div className={`mb-6 md:mb-8 ${className}`}>
      {breadcrumb && breadcrumb.length > 0 && (
        <nav aria-label="breadcrumb" className="mb-4 flex flex-wrap items-center gap-2">
          {breadcrumb.map((item, index) => {
            const isLast = index === breadcrumb.length - 1;
            return (
              <React.Fragment key={`${item.label}-${index}`}>
                {index > 0 && <span aria-hidden="true" className="text-sm text-gray-400">/</span>}
                {item.to && !isLast ? (
                  <Link
                    to={item.to}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#75d04b] transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Tag className="text-2xl md:text-3xl font-bold text-gray-800">{title}</Tag>
          {description && (
            <p className="mt-1 text-sm md:text-base text-gray-500">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
      {visual && <div className="my-8">{visual}</div>}
    </div>
  );
}