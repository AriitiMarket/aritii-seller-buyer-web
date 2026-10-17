import React from 'react'
import { Link } from 'react-router-dom'
import { MdLocationOn } from 'react-icons/md'
import { useDeliveryLocation } from '@/shared/hooks/useDeliveryLocation'

/**
 * TopUtilityBar - Cross-portal navigation switcher
 * 
 * Positioned above MarketplaceHeader to provide:
 * - Location selector for delivery context
 * - Quick links to Seller Center and Delivery Center
 */
const TopUtilityBar = () => {
  const { cityName, zoneName } = useDeliveryLocation()

  const getLocationDisplay = () => {
    if (zoneName) return zoneName
    if (cityName) return cityName
    return 'Select location'
  }

  return (
    <div className="h-10 bg-[#131921] border-b border-[#232f3e] text-[#CCCCCB] text-sm">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Location Selector - Left */}
        <button
          className="flex items-center gap-2 hover:text-white transition-colors py-2 px-3 rounded hover:bg-[#232f3e]"
          title={`Deliver to: ${getLocationDisplay()}`}
        >
          <MdLocationOn size={16} />
          <span className="hidden sm:inline">Deliver to:</span>
          <span className="font-semibold">{getLocationDisplay()}</span>
        </button>

        {/* Portal Switcher - Right */}
        <nav className="flex items-center gap-6">
          <Link
            to="/seller"
            className="text-[#CCCCCB] hover:text-white transition-colors py-2 px-3 rounded hover:bg-[#232f3e] text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">Become a </span>Seller
          </Link>

          <Link
            to="/delivery-center"
            className="text-[#CCCCCB] hover:text-white transition-colors py-2 px-3 rounded hover:bg-[#232f3e] text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">Become a </span>Driver
          </Link>
        </nav>
      </div>
    </div>
  )
}

export default TopUtilityBar
