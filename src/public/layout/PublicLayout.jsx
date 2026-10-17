import React from 'react'
import MarketplaceHeader from "@/public/components/MarketplaceHeader"
import TopUtilityBar from "@/public/components/TopUtilityBar"
import SubNavBar from '@/features/marketplace/components/SubNavBar'
import PublicFooter from '@/shared/components/Footer'
import SkipToContent from '@/shared/components/SkipToContent'
import PublicScrollToTop from '@/public/components/PublicScrollToTop'

/**
 * PublicLayout — for pages visible to anyone (no login required).
 *
 * Chrome stack (mobile-first):
 *   1. TopUtilityBar — h-10 (40px), location selector + portal links
 *   2. MarketplaceHeader — sticky, h-16 (64px)
 *   3. SubNavBar — sticky top-16 (40px); the responsive secondary nav with
 *      the left slide-in "All" browse drawer. Pass `hideSubNav` to opt out
 *      (e.g. full-bleed campaign pages).
 *   4. Page content
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
      <TopUtilityBar />
      <MarketplaceHeader />
      {!hideSubNav && <SubNavBar />}
      
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none bg-white dark:bg-gray-950">{children}</main>
      {!hideFooter && <PublicFooter />}
    </div>
  )
}

export { PublicLayout }
export default PublicLayout
