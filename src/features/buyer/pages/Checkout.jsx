import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BuyerHeader from '@/features/buyer/components/BuyerHeader'
import Footer from '@/shared/components/Footer'
import Checkout from '@/features/buyer/components/Checkout'
import CheckoutSteps from '@/features/buyer/components/CheckoutSteps'
import { validateCart } from '@/store/slices/cartThunks'
import Breadcrumbs from '@/shared/components/Breadcrumbs'

const CheckoutPage = () => {
  const dispatch = useDispatch()
  const { cart } = useSelector((state) => state.cart)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Quietly validate cart in background once on mount without blocking or unmounting checkout
  const validatedRef = useRef(false);
  useEffect(() => {
    if (validatedRef.current) return;
    if (cart && cart.length > 0) {
      validatedRef.current = true;
      dispatch(validateCart());
    }
  }, [dispatch, cart]);

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col text-gray-900 dark:text-white transition-colors">
      <BuyerHeader hideSubNav={true} onMenuClick={() => {}} />
      
      {/* Checkout Steps */}
      <div className="w-full py-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
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
