import React from 'react'
import { Link } from 'react-router-dom'
import { AiOutlineArrowRight } from 'react-icons/ai'

/**
 * SellerCentralHero - Aritii Seller Central hero section
 *
 * Professional dark hero with strong value proposition for local sellers
 */
const SellerCentralHero = () => {
  return (
    <section className="bg-[#131921] text-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Grow Your Local Business with Aritii
            </h1>
            <p className="text-lg md:text-xl text-[#CCCCCB] mb-8 leading-relaxed">
              Connect with customers in your community. Access a growing marketplace of local buyers looking for what you offer.
            </p>

            <div className="space-y-4 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#FF9900] flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs font-bold text-white">✓</span>
                </div>
                <div>
                  <p className="font-semibold">Reach Local Customers</p>
                  <p className="text-sm text-[#CCCCCB]">Connect with buyers in your neighborhood and city</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#FF9900] flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs font-bold text-white">✓</span>
                </div>
                <div>
                  <p className="font-semibold">Professional Seller Tools</p>
                  <p className="text-sm text-[#CCCCCB]">Manage products, orders, and analytics from one dashboard</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#FF9900] flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs font-bold text-white">✓</span>
                </div>
                <div>
                  <p className="font-semibold">Integrated Delivery Network</p>
                  <p className="text-sm text-[#CCCCCB]">Seamless order fulfillment with local delivery partners</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/seller-sign-up"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FF9900] hover:bg-[#E68A00] text-white font-bold rounded transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9900]"
              >
                Start Selling Now
                <AiOutlineArrowRight size={20} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#CCCCCB] text-white font-bold rounded hover:border-white hover:bg-white/5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9900]"
              >
                Sign in to Account
              </Link>
            </div>
          </div>

          {/* Right: Visual (placeholder) */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF9900]/20 to-[#FF9900]/5 rounded-2xl" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 rounded-2xl bg-[#FF9900]/10 border-2 border-[#FF9900] flex items-center justify-center mx-auto mb-4">
                    <svg className="w-16 h-16 text-[#FF9900]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                  <p className="text-[#CCCCCB] font-semibold">Ready to grow your business?</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SellerCentralHero
