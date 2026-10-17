import React from 'react'
import SkipToContent from '@/shared/components/SkipToContent'
import PublicScrollToTop from '@/public/components/PublicScrollToTop'
import DeliveryPortalHeader from '@/public/delivery-center/components/DeliveryPortalHeader'
import DeliveryPortalFooter from '@/public/delivery-center/components/DeliveryPortalFooter'

/**
 * DeliveryLandingLayout - Independent Delivery Portal Layout
 *
 * Complete isolation from marketplace (buyer) experience. Uses dedicated
 * header, footer, and styling. NO shared components with marketplace.
 *
 * This layout is for the OLD /delivery page that shows delivery information
 * to new/existing providers. It uses the same independent components as the
 * new /delivery-center landing page.
 *
 * Structure:
 *   ┌─────────────────────────────────────┐
 *   │ DeliveryPortalHeader (sticky)       │
 *   ├─────────────────────────────────────┤
 *   │ main (scrollable content)           │
 *   ├─────────────────────────────────────┤
 *   │ DeliveryPortalFooter                │
 *   └─────────────────────────────────────┘
 */
const DeliveryLandingLayout = ({ children, hideFooter = false }) => {
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

export { DeliveryLandingLayout }
export default DeliveryLandingLayout
