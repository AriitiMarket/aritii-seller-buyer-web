import React from 'react'
import SkipToContent from '@/shared/components/SkipToContent'
import PublicScrollToTop from '@/public/components/PublicScrollToTop'
import SellerCentralHeader from '../components/SellerCentralHeader'
import SellerCentralFooter from '../components/SellerCentralFooter'

/**
 * SellerCentralLayout - Independent Seller Center Layout
 *
 * Complete isolation from marketplace (buyer) experience. Uses dedicated
 * header, footer, and styling. NO shared components with marketplace.
 *
 * Structure:
 *   ┌─────────────────────────────────────┐
 *   │ SellerCentralHeader (fixed)         │
 *   ├─────────────────────────────────────┤
 *   │ main (scrollable content)           │
 *   ├─────────────────────────────────────┤
 *   │ SellerCentralFooter                 │
 *   └─────────────────────────────────────┘
 */
const SellerCentralLayout = ({ children, hideFooter = false }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <PublicScrollToTop />
      <SkipToContent />
      
      {/* Independent Seller Header */}
      <SellerCentralHeader />
      
      {/* Main Content */}
      <main 
        id="main-content" 
        tabIndex={-1} 
        className="flex-1 outline-none bg-white dark:bg-gray-950"
      >
        {children}
      </main>
      
      {/* Independent Seller Footer */}
      {!hideFooter && <SellerCentralFooter />}
    </div>
  )
}

export { SellerCentralLayout }
export default SellerCentralLayout
