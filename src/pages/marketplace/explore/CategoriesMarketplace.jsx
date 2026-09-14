import React from 'react'
import { Link } from 'react-router-dom'
import { mockCategories } from '../../../data/mockData'
import Header from '../../../components/layout/Header'
import Footer from '../../../components/layout/Footer'

const CategoriesMarketplace = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header activeHeading={2} />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Shop by Category</h1>
        <p className="text-slate-600 mb-12">Browse our collection by category</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {mockCategories.map(category => (
            <Link 
              key={category.id} 
              to={`/explore/products?category=${category.name}`}
            >
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
                <div className="text-5xl mb-3">{category.icon}</div>
                <h3 className="font-bold text-slate-900 mb-2">{category.name}</h3>
                <p className="text-sm text-slate-600">{category.count} products</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default CategoriesMarketplace
