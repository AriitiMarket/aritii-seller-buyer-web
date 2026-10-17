import React from 'react'
import { Link } from 'react-router-dom'
import { AiOutlineArrowRight } from 'react-icons/ai'

/**
 * DeliveryPortalHero - Professional hero section for delivery partners
 * 
 * Focus on flexibility, earnings, and partnership opportunities
 */
const DeliveryPortalHero = () => {
  return (
    <section className="bg-gradient-to-r from-[#131921] to-[#232F3E] text-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Deliver Joy. Earn on Your Schedule.
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
              Join thousands of delivery partners earning flexible income by delivering packages in your community. Choose your hours, use your own vehicle, and build your delivery business with Aritii.
            </p>
            
            <div className="space-y-4 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#00A8E1] flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs font-bold text-white">✓</span>
                </div>
                <div>
                  <p className="font-semibold">Flexible Work Schedule</p>
                  <p className="text-sm text-gray-300">Work when it suits you, choose your routes and hours</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#00A8E1] flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs font-bold text-white">✓</span>
                </div>
                <div>
                  <p className="font-semibold">Competitive Earnings</p>
                  <p className="text-sm text-gray-300">Earn consistent income with transparent pay rates</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#00A8E1] flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs font-bold text-white">✓</span>
                </div>
                <div>
                  <p className="font-semibold">Partner Support</p>
                  <p className="text-sm text-gray-300">24/7 support, training, and resources for your success</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/delivery-sign-up"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#00A8E1] hover:bg-[#0087B8] text-white font-bold rounded transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A8E1]"
              >
                Apply to Deliver
                <AiOutlineArrowRight size={20} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gray-400 text-white font-bold rounded hover:border-white hover:bg-white/5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A8E1]"
              >
                Sign in to Account
              </Link>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00A8E1]/20 to-[#00A8E1]/5 rounded-2xl" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 rounded-2xl bg-[#00A8E1]/10 border-2 border-[#00A8E1] flex items-center justify-center mx-auto mb-4">
                    <svg className="w-16 h-16 text-[#00A8E1]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 6.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM9 6.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM3 12a2 2 0 110 4h2.5a1.5 1.5 0 001.5-1.5V12H3zm4 0v2.5a1.5 1.5 0 001.5 1.5H17a1.5 1.5 0 001.5-1.5V12H7zm13 0a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-300 font-semibold">Start delivering today</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DeliveryPortalHero
