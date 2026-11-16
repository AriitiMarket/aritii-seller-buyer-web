import React from 'react';
import { AiOutlineCheck } from 'react-icons/ai';

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
  ];

  return (
    <div className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-6 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Mobile view: vertical steps */}
        <div className="block md:hidden">
          <div className="space-y-4">
            {steps.map((step) => {
              const isActive = step.number === active;
              const isCompleted = step.number < active;
              
              return (
                <div key={step.number} className="flex items-center gap-3">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    isCompleted || isActive
                      ? 'bg-[#75d04b] text-white ring-2 ring-[#75d04b]/30'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}>
                    {isCompleted ? <AiOutlineCheck size={20} /> : step.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold transition-colors ${
                      isActive
                        ? 'text-[#75d04b]'
                        : isCompleted
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {step.label}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop view: horizontal steps */}
        <div className="hidden md:flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = step.number === active;
            const isCompleted = step.number < active;
            
            return (
              <div key={step.number} className="flex-1 flex items-center">
                {/* Step circle */}
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    isCompleted || isActive
                      ? 'bg-[#75d04b] text-white ring-2 ring-[#75d04b]/40 ring-offset-2 dark:ring-offset-gray-900 shadow-sm'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}>
                    {isCompleted ? <AiOutlineCheck size={24} /> : step.number}
                  </div>
                  <p className={`text-xs font-semibold mt-2 text-center transition-colors ${
                    isActive
                      ? 'text-[#75d04b]'
                      : isCompleted
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 text-center">{step.description}</p>
                </div>

                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-1 mx-4 transition-colors bg-gray-200 dark:bg-gray-700 mt-0 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isCompleted ? 'bg-[#75d04b]' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                      style={{
                        width: isCompleted ? '100%' : '0%'
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CheckOutSteps;
