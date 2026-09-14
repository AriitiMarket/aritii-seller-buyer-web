import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams, Link } from 'react-router-dom'
import Header from '../../../components/layout/Header'
import Footer from '../../../components/layout/Footer'
import ProductCard from '../../../components/marketplace/ProductCard'
import styles from '../../../styles/styles'

const ProductsMarketplace = () => {
  const [searchParams] = useSearchParams()
  const { allProducts, isLoading } = useSelector((state) => state.products)
  const categoryData = searchParams.get('category')
  const shopData = searchParams.get('shop')
  
  const [filteredProducts, setFilteredProducts] = useState([])
  const [sortBy, setSortBy] = useState('newest')
  const [loaded, setLoaded] = useState(false)

  // Get unique categories from products
  const categories = allProducts 
    ? ['All', ...new Set(allProducts.map(p => p.category || 'Other'))]
    : ['All']

  useEffect(() => {
    const productsSource = allProducts || []
    
    let filtered = [...productsSource]

    // Filter by category or shop
    if (categoryData) {
      filtered = filtered.filter(p => (p.category || '').toLowerCase() === categoryData.toLowerCase())
    } else if (shopData) {
      filtered = filtered.filter(p => {
        const shopName = p?.shop?.name || p?.shopName || ''
        return shopName.toLowerCase() === shopData.toLowerCase()
      })
    }

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0))
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0))
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    } else {
      // newest - default order
      filtered.sort((a, b) => {
        const aSold = a.sold_out ?? a.total_sell ?? 0
        const bSold = b.sold_out ?? b.total_sell ?? 0
        return aSold - bSold
      })
    }

    setFilteredProducts(filtered)
    setLoaded(true)
  }, [allProducts, categoryData, shopData, sortBy])

  return (
    <div>
      <Header activeHeading={2} />
      
      <div className={`${styles.section}`}>
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Browse Products
          </h1>
          <p className="text-lg text-gray-600">
            Discover authentic products from verified sellers across Ethiopia
          </p>
        </div>

        {/* Categories Section */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4 md:mb-6">Shop by Category</h2>
          <div className="flex overflow-x-auto gap-2 md:gap-3 pb-4">
            {categories.map(category => (
              <Link
                key={category}
                to={category === 'All' ? '/explore/products' : `/explore/products?category=${category}`}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold whitespace-nowrap transition-all ${
                  (category === 'All' && !categoryData) || category === categoryData
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-400'
                }`}
              >
                {category}
              </Link>
            ))}
          </div>
        </div>

        {/* Sort & Filter Bar */}
        <div className="mb-8 flex justify-between items-center bg-white rounded-lg p-4 shadow-sm">
          <div className="text-gray-600 font-semibold">
            {filteredProducts.length} Products
          </div>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 md:px-4 py-2 md:py-2.5 border border-gray-300 rounded-lg font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {/* Products Grid */}
        {isLoading && !loaded && filteredProducts.length === 0 ? (
          <div className="text-center py-10 md:py-16 text-gray-600">
            Loading products…
          </div>
        ) : filteredProducts && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5 xl:gap-7 mb-12">
            {filteredProducts.map((product, index) => (
              <ProductCard data={product} key={product._id || index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 md:py-16 bg-white rounded-lg">
            <p className="text-lg text-gray-600 mb-4">
              No products found{categoryData ? ` in "${categoryData}"` : ''}
            </p>
            <Link
              to="/explore/products"
              className="px-4 md:px-6 py-2 md:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-sm md:text-base inline-block"
            >
              View All Products
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default ProductsMarketplace
