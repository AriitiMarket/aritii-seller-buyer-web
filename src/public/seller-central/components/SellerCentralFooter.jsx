import React from 'react'
import { Link } from 'react-router-dom'

/**
 * SellerCentralFooter - Independent seller footer
 * 
 * Amazon-inspired dark footer with seller-specific links
 */
const SellerCentralFooter = () => {
  return (
    <footer className="bg-[#131921] text-[#CCCCCB] mt-16 border-t border-[#232f3e]">
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
                  to="/seller-sign-up"
                  className="text-[#CCCCCB] hover:text-white transition-colors duration-150"
                >
                  Start Selling
                </Link>
              </li>
              <li>
                <a
                  href="#how-to-sell"
                  className="text-[#CCCCCB] hover:text-white transition-colors duration-150"
                >
                  How to Sell
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-[#CCCCCB] hover:text-white transition-colors duration-150"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#resources"
                  className="text-[#CCCCCB] hover:text-white transition-colors duration-150"
                >
                  Resources
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Policies */}
          <div>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wide">
              Policies & Terms
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-[#CCCCCB] hover:text-white transition-colors duration-150"
                >
                  Seller Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-[#CCCCCB] hover:text-white transition-colors duration-150"
                >
                  Privacy Notice
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-[#CCCCCB] hover:text-white transition-colors duration-150"
                >
                  Fee Schedule
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-[#CCCCCB] hover:text-white transition-colors duration-150"
                >
                  Seller Code of Conduct
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
                  Help & Support
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-[#CCCCCB] hover:text-white transition-colors duration-150"
                >
                  Seller Central
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
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Aritii */}
          <div>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wide">
              Aritii Market
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
                  Careers
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
                  Press
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-[#232f3e] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#CCCCCB]">© 2026 Aritii Market</span>
          </div>

          {/* Seller Account Link */}
          <Link
            to="/login"
            className="text-sm text-[#FF9900] hover:text-[#FFB84D] font-medium transition-colors duration-150"
          >
            Sign in to your Seller Central account
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default SellerCentralFooter
