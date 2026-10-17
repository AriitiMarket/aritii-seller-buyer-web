import React from 'react'
import { Link } from 'react-router-dom'

/**
 * DeliveryPortalFooter - Independent delivery footer
 * 
 * Logistics and delivery partner-specific links
 */
const DeliveryPortalFooter = () => {
  return (
    <footer className="bg-[#131921] text-[#CCCCCB] mt-16 border-t border-[#232F3E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footer Content */}
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Column 1: Getting Started */}
          <div>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wide">
              Getting Started
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/delivery-sign-up"
                  className="text-[#CCCCCB] hover:text-white transition-colors duration-150"
                >
                  Apply to Deliver
                </Link>
              </li>
              <li>
                <a
                  href="#ways-to-deliver"
                  className="text-[#CCCCCB] hover:text-white transition-colors duration-150"
                >
                  Ways to Deliver
                </a>
              </li>
              <li>
                <a
                  href="#vehicle-requirements"
                  className="text-[#CCCCCB] hover:text-white transition-colors duration-150"
                >
                  Vehicle Requirements
                </a>
              </li>
              <li>
                <a
                  href="#earnings"
                  className="text-[#CCCCCB] hover:text-white transition-colors duration-150"
                >
                  Earnings & Pay
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Policies & Safety */}
          <div>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wide">
              Policies & Safety
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-[#CCCCCB] hover:text-white transition-colors duration-150"
                >
                  Delivery Partner Terms
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-[#CCCCCB] hover:text-white transition-colors duration-150"
                >
                  Safety Guidelines
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-[#CCCCCB] hover:text-white transition-colors duration-150"
                >
                  Background Checks
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-[#CCCCCB] hover:text-white transition-colors duration-150"
                >
                  Insurance Information
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wide">
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-[#CCCCCB] hover:text-white transition-colors duration-150"
                >
                  Partner Support
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-[#CCCCCB] hover:text-white transition-colors duration-150"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-[#CCCCCB] hover:text-white transition-colors duration-150"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-[#CCCCCB] hover:text-white transition-colors duration-150"
                >
                  Driver Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wide">
              About Aritii
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-[#CCCCCB] hover:text-white transition-colors duration-150"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-[#CCCCCB] hover:text-white transition-colors duration-150"
                >
                  Our Mission
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-[#CCCCCB] hover:text-white transition-colors duration-150"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-[#CCCCCB] hover:text-white transition-colors duration-150"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-[#232F3E] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#CCCCCB]">© 2026 Aritii Market</span>
          </div>

          {/* Partner Account Link */}
          <Link
            to="/login"
            className="text-sm text-[#00A8E1] hover:text-[#5FD4F0] font-medium transition-colors duration-150"
          >
            Sign in to Delivery Center
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default DeliveryPortalFooter
