import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-brand-cream px-6'>
      <h1 className='text-8xl font-bold text-brand-primary mb-4'>404</h1>
      <h2 className='text-2xl text-brand-charcoal mb-2'>Page Not Found</h2>
      <p className='text-brand-muted mb-8 text-center'>
        The page you're looking for doesn't exist on Aritii Market.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 font-medium"
      >
        Back to Home
      </Link>
    </div>
  )
}

export default NotFound