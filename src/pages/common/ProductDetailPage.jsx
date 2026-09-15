import React from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'

const ProductDetailPage = () => {
  const { id } = useParams()
  const productState = useSelector(state => state.product)
  const { allProducts = [] } = productState || {}
  const product = allProducts?.find(p => p._id === id) || allProducts?.[0]

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-lg text-slate-600">Product not found</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Product Image */}
          <div>
            <img 
              src={product.image || product.image_Url?.[0]?.url || 'https://via.placeholder.com/500x500?text=Product'} 
              alt={product.name} 
              className="w-full rounded-lg" 
            />
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">★</span>
                <span className="font-bold text-slate-900">{product.rating || 4.5}</span>
                <span className="text-slate-600">({product.reviews || 0} reviews)</span>
              </div>
            </div>

            <div className="mb-6 pb-6 border-b border-slate-200">
              <div className="text-4xl font-bold text-slate-900 mb-2">{product.price} Birr</div>
              {product.originalPrice && (
                <span className="text-lg text-slate-500 line-through">{product.originalPrice} Birr</span>
              )}
            </div>

            <div className="mb-6">
              <p className="text-slate-600 mb-2"><strong>Seller:</strong> {product.shop || product.seller}</p>
              <p className="text-slate-600 mb-2"><strong>Category:</strong> {product.category}</p>
              <p className="text-slate-600"><strong>Status:</strong> <span className="text-green-600 font-semibold">{product.inStock ? 'In Stock' : 'Out of Stock'}</span></p>
            </div>

            <div className="space-y-3">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
                Add to Cart
              </button>
              <button className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 rounded-lg transition-colors">
                Add to Wishlist
              </button>
            </div>

            <div className="mt-8 p-6 bg-slate-50 rounded-lg">
              <h3 className="font-bold text-slate-900 mb-4">About this product</h3>
              <p className="text-slate-600">{product.description || 'This is a premium authentic product from our verified seller. All items are checked for quality before shipping.'}</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ProductDetailPage
