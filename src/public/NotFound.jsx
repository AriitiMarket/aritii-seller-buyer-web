import React from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '@/public/layout/PublicLayout';

const NotFound = () => {
  return (
    <PublicLayout>
      <div className="w-full min-h-[70vh] flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="text-center max-w-md py-12">
          <h1 className="text-7xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">404</h1>
          <p className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Page Not Found</p>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">Sorry, the page you're looking for doesn't exist or has been moved.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-2.5 bg-[#75d04b] hover:brightness-95 text-white font-semibold rounded-full shadow-xs transition-all text-sm"
            >
              Go Back Home
            </Link>
            <Link
              to="/marketplace"
              className="inline-flex items-center px-6 py-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-full hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors text-sm shadow-xs"
            >
              Explore Catalog
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default NotFound;
