import React from 'react'
import { Link } from 'react-router-dom'

/**
 * BrandLogo - Shared Aritii Market logo component
 * Renders the 'A' monogram + brand text
 *
 * Props:
 * - size: 'sm' | 'md' | 'lg' (default: 'md')
 * - showText: boolean (default: true)
 * - showTagline: boolean (default: true)
 * - linked: boolean - wrap in Link to home (default: true)
 */
const BrandLogo = ({ size = 'md', showText = true, showTagline = true, linked = true }) => {
  const sizes = {
    sm: { box: 'w-8 h-8', text: 'text-xs', brand: 'text-sm', tagline: 'text-[10px]' },
    md: { box: 'w-9 h-9 sm:w-10 sm:h-10', text: 'text-xs sm:text-sm', brand: 'text-sm sm:text-base md:text-lg', tagline: 'text-xs' },
    lg: { box: 'w-10 h-10 lg:w-12 lg:h-12', text: 'text-sm md:text-base', brand: 'text-base md:text-xl', tagline: 'text-xs md:text-sm' },
  }

  const s = sizes[size] || sizes.md

  const content = (
    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 group flex-shrink-0">
      {/* 'A' Monogram */}
      <div
        className={`${s.box} rounded-full bg-gradient-to-br from-[#052919] to-green-700 flex items-center justify-center shadow-md border-2 border-[#E5A93C] group-hover:shadow-lg transition-shadow flex-shrink-0`}
      >
        <span className={`text-white font-bold ${s.text}`}>A</span>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col leading-tight min-w-0">
          <span className={`${s.brand} font-bold text-[#052919] group-hover:text-[#E5A93C] transition-colors truncate`}>
            Aritii Market
          </span>
          {showTagline && (
            <span className={`${s.tagline} hidden sm:block text-[#052919] font-medium`}>
              Ethiopia&apos;s Marketplace
            </span>
          )}
        </div>
      )}
    </div>
  )

  if (linked) {
    return <Link to="/">{content}</Link>
  }
  return content
}

export default BrandLogo
