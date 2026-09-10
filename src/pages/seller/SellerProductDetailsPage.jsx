import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getProductDetail } from '../../store/redux/actions/product.js'
import { ProductImage } from '../../components/common/ImageWithFallback.jsx'
import { getAvatarImage } from '../../utils/image.js'
import SellerLayout from '../../seller/SellerLayout.jsx'
import Loader from '../../components/common/Loader.jsx'

const SellerProductDetails = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { product, isLoading, error } = useSelector((state) => state.products)
  const [img, setImg] = useState(0)

  useEffect(() => {
    if (id) dispatch(getProductDetail(id))
  }, [id, dispatch])

  if (isLoading || !product) return <Loader />

  const images = (product.images && product.images.length) ? product.images : []
  const current = images[img] || images[0] || null

  return (
    <SellerLayout sidebarActive={3}>
        <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-Poppins font-semibold">Product Details</h1>
            <Link
              to="/dashboard-products"
              className="px-4 py-2 bg-[#3BC177] text-white rounded-md text-sm hover:bg-[#2ea763]"
            >
              ← Back to My Products
            </Link>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>}

          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6 flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2 flex flex-col items-center">
              <div className="w-full aspect-square rounded-md overflow-hidden border border-gray-200 bg-gray-50">
                {current ? (
                  <ProductImage
                    data={{ images: [current] }}
                    className="w-full h-full object-cover"
                    alt={product.name}
                  />
                ) : (
                  <ProductImage data={{ images: [] }} className="w-full h-full" alt={product.name} />
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {images.map((im, i) => (
                    <button
                      key={i}
                      onClick={() => setImg(i)}
                      className={`w-16 h-16 rounded-md overflow-hidden border-2 ${i === img ? 'border-[#3BC177]' : 'border-gray-200'}`}
                    >
                      <ProductImage
                        data={{ images: [im] }}
                        className="w-full h-full object-cover"
                        alt={product.name}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="md:w-1/2 space-y-3">
              <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
              <p className="text-gray-600">{product.description}</p>
              <div className="flex items-center gap-4 text-lg">
                <span className="text-[#f63b60] font-bold text-2xl">${product.discountPrice}</span>
                {product.originalPrice && (
                  <span className="text-gray-400 line-through">${product.originalPrice}</span>
                )}
              </div>
<div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded p-2"><span className="text-gray-500">Category:</span> {product.category}</div>
                <div className="bg-gray-50 rounded p-2"><span className="text-gray-500">Tags:</span> {product.tags || '—'}</div>
                <div className="bg-gray-50 rounded p-2"><span className="text-gray-500">Stock:</span> {product.stock}</div>
                <div className="bg-gray-50 rounded p-2"><span className="text-gray-500">Sold:</span> {product.sold_out || 0}</div>
              </div>

              {product.shop && (
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <img
                    src={getAvatarImage(product.shop.avatar)}
                    alt={product.shop.name}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => { e.currentTarget.src = '/assets/product-placeholder.svg'; }}
                  />
                  <div>
                    <Link to={`/shops/${product.shop._id}`} className="text-[#3BC177] font-medium hover:underline">
                      {product.shop.name}
                    </Link>
                    <p className="text-xs text-gray-400">Seller on Aritii Market</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => navigate(`/dashboard-edit-product/${product._id}`)}
                  className="px-5 py-2.5 bg-[#3BC177] text-white rounded-md font-medium hover:bg-[#2ea763]"
                >
                  Edit Product
                </button>
                <Link
                  to={`/product/${product._id}`}
                  className="px-5 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  View in Marketplace
                </Link>
              </div>
            </div>
          </div>
    </SellerLayout>
  )
}

export default SellerProductDetails