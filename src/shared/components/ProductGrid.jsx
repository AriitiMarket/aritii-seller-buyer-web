import React from 'react'
import ProductCard from './ProductCard'

/**
 * Amazon-style responsive product grid.
 * 
 * Responsive breakpoints:
 * - Mobile: 1 column
 * - Tablet (sm): 2 columns
 * - Desktop (lg): 4 columns
 * - Large desktop (xl): 4 columns
 * 
 * Features:
 * - Consistent spacing and shadows
 * - Hover effects (slight scale, shadow increase)
 * - Proper gap sizing
 */
const ProductGrid = ({ products = [], variant = 'default', basePath = '', emptyState = null }) => {
  if (!products.length) {
    return emptyState || (
      <div className="flex items-center justify-center py-12 px-4">
        <p className="text-market-on-surface-variant text-body-md">No products found</p>
      </div>
    )
  }

  return (
    <div className="market-product-grid">
      {products.map((product) => (
        <ProductCard
          key={product._id || product.id}
          data={product}
          variant={variant}
          basePath={basePath}
        />
      ))}
    </div>
  )
}

export default ProductGrid
