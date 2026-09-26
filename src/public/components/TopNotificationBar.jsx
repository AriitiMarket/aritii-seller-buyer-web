import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5'

const TopNotificationBar = () => {
  const [isVisible, setIsVisible] = useState(() => {
    try {
      return localStorage.getItem('topBarDismissed') !== 'true'
    } catch {
      return true
    }
  })

  const handleClose = () => {
    setIsVisible(false)
    try {
      localStorage.setItem('topBarDismissed', 'true')
    } catch {
      // Storage unavailable / blocked
    }
  }

  if (!isVisible) return null

  return (
    <aside className="bg-[#141414] text-gray-300 text-xs border-b-2 border-[#75d04b] py-2 px-4 shadow-sm sticky top-0 z-[60]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        
        {/* Promotional Content */}
        <div className="flex items-center gap-3 font-medium flex-wrap">
          <span>🔥 Free delivery on your first order</span>
          <span>Sign up today and get 10% off</span>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="hover:text-[#75d04b] transition-colors duration-200 p-1 rounded hover:bg-white/10"
          aria-label="Close"
        >
          <IoClose size={14} />
        </button>
      </div>
    </aside>
  )
}

export default TopNotificationBar
