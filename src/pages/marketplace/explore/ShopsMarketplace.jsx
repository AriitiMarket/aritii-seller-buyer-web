import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Header from '../../../components/layout/Header'
import Footer from '../../../components/layout/Footer'
import ShopCard from '../../../components/marketplace/ShopCard'
import styles from '../../../styles/styles'

const ShopsMarketplace = () => {
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
      <Header activeHeading={4} />

      <div className={`${styles.section}`}>
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
            className="px-3 md:px-4 py-2 md:py-2.5 border border-gray-300 rounded-lg font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
          >
            <option value="rating">Rating (Highest)</option>
            <option value="newest">Newest</option>
            <option value="followers">Most Followers</option>
          </select>
        </div>

        {/* Shops Grid */}
        {isLoading && !loaded && filteredShops.length === 0 ? (
          <div className="text-center py-10 md:py-16 text-gray-600">
            Loading shops…
          </div>
        ) : filteredShops && filteredShops.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6 mb-12">
            {filteredShops.map((shop, index) => (
              <ShopCard data={shop} key={shop._id || index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 md:py-16 bg-white rounded-lg">
            <p className="text-lg text-gray-600">
              {error 
                ? 'Could not load shops. Please try again.' 
                : 'No shops available yet. Be the first to sell on Aritii Market!'}
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default ShopsMarketplace
