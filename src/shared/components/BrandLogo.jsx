import React from 'react';
import { LOGO } from '@/assets';

/**
 * BrandLogo — reusable Aritii Market logo.
 *
 * Uses the actual brand SVG asset so the login / register / header all share
 * one consistent mark. The asset is imported through `@/assets` (Vite bundles
 * it) rather than referenced as `/assets/...` from `public/`, which does not
 * exist and rendered a broken image.
 */
export default function BrandLogo({
  size = 'lg',
  showText = true,
  showTagline = true,
  tone = 'dark', // 'dark' | 'light'
}) {
  const heightMap = { sm: 'h-6', md: 'h-8', lg: 'h-10', xl: 'h-12' };
  const heightClass = heightMap[size] || heightMap.lg;
  const isLight = tone === 'light';

  return (
    <div className="flex items-center gap-2">
      <img
        src={LOGO}
        alt="Aritii Market"
        className={`${heightClass} w-auto`}
        aria-hidden="true"
      />
      {showText && (
        <div className="text-left">
          <span className={`text-base font-extrabold tracking-tight ${isLight ? 'text-white' : 'text-[#131921]'}`}>
            Aritii
          </span>
          {showTagline && (
            <span className="text-xs font-bold text-[#75d04b] tracking-widest uppercase ml-1">
              market
            </span>
          )}
        </div>
      )}
    </div>
  );
}
