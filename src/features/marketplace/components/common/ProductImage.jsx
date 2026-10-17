/**
 * ProductImage - Product image component
 * Displays product image with placeholder
 */
import React from 'react'
import { getFirstImage } from '@/shared/utils/image'
import { PlaceholderProduct } from '@/assets'

const ProductImage = ({ data, src, alt, className }) => {
  const resolved = src || getFirstImage(data) || PlaceholderProduct
  return (
    <img
      src={resolved}
      alt={alt || data?.name || 'Product image'}
      className={`w-full h-48 rounded-xl object-cover ${className || ''}`}
    />
  )
}

export default ProductImage