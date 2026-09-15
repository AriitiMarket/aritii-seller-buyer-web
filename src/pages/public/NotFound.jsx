import React from 'react'

/**
 * NotFound Page (404)
 * Shared error page for all routes that don't match
 */
const NotFound = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Page not found</p>
        <p className="text-gray-500 mb-8">Sorry, the page you're looking for doesn't exist or has been moved.</p>
        <a 
          href="/" 
          className="inline-block px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition"
        >
          Go Back Home
        </a>
      </div>
    </div>
  )
}

export default NotFound
