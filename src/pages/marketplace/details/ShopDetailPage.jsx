import React from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Header from '../../../components/layout/Header'
import Footer from '../../../components/layout/Footer'

const ShopDetailPage = () => {
  const { id } = useParams()
  const shopState = useSelector(state => state.shop)
  const { shops: allShops = [] } = shopState || {}
  const shop = allShops?.find(s => s._id === id) || allShops?.[0]

  if (!shop) return <div className="min-h-screen"><Header /><div className="text-center py-12"><p>Shop not found</p></div><Footer /></div>

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12">
        <div className="bg-slate-100 h-40 rounded-lg mb-8 -mt-8 mx-0"></div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <img src={shop.image || 'https://via.placeholder.com/300x300'} alt={shop.shopName} className="w-full rounded-lg" />
          </div>

          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{shop.shopName || shop.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-bold text-yellow-500">★{shop.rating || 4.5}</span>
              <span className="text-slate-600">({shop.totalReviews || 0} reviews)</span>
              {shop.isVerified && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold text-sm">✓ Verified</span>}
            </div>

            <p className="text-slate-700 mb-6">{shop.description}</p>

            <div className="grid grid-cols-3 gap-4 mb-8 pb-8 border-b border-slate-200">
              <div>
                <p className="text-slate-600 text-sm">Products</p>
                <p className="font-bold text-2xl">{shop.productCount || shop.products?.length || 0}</p>
              </div>
              <div>
                <p className="text-slate-600 text-sm">Followers</p>
                <p className="font-bold text-2xl">{shop.followers || 0}+</p>
              </div>
              <div>
                <p className="text-slate-600 text-sm">Joined</p>
                <p className="font-bold text-slate-900">2023</p>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg">Follow Shop</button>
              <button className="w-full border-2 border-blue-600 text-blue-600 font-bold py-3 rounded-lg hover:bg-blue-50">View All Products</button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ShopDetailPage
