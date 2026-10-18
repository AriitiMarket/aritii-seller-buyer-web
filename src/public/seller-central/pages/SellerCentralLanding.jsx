import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import SellerCentralLayout from '../layout/SellerCentralLayout'
import SellerCentralHero from '../components/SellerCentralHero'
import SellerCentralFeatures from '../components/SellerCentralFeatures'

/**
 * SellerCentralLandingPage - /seller
 *
 * Independent Seller Center landing page with complete isolation from
 * marketplace experience. Uses dedicated layout, header, footer, and components.
 *
 * Professional design system with Aritii branding focused on local commerce.
 *
 * Redirects approved sellers to the business dashboard.
 */
const SellerCentralLandingPage = () => {
  const navigate = useNavigate()
  const { isSeller } = useSelector((state) => state.seller || {})

  // Redirect approved sellers to business dashboard
  useEffect(() => {
    if (isSeller) {
      navigate('/business', { replace: true })
    }
  }, [isSeller, navigate])

  // Don't render landing page if redirecting
  if (isSeller) {
    return null
  }

  return (
    <SellerCentralLayout>
      {/* Hero Section */}
      <SellerCentralHero />

      {/* Features Grid */}
      <SellerCentralFeatures />

      {/* How It Works Section */}
      <section id="how-to-sell" className="bg-[#F7F7F7] dark:bg-gray-900 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F1111] dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-[#565959] dark:text-gray-400">
              Get started selling on Aritii in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Create Account',
                description: 'Sign up for a Seller Central account and provide your business information.',
              },
              {
                step: '2',
                title: 'Complete Profile',
                description: 'Add your shop details, banking information, and tax documentation.',
              },
              {
                step: '3',
                title: 'List Products',
                description: 'Add your products with descriptions, pricing, and images.',
              },
              {
                step: '4',
                title: 'Start Selling',
                description: 'Receive orders, manage inventory, and grow your business.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 bg-[#FF9900] text-white font-bold text-xl rounded-full flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-[#0F1111] dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-[#565959] dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-white dark:bg-gray-950 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F1111] dark:text-white mb-4">
              Transparent Pricing
            </h2>
            <p className="text-lg text-[#565959] dark:text-gray-400">
              Simple, straightforward fees with no hidden charges
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Individual Plan',
                description: 'Perfect for getting started',
                price: 'Per item',
              },
              {
                title: 'Professional Plan',
                description: 'For growing sellers',
                price: 'Monthly',
              },
              {
                title: 'Enterprise',
                description: 'For high-volume sellers',
                price: 'Custom',
              },
            ].map((plan) => (
              <div
                key={plan.title}
                className="bg-[#F7F7F7] dark:bg-gray-900 border border-[#E7E5E4] dark:border-gray-800 rounded-lg p-8 text-center hover:shadow-lg transition-shadow duration-200"
              >
                <h3 className="text-xl font-bold text-[#0F1111] dark:text-white mb-2">
                  {plan.title}
                </h3>
                <p className="text-sm text-[#565959] dark:text-gray-400 mb-6">
                  {plan.description}
                </p>
                <div className="text-[#FF9900] font-bold text-lg mb-6">
                  Competitive {plan.price} Rates
                </div>
                <a
                  href="/seller-sign-up"
                  className="inline-block px-6 py-2 bg-[#FF9900] hover:bg-[#E68A00] text-white font-bold rounded transition-colors duration-150"
                >
                  Learn More
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="bg-[#F7F7F7] dark:bg-gray-900 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F1111] dark:text-white mb-4">
              Seller Resources
            </h2>
            <p className="text-lg text-[#565959] dark:text-gray-400">
              Everything you need to succeed on Aritii Marketplace
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Seller Guides',
                description: 'Learn best practices for listing products, optimizing visibility, and managing inventory.',
              },
              {
                title: 'Webinars & Training',
                description: 'Live sessions with expert sellers and platform specialists to help you grow.',
              },
              {
                title: 'Community Forum',
                description: 'Connect with other sellers, share tips, and get answers to common questions.',
              },
              {
                title: 'Support Center',
                description: 'Access detailed documentation and contact our seller support team anytime.',
              },
            ].map((resource) => (
              <div
                key={resource.title}
                className="bg-white dark:bg-gray-800 border border-[#E7E5E4] dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <h3 className="font-bold text-[#0F1111] dark:text-white mb-2">
                  {resource.title}
                </h3>
                <p className="text-sm text-[#565959] dark:text-gray-400">
                  {resource.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#131921] text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Grow Your Business?
          </h2>
          <p className="text-lg text-[#CCCCCB] mb-10 max-w-2xl mx-auto">
            Join thousands of sellers already succeeding on Aritii Marketplace. Start selling today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/seller-sign-up"
              className="px-10 py-4 bg-[#FF9900] hover:bg-[#E68A00] text-white font-bold rounded transition-colors duration-150"
            >
              Start Selling
            </a>
            <a
              href="/login"
              className="px-10 py-4 border border-[#CCCCCB] text-white font-bold rounded hover:border-white hover:bg-white/5 transition-colors duration-150"
            >
              Sign In
            </a>
          </div>
        </div>
      </section>
    </SellerCentralLayout>
  )
}

export default SellerCentralLandingPage
