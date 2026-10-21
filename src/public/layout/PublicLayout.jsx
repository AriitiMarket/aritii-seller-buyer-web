import React from 'react'
import MarketplaceHeader from "@/public/components/MarketplaceHeader"
import SubNavBar from '@/features/marketplace/components/SubNavBar'
import PublicFooter from '@/shared/components/Footer'
import SkipToContent from '@/shared/components/SkipToContent'
import PublicScrollToTop from '@/public/components/PublicScrollToTop'

/**
 * PublicLayout — for pages visible to anyone (no login required).
 *
 * Chrome stack (mobile-first):
 *   1. MarketplaceHeader — sticky h-14 (56px)
 *   2. SubNavBar — sticky below the header at 88px (36px); the responsive secondary nav with
 *      the left slide-in "All" browse drawer. Pass `hideSubNav` to opt out
 *      (e.g. full-bleed campaign pages).
 *   3. Page content
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
      <MarketplaceHeader />
      {!hideSubNav && <SubNavBar stickyTopClass="top-12" />}
      
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none bg-white dark:bg-gray-950">{children}</main>
      {!hideFooter && <PublicFooter />}
    </div>
  )
}

export { PublicLayout }
export default PublicLayout
