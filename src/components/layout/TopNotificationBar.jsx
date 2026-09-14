import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5'

/**
 * TopNotificationBar Component
 * Premium announcement bar featuring:
 * - Dark Ethiopian green background
 * - OFFICIAL badge in brushed gold
 * - Aritii branding
 * - Dismissible with localStorage persistence
 */
const TopNotificationBar = () => {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem('topBarDismissed', 'true')
  }

  if (!isVisible) return null

  return (
    <aside className="bg-gradient-to-r from-brand-green-dark to-green-900 text-slate-200 text-xs border-b-2 border-brand-gold py-2 px-4 shadow-sm sticky top-0 z-[60]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        
        {/* Platform Tagline */}
        <div className="flex items-center gap-2 font-medium tracking-wider flex-shrink-0">
          {/* OFFICIAL Badge */}
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-brand-gold to-yellow-400 text-brand-green-dark shadow-md border border-yellow-300 whitespace-nowrap">
            ✓ OFFICIAL
          </span>
          
          {/* Aritii Name */}
          <span className="text-amber-50 text-xs font-semibold">
            🇪🇹 Aritii
          </span>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="hover:text-brand-gold transition-colors duration-200 p-1 rounded hover:bg-white/10"
          aria-label="Close"
        >
          <IoClose size={14} />
        </button>
      </div>
    </aside>
  )
}

export default TopNotificationBar
