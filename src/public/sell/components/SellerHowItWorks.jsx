/**
 * SellerHowItWorks - Step-by-step seller onboarding process
 * 
 * Shows the 4-step process: Create Account → Apply → Get Approved → Start Selling
 */

import React from 'react';
import { AiOutlineArrowRight } from 'react-icons/ai';

const SellerHowItWorks = () => {
  const steps = [
    {
      step: '01',
      title: 'Create your account',
      description: 'Sign up free — one account lets you buy and sell on Aritii.',
    },
    {
      step: '02',
      title: 'Apply as a seller',
      description: 'Tell us about your business and shop. It takes a few minutes.',
    },
    {
      step: '03',
      title: 'Get approved',
      description: 'The Aritii team reviews your application, usually within days.',
    },
    {
      step: '04',
      title: 'List and sell',
      description: 'Add products, receive orders, and watch delivery bring them to customers.',
    },
  ];

  return (
    <div>
      <div className="text-center mb-10 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          From sign-up to first sale
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
          Four steps between your business and its first Aritii order.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {steps.map((item) => (
          <div
            key={item.step}
            className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
          >
            <span
              className="inline-flex w-10 h-10 items-center justify-center rounded-full text-white font-bold text-sm mb-4"
              style={{ backgroundColor: '#2f6e4f' }}
            >
              {item.step}
            </span>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerHowItWorks;
