import React from 'react'
import PublicHeader from '@/public/components/PublicHeader'
import PublicFooter from '@/shared/components/Footer'
import SkipToContent from '@/shared/components/SkipToContent'

/**
 * PublicLayout — for pages visible to anyone (no login required).
 * Wraps: PublicHeader → children → PublicFooter
 */
const PublicLayout = ({ children, hideFooter = false }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <SkipToContent />
      <PublicHeader />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">{children}</main>
      {!hideFooter && <PublicFooter />}
    </div>
  )
}

export { PublicLayout }
export default PublicLayout