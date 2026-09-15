import React from 'react'
import { mockEvents } from '../../data/mockData'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'

const EventsMarketplace = () => {
  const formatCountdown = (endDate) => {
    const now = new Date()
    const diff = endDate - now
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    return `${days}d ${hours}h`
  }

  return (
    <div className="min-h-screen bg-white">
      <Header activeHeading={2} />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Promotions & Events</h1>
        <p className="text-slate-600 mb-12">Don't miss our upcoming sales and special offers</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockEvents.map(event => (
            <div key={event.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img src={event.image} alt={event.name} className="w-full h-48 object-cover" />
                <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full font-bold">
                  -{event.discount}%
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="font-bold text-lg text-slate-900 mb-2">{event.name}</h3>
                <p className="text-slate-600 text-sm mb-4">{event.description}</p>
                
                <div className="mb-4 pb-4 border-b border-slate-200">
                  <p className="text-xs text-slate-600 mb-1">Ends in:</p>
                  <p className="font-bold text-lg text-red-600">{formatCountdown(event.endDate)}</p>
                </div>

                <p className="text-sm text-slate-600 mb-4">{event.participatingShops} shops participating</p>
                
                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-colors">
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default EventsMarketplace
