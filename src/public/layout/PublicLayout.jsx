import React from 'react'
import MarketplaceHeader from "@/public/components/MarketplaceHeader"
import PublicFooter from '@/shared/components/Footer'
import SkipToContent from '@/shared/components/SkipToContent'
import PublicScrollToTop from '@/public/components/PublicScrollToTop'

/**
 * PublicLayout — for pages visible to anyone (no login required).
 *
 * Chrome stack (mobile-first):
 *   1. MarketplaceHeader — unified sticky header containing primary bar and secondary subnav in ONE view
 *   2. Page content
 */
const PublicLayout = ({ 
  children, 
  hideFooter = false, 
  hideSubNav = false,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <PublicScrollToTop />
      <SkipToContent />
      <MarketplaceHeader hideSubNav={hideSubNav} />
      
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none bg-white dark:bg-gray-950">{children}</main>
      {!hideFooter && <PublicFooter />}
    </div>
  )
}

export { PublicLayout }
export default PublicLayout
