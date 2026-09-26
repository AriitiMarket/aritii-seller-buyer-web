import React from 'react';

/**
 * HeaderShell — shared sticky header wrapper.
 *
 * Provides consistent sticky positioning, border, z-index and container
 * width across all app headers. Each header keeps its own layout inside.
 *
 * Heights from theme: public/marketplace h-16, buyer h-[68px], seller h-[72px]
 */
export default function HeaderShell({
  children,
  height = 'h-16',
  className = '',
  zIndex = 'z-50',
  bg = 'bg-white',
}) {
  return (
    <header
      className={`sticky top-0 ${zIndex} ${bg} border-b border-gray-200 shadow-sm ${className}`}
    >
      <div className={`w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 flex items-center ${height}`}>
        {children}
      </div>
    </header>
  );
}
