import React from 'react'
import { Link } from 'react-router-dom'

const BrandLogo = ({ size = 'md', showText = true, showTagline = true, linked = true, to = '/', tone = 'default' }) => {
  const sizes = {
    sm: { box: 'w-8 h-8 text-sm', text: 'text-sm' },
    md: { box: 'w-10 h-10 text-base', text: 'text-base' },
    lg: { box: 'w-12 h-12 text-lg', text: 'text-lg' },
  }

  const s = sizes[size] || sizes.md

  const content = (
    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 group flex-shrink-0">
      {/* 'A' Monogram */}
      <div
        className={`${s.box} rounded-full bg-[#141414] text-white font-extrabold border-2 border-[#75d04b] flex items-center justify-center flex-shrink-0`}
      >
        <span>A</span>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col leading-tight min-w-0">
          <span className={`font-extrabold ${tone === 'light' ? 'text-white' : 'text-[#141414] dark:text-white'} text-sm leading-tight truncate`}>
            aritii
          </span>
          <span className={`text-[10px] font-semibold ${tone === 'light' ? 'text-white/85' : 'text-[#75d04b]'} tracking-widest leading-tight truncate`}>
            MARKET
          </span>
          {showTagline && (
            <span className={`hidden sm:block text-[10px] ${tone === 'light' ? 'text-white/70' : 'text-gray-500'} truncate`}>
              Ethiopia&apos;s Marketplace
            </span>
          )}
        </div>
      )}
    </div>
  )

  if (linked) {
    return <Link to={to}>{content}</Link>
  }
  return content
}

export default BrandLogo
