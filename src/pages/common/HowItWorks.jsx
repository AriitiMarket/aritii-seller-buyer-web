import React, { useState } from 'react'
import { howItWorksSteps } from '../../data/mockData'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'

const HowItWorks = () => {
  const [activeRole, setActiveRole] = useState('buyers')
  const steps = howItWorksSteps[activeRole]

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">How Aritii Works</h1>
        
        <div className="flex gap-4 mb-12">
          <button onClick={() => setActiveRole('buyers')} className={`px-6 py-2 font-semibold rounded-lg ${activeRole === 'buyers' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-900'}`}>👥 For Buyers</button>
          <button onClick={() => setActiveRole('sellers')} className={`px-6 py-2 font-semibold rounded-lg ${activeRole === 'sellers' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-900'}`}>🏪 For Sellers</button>
          <button onClick={() => setActiveRole('riders')} className={`px-6 py-2 font-semibold rounded-lg ${activeRole === 'riders' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-900'}`}>🚴 For Riders</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map(step => (
            <div key={step.step} className="text-center">
              <div className="text-5xl mb-4">{step.icon}</div>
              <div className="bg-blue-100 text-blue-600 font-bold rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">{step.step}</div>
              <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-slate-600 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default HowItWorks
