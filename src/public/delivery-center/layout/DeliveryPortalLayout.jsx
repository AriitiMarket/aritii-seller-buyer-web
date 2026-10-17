import React from 'react'
import SkipToContent from '@/shared/components/SkipToContent'
import PublicScrollToTop from '@/public/components/PublicScrollToTop'
import DeliveryPortalHeader from '../components/DeliveryPortalHeader'
import DeliveryPortalFooter from '../components/DeliveryPortalFooter'

/**
 * DeliveryPortalLayout - Independent Delivery Center Layout
 *
 * Complete isolation from marketplace (buyer) and seller center experiences.
 * Uses dedicated header, footer, and styling. NO shared components with 
 * marketplace or seller center.
 *
 * Structure:
 *   ┌─────────────────────────────────────┐
 *   │ DeliveryPortalHeader (fixed)        │
 *   ├─────────────────────────────────────┤
 *   │ main (scrollable content)           │
 *   ├─────────────────────────────────────┤
 *   │ DeliveryPortalFooter                │
 *   └─────────────────────────────────────┘
 */
const DeliveryPortalLayout = ({ children, hideFooter = false }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <PublicScrollToTop />
      <SkipToContent />
      
      {/* Independent Delivery Header */}
      <DeliveryPortalHeader />
      
      {/* Main Content */}
      <main 
        id="main-content" 
        tabIndex={-1} 
        className="flex-1 outline-none bg-white dark:bg-gray-950"
      >
        {children}
      </main>
      
      {/* Independent Delivery Footer */}
      {!hideFooter && <DeliveryPortalFooter />}
    </div>
  )
}

export { DeliveryPortalLayout }
export default DeliveryPortalLayout
