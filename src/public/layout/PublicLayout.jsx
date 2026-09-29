import React from 'react'
import PublicHeader from '@/public/components/PublicHeader'
import ExperienceSubNav from '@/public/components/ExperienceSubNav'
import PublicFooter from '@/shared/components/Footer'
import SkipToContent from '@/shared/components/SkipToContent'
import PublicScrollToTop from '@/public/components/PublicScrollToTop'

/**
 * PublicLayout — for pages visible to anyone (no login required).
 * Wraps: PublicHeader → ExperienceSubNav (contextual sub-header) → children → PublicFooter
 */
const PublicLayout = ({ children, hideFooter = false, hideSubNav = false }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDF6EC] dark:bg-gray-950">
      <PublicScrollToTop />
      <SkipToContent />
      <PublicHeader />
      {!hideSubNav && <ExperienceSubNav />}
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none bg-[#FDF6EC] dark:bg-gray-950">{children}</main>
      {!hideFooter && <PublicFooter />}
    </div>
  )
}

export { PublicLayout }
export default PublicLayout
