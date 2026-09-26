import React from 'react';

/**
 * PublicPageLayout - Consistent page shell for all public marketplace pages
 * Provides standard container, spacing, and structure
 */
const PublicPageLayout = ({ 
  children, 
  className = '',
  maxWidth = 'max-w-7xl',
  padding = 'px-4 sm:px-6 lg:px-8',
  verticalPadding = 'py-8'
}) => {
  return (
    <div className={`${maxWidth} mx-auto ${padding} ${verticalPadding} ${className}`}>
      {children}
    </div>
  );
};

export default PublicPageLayout;
