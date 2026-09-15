import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import ShopCard from '../../../components/marketplace/ShopCard'

/**
 * Dashboard Shops Browse
 * Content only - no Header/Footer (dashboard layout handles that)
 * Used in /my-dashboard/marketplace/shops
 */
const DashboardShopsBrowse = () => {
  const { shops = [], isLoading, error } = useSelector((state) => state.shop)
  const [sortBy, setSortBy] = useState('rating')
  const [filteredShops, setFilteredShops] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let filtered = [...(shops || [])]

    if (sortBy === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    } else if (sortBy === 'newest') {
      filtered.reverse()
    } else if (sortBy === 'followers') {
      filtered.sort((a, b) => (b.followers || 0) - (a.followers || 0))
    }

    setFilteredShops(filtered)
    setLoaded(true)
  }, [sortBy, shops])

  return (
    <div>
      {/* Header */}
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Browse Sellers & Shops
        </h1>
        <p className="text-lg text-gray-600">
          Discover verified shops and sellers across Ethiopia
        </p>
      </div>

      {/* Filter Bar */}
      <div className="mb-8 flex justify-between items-center bg-white rounded-lg p-4 shadow-sm">
        <div className="text-gray-600 font-semibold">
          {filteredShops.length} Shops
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 md:px-4 py-2 md:py-2.5 border border-gray-300 rounded-lg font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm md:text-base"
        >
          <option value="rating">Rating (Highest)</option>
          <option value="newest">Newest</option>
          <option value="followers">Most Followers</option>
        </select>
      </div>

      {/* Shops Grid */}
      {isLoading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading shops…</p>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-600 mb-4">{error}</p>
        </div>
      ) : filteredShops.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredShops.map((shop) => (
            <ShopCard key={shop._id || shop.id} data={shop} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-gray-600 font-medium mb-2">No shops found</p>
          <p className="text-gray-500 text-sm">Check back later for new sellers</p>
        </div>
      )}
    </div>
  )
}

export default DashboardShopsBrowse
