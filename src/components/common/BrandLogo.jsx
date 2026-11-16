import React from 'react';
import { Link } from 'react-router-dom';
import { LOGO } from '@/assets';

/**
 * BrandLogo — single canonical Aritii Market logo component.
 *
 * Supports both brand SVG asset and monogram rendering across headers,
 * login modals, provider consoles, and footer.
 */
export default function BrandLogo({
  size = 'md',
  showText = true,
  showTagline = true,
  linked = true,
  to = '/',
  tone = 'default', // 'default' | 'light' | 'dark'
  variant = 'monogram', // 'monogram' | 'asset'
  className = '',
}) {
  const isLight = tone === 'light';

  // Sizing definitions
  const sizes = {
    sm: { box: 'w-8 h-8 text-sm', img: 'h-6', text: 'text-sm' },
    md: { box: 'w-10 h-10 text-base', img: 'h-8', text: 'text-base' },
    lg: { box: 'w-12 h-12 text-lg', img: 'h-10', text: 'text-lg' },
    xl: { box: 'w-14 h-14 text-xl', img: 'h-12', text: 'text-xl' },
  };

  const s = sizes[size] || sizes.md;

  const content = (
    <div className={`flex items-center gap-1.5 sm:gap-2 md:gap-3 group flex-shrink-0 ${className}`}>
      {variant === 'asset' ? (
        <img
          src={LOGO}
          alt="Aritii Market"
          className={`${s.img} w-auto`}
          aria-hidden="true"
        />
      ) : (
        /* 'A' Monogram */
        <div
          className={`${s.box} rounded-full bg-[#141414] text-white font-extrabold border-2 border-[#75d04b] flex items-center justify-center flex-shrink-0`}
        >
          <span>A</span>
        </div>
      )}

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col leading-tight min-w-0 text-left">
          <span
            className={`font-extrabold ${
              isLight ? 'text-white' : 'text-[#141414] dark:text-white'
            } text-sm leading-tight truncate`}
          >
            aritii
          </span>
          <span
            className={`text-[10px] font-semibold ${
              isLight ? 'text-white/85' : 'text-[#75d04b]'
            } tracking-widest leading-tight truncate uppercase`}
          >
            MARKET
          </span>
          {showTagline && (
            <span
              className={`hidden sm:block text-[10px] ${
                isLight ? 'text-white/70' : 'text-gray-500'
              } truncate`}
            >
              Ethiopia&apos;s Marketplace
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (linked) {
    return <Link to={to}>{content}</Link>;
  }
  return content;
}
