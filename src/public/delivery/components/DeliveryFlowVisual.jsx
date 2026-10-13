/**
 * DeliveryFlowVisual - Visual delivery flow component
 * 
 * Shows the 6-step delivery process: Order → Request → Assignment → Route → Delivery → Customer
 */

import React from 'react';
import { AiOutlineArrowRight } from 'react-icons/ai';

const DeliveryFlowVisual = () => {
  const flowSteps = [
    {
      step: '1',
      title: 'Order confirmed',
      description: 'A buyer completes checkout and the seller confirms and packs the order.',
    },
    {
      step: '2',
      title: 'Delivery request',
      description: 'The packed order raises a delivery request on the network with pickup and drop-off details.',
    },
    {
      step: '3',
      title: 'Assignment',
      description: 'A rider or provider is assigned the request — Aritii Delivery or a trusted external provider.',
    },
    {
      step: '4',
      title: 'Route & zone',
      description: 'The assignment carries its route and delivery zone/sector so the rider runs an efficient path.',
    },
    {
      step: '5',
      title: 'Delivery',
      description: 'The rider completes the drop-off and the delivery is marked done.',
    },
    {
      step: '6',
      title: 'Customer notified',
      description: 'The buyer follows live status the whole way and gets their order at the door.',
    },
  ];

  return (
    <div>
      <div className="text-center mb-10 md:mb-12">
        <span className="inline-block px-3 py-1 mb-4 rounded-full bg-[#2563eb]/10 text-[#2563eb] text-xs font-bold uppercase tracking-wider">
          The delivery flow
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Order → Delivery Request → Assignment → Route/Zone → Delivery → Customer
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
          Every order on Aritii follows the same connected delivery path.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {flowSteps.map((item, index) => (
          <div
            key={item.title}
            className="relative flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
          >
            {index < flowSteps.length - 1 && (
              <span
                aria-hidden="true"
                className="hidden lg:flex absolute -right-[26px] top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white dark:bg-gray-900 border text-[#2563eb] items-center justify-center shadow-sm"
                style={{ borderColor: '#2563eb66' }}
              >
                <AiOutlineArrowRight size={14} />
              </span>
            )}
            <div className="flex items-center gap-3 mb-3">
              <span className="w-10 h-10 rounded-xl bg-[#2563eb]/10 text-[#2563eb] flex items-center justify-center">
                {index + 1}
              </span>
              <span className="text-xs font-bold text-gray-400 dark:text-gray-500">
                STEP {String(index + 1).padStart(2, '0')}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryFlowVisual;
