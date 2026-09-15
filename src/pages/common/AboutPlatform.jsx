import React from 'react'
import { platformAboutInfo, mockPlatformStats } from '../../data/mockData'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'

const AboutPlatform = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">About Aritii Market</h1>
        <p className="text-lg text-slate-600 mb-12">Ethiopia's Unified Commerce Ecosystem</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h2>
            <p className="text-slate-700 mb-6">{platformAboutInfo.mission}</p>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h2>
            <p className="text-slate-700">{platformAboutInfo.vision}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">By The Numbers</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-3xl font-bold text-blue-600">{mockPlatformStats.totalTransactions}</div>
                <p className="text-sm text-slate-600 mt-2">Total Transactions</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">{mockPlatformStats.gmv}</div>
                <p className="text-sm text-slate-600 mt-2">GMV (90 Days)</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">{mockPlatformStats.satisfaction}</div>
                <p className="text-sm text-slate-600 mt-2">Customer Satisfaction</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">{mockPlatformStats.coverage}</div>
                <p className="text-sm text-slate-600 mt-2">Regional Coverage</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {platformAboutInfo.values.map((value, idx) => (
              <div key={idx} className="bg-slate-50 p-6 rounded-lg text-center">
                <p className="font-bold text-slate-900">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default AboutPlatform
