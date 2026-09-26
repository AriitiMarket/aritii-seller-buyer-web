import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = ({ items }) => {
  const location = useLocation();

  let breadcrumbs = items;

  if (!breadcrumbs) {
    const path = location.pathname;
    if (path === '/') return null;

    const segments = path.split('/').filter(Boolean);
    breadcrumbs = [{ label: 'Home', to: '/' }];

    let currentPath = '';
    for (const segment of segments) {
      currentPath += `/${segment}`;
      // Skip things that look like mongo IDs
      if (segment.length === 24 && /^[0-9a-fA-F]+$/.test(segment)) {
        continue;
      }
      // Skip purely numeric IDs like checkout steps if they are digits (actually we humanize, but just in case)
      if (/^\d+$/.test(segment) && segment.length > 5) {
        continue;
      }

      const label = segment
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());

      breadcrumbs.push({ label, to: currentPath });
    }
  }

  if (!breadcrumbs || breadcrumbs.length === 0) return null;

  // The last crumb should not be linked
  const processedCrumbs = breadcrumbs.map((crumb, index) => {
    const isLast = index === breadcrumbs.length - 1;
    return { ...crumb, isLast };
  });

  return (
    <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-2 text-sm text-gray-500 mb-4">
      <ol className="flex items-center flex-wrap gap-2 w-full">
        {processedCrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {index > 0 && <span aria-hidden="true">/</span>}
            <li>
              {crumb.isLast ? (
                <span className="text-gray-900 font-medium aria-[current=page]:true truncate inline-block max-w-[200px] sm:max-w-[400px] align-bottom" aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <Link to={crumb.to || '#'} className="hover:text-[#75d04b] truncate inline-block max-w-[150px] align-bottom">
                  {crumb.label}
                </Link>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
