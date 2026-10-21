import React from 'react'
import { AiOutlineCheck } from 'react-icons/ai'

/**
 * CheckoutSteps - step progress indicator for the checkout flow.
 * 
 * Steps:
 * - active=1: Address (current)
 * - active=2: Payment (current)
 * - active=3: Confirmation (success)
 */
const CheckOutSteps = ({ active = 1 }) => {
  const steps = [
    { number: 1, label: 'Delivery Address', description: 'Where to deliver' },
    { number: 2, label: 'Payment', description: 'Choose payment method' },
    { number: 3, label: 'Confirmation', description: 'Order confirmed' },
  ]

  return (
    <div className="w-full bg-white border-b border-gray-200 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Mobile view: vertical steps */}
        <div className="block md:hidden">
          <div className="space-y-4">
            {steps.map((step, _index) => {
              const isActive = step.number === active
              const isCompleted = step.number < active
              
              return (
                <div key={step.number} className="flex items-center gap-3">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    isCompleted
                      ? 'bg-green-100 text-green-700'
                      : isActive
                      ? 'bg-market-primary text-market-on-primary ring-2 ring-[#2162a1] ring-offset-2'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {isCompleted ? <AiOutlineCheck size={20} /> : step.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold transition-colors ${
                      isActive ? 'text-market-secondary' : isCompleted ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Desktop view: horizontal steps */}
        <div className="hidden md:flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = step.number === active
            const isCompleted = step.number < active
            
            return (
              <div key={step.number} className="flex-1 flex items-center">
                {/* Step circle */}
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    isCompleted
                      ? 'bg-green-100 text-green-700 ring-2 ring-green-200'
                      : isActive
                      ? 'bg-market-primary text-market-on-primary ring-2 ring-[#2162a1] ring-offset-2'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {isCompleted ? <AiOutlineCheck size={24} /> : step.number}
                  </div>
                  <p className={`text-xs font-semibold mt-2 text-center transition-colors ${
                    isActive ? 'text-market-secondary' : isCompleted ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 text-center">{step.description}</p>
                </div>

                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-1 mx-4 transition-colors bg-gray-200 mt-0">
                    <div className={`h-full transition-all ${
                      isCompleted || (isActive && step.number < active)
                        ? 'bg-green-500'
                        : isActive
                        ? 'bg-[#2162a1]'
                        : 'bg-gray-200'
                    }`} style={{
                      width: isCompleted || (isActive && step.number < active) ? '100%' : '0%'
                    }} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CheckOutSteps