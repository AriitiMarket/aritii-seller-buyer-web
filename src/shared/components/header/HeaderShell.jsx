import React from 'react';

/**
 * HeaderShell — shared positioned header wrapper.
 *
 * Provides consistent positioning, border, z-index and container width across
 * app headers. Headers remain sticky by default; callers can opt into fixed.
 *
 * Heights from theme: public/marketplace h-16, buyer h-[68px], seller h-[72px]
 */
export default function HeaderShell({
  children,
  height = 'h-16',
  className = '',
  zIndex = 'z-50',
  bg = 'bg-white',
  position = 'sticky',
}) {
  const positionClasses = position === 'fixed'
    ? 'fixed inset-x-0 top-0 w-full'
    : 'sticky top-0';

  return (
    <header
      className={`${positionClasses} ${zIndex} ${bg} border-b border-gray-200 shadow-sm ${className}`}
    >
      <div className={`w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 flex items-center ${height}`}>
        {children}
      </div>
    </header>
  );
}
