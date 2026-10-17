import React from 'react'
import PublicHeader from '@/public/components/PublicHeader'
import PublicFooter from '@/shared/components/Footer'
import SkipToContent from '@/shared/components/SkipToContent'
import PublicScrollToTop from '@/public/components/PublicScrollToTop'

/**
 * ExperienceLayout — for public experience pages (Seller, Delivery, etc.)
 *
 * Uses PublicHeader which shows:
 *   - Experience navigation (Home | Marketplace | Sell on Aritii | Delivery)
 *   - Experience-specific accent and sub-navigation
 *   - Professional experience branding
 *
 * Chrome stack (mobile-first):
 *   1. PublicHeader — sticky, h-16 (64px)
 *   2. Page content
 *   3. PublicFooter
 */
const ExperienceLayout = ({ 
  children, 
  hideFooter = false,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <PublicScrollToTop />
      <SkipToContent />
      <PublicHeader />
      
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none bg-white dark:bg-gray-950">{children}</main>
      {!hideFooter && <PublicFooter />}
    </div>
  )
}

export { ExperienceLayout }
export default ExperienceLayout
