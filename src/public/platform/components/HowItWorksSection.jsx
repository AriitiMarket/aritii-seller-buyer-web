import React from 'react';
import { Link } from 'react-router-dom';
import {
  AiOutlineSearch,
  AiOutlineShoppingCart,
  AiOutlineShop,
  AiOutlineCar,
  AiOutlineCheckCircle,
  AiOutlineArrowRight,
} from 'react-icons/ai';

/**
 * HowItWorksSection - the connected Aritii commerce flow.
 *
 * Shows the single journey every order takes across the three experiences:
 * Buyer discovers → Buyer orders → Seller prepares → Delivery service receives
 * assignment → Buyer receives order.
 */

const journeySteps = [
  {
    step: '01',
    actor: 'Buyer',
    title: 'Buyer discovers',
    description: 'Shoppers browse products, shops and deals to find what they need.',
    icon: AiOutlineSearch,
  },
  {
    step: '02',
    actor: 'Buyer',
    title: 'Buyer orders',
    description: 'They compare options and prices, then place the order securely.',
    icon: AiOutlineShoppingCart,
  },
  {
    step: '03',
    actor: 'Seller',
    title: 'Seller prepares',
    description: 'The shop confirms the order, packs the items and marks it ready.',
    icon: AiOutlineShop,
  },
  {
    step: '04',
    actor: 'Delivery',
    title: 'Delivery service receives assignment',
    description: 'The request is routed to a rider or provider with its route and zone.',
    icon: AiOutlineCar,
  },
  {
    step: '05',
    actor: 'Buyer',
    title: 'Buyer receives order',
    description: 'The buyer tracks the delivery and receives the order at their door.',
    icon: AiOutlineCheckCircle,
  },
];

const HowItWorksSection = () => {
  return (
    <section className="home-brand-section home-brand-section--flow py-12 md:py-16 bg-[#EAEDED] dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-12">
          <span className="inline-block px-3 py-1 mb-4 rounded-full bg-[#75d04b]/10 text-[#5ac12f] text-xs font-bold uppercase tracking-wider">
            One connected flow
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            How Aritii Works
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
            Aritii connects local commerce from selling to buying to delivery in one platform —
            every order follows the same simple journey.
          </p>
        </div>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 list-none">
          {journeySteps.map((item, index) => {
            const Icon = item.icon;
            return (
              <li
                key={item.step}
                className="relative flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                {/* Connector to the next step */}
                {index < journeySteps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="hidden lg:flex absolute -right-7 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white dark:bg-gray-900 border border-[#75d04b]/40 text-[#75d04b] items-center justify-center"
                  >
                    <AiOutlineArrowRight size={15} />
                  </span>
                )}

                <div className="flex items-center justify-between mb-3">
                  <span className="w-10 h-10 rounded-full bg-[#75d04b] text-white font-bold flex items-center justify-center text-sm">
                    {item.step}
                  </span>
                  <span className="w-10 h-10 rounded-xl bg-[#75d04b]/10 text-[#5ac12f] flex items-center justify-center">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                </div>

                <span className="self-start px-2.5 py-1 mb-2 rounded-full bg-gray-100 dark:bg-gray-800 text-[11px] font-bold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                  {item.actor}
                </span>

                <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5 text-sm md:text-base leading-snug">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </li>
            );
          })}
        </ol>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/products"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#75d04b] hover:bg-[#5ac12f] text-white font-semibold rounded-full text-base transition-colors text-center"
          >
            Shop Now
          </Link>
          <Link
            to="/seller-sign-up"
            className="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-full text-base border border-gray-300 dark:border-gray-600 transition-colors text-center"
          >
            Sell on Aritii
          </Link>
        </div>
      </div>
    </section>
  );
};

export { HowItWorksSection };
export default HowItWorksSection;
