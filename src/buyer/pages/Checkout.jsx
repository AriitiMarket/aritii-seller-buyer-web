import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BuyerHeader from '@/buyer/components/BuyerHeader'
import Footer from '@/shared/components/Footer'
import Checkout from '@/buyer/components/Checkout'
import CheckoutSteps from '@/buyer/components/CheckoutSteps'
import { validateCart } from '@/store/slices/cartThunks'
import { setCartLoading } from '@/store/slices/cartSlice'
import Breadcrumbs from '@/shared/components/Breadcrumbs'

const CheckoutPage = () => {
  const dispatch = useDispatch()
  const { cart, isLoading } = useSelector((state) => state.cart)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Always clear a stale cart spinner on mount so a prior failed request
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Validate cart on page load.
  // Run once per mount so a cart.length change mid-validation cannot re-enter
  // (which previously could leave isLoading stuck true → infinite spinner).
  const validatedRef = useRef(false);
  useEffect(() => {
    if (validatedRef.current) return;
    if (cart && cart.length > 0) {
      validatedRef.current = true;
      dispatch(validateCart());
    }
  }, [dispatch, cart]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-market-surface-dim flex flex-col">
        <BuyerHeader onMenuClick={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 mx-auto mb-4 text-market-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-market-on-surface-variant">Validating cart items...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-market-surface-dim flex flex-col">
      <BuyerHeader onMenuClick={() => {}} />
      
      {/* Checkout Steps */}
      <div className="w-full py-6 bg-white border-b border-market-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Checkout' }]} />
          <CheckoutSteps active={1} />
          
        </div>
      </div>

      {/* Main Checkout Content */}
      <div className="flex-1">
        <Checkout />
      </div>

      <Footer />
    </div>
  )
}

export default CheckoutPage
