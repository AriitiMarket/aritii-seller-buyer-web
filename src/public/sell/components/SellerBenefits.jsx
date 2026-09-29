/**
 * SellerBenefits - Benefits section for seller experience
 * 
 * Highlights the key benefits of selling on Aritii
 */

import React from 'react';
import { AiOutlineCheck } from 'react-icons/ai';

const SellerBenefits = () => {
  const benefits = [
    {
      icon: AiOutlineCheck,
      title: 'Reach ready buyers',
      description: 'Your shop appears in front of buyers actively searching for products like yours across Ethiopia.',
    },
    {
      icon: AiOutlineCheck,
      title: 'Simple product management',
      description: 'Create products, set prices and stock, and publish them to the marketplace in minutes.',
    },
    {
      icon: AiOutlineCheck,
      title: 'One business workspace',
      description: 'Products, orders, inventory, promotions and analytics — managed from a single seller dashboard.',
    },
    {
      icon: AiOutlineCheck,
      title: 'Direct buyer conversations',
      description: 'Answer questions and handle order details with buyers through built-in messaging.',
    },
    {
      icon: AiOutlineCheck,
      title: 'Delivery connected',
      description: 'Every fulfilled order connects to the Aritii delivery network — you sell, delivery moves it.',
    },
    {
      icon: AiOutlineCheck,
      title: 'Sales insights',
      description: 'Track what sells, when it sells, and how your shop is growing with built-in reporting.',
    },
  ];

  return (
    <div>
      <div className="text-center mb-10 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Why Sell on Aritii?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
          Everything your shop needs to find customers and fulfil orders — in one connected platform.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {benefits.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              <span className="w-11 h-11 mb-4 rounded-xl bg-[#2f6e4f]/10 text-[#2f6e4f] flex items-center justify-center">
                <Icon size={22} />
              </span>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SellerBenefits;
