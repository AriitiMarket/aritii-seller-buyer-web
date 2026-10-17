import React from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '@/public/layout/PublicLayout';

const NotFound = () => {
  return (
    <PublicLayout>
      <div className="w-full min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-6">Page not found</p>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Sorry, the page you're looking for doesn't exist or has been moved.</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-[#75d04b] rounded-full text-white font-semibold rounded-lg hover:bg-[#031a0d] transition mr-3"
          >
            Go Back Home
          </Link>
          <Link
            to="/delivery"
            className="inline-block px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Delivery Portal
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
};

export default NotFound