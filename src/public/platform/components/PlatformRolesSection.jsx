import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineCheck, AiOutlineArrowRight, AiOutlineUser, AiOutlineShop, AiOutlineCar } from 'react-icons/ai';

/**
 * PlatformRolesSection - The three connected experiences of Aritii Market.
 *
 * One platform, three experiences:
 * - Marketplace Experience (Buyers) -> #75d04b
 * - Seller Experience (Merchants) -> #f59e0b
 * - Delivery Experience (Couriers) -> #0ea5e9
 */

const experiences = [
  {
    key: 'buyers',
    image: '/buyer.png',
    imageAlt: 'A shopper using the Aritii marketplace',
    accent: '#75d04b',
    btnClass: 'bg-[#75d04b] hover:brightness-95',
    eyebrow: 'Marketplace Experience',
    icon: AiOutlineUser,
    title: 'Discover and shop local',
    description:
      'The shopping environment for buyers: find shops and products, compare options, and follow every order to your door.',
    features: [
      'Browse products and shops across local categories',
      'Compare options and prices before you buy',
      'Place orders and check out securely',
      'Communicate with sellers when you need to',
      'Track deliveries until they reach you',
    ],
    cta: { label: 'Explore Marketplace', to: '/marketplace' },
  },
  {
    key: 'sellers',
    image: '/seller.png',
    imageAlt: 'A local seller managing an Aritii shop',
    accent: '#f59e0b',
    btnClass: 'bg-amber-500 hover:bg-amber-600',
    eyebrow: 'Seller Experience',
    icon: AiOutlineShop,
    title: 'Sell through Aritii',
    description:
      'The business environment: learn how selling works, what your shop gets, and start your seller application.',
    features: [
      'See why businesses sell on Aritii',
      'Manage products, pricing and stock in one place',
      'Reach buyers looking for what you offer',
      'Handle orders, fulfilment and buyer conversations',
      'Connect every order to the delivery network',
    ],
    cta: { label: 'Explore Seller Central', to: '/seller-center' },
  },
  {
    key: 'delivery',
    image: '/delivery.png',
    imageAlt: 'An Aritii delivery provider handing an order to a customer',
    accent: '#0ea5e9',
    btnClass: 'bg-sky-500 hover:bg-sky-600',
    eyebrow: 'Delivery Experience',
    icon: AiOutlineCar,
    title: 'Move orders to customers',
    description:
      'The logistics environment: see how delivery requests become assignments, routes and completed deliveries.',
    features: [
      'Receive delivery requests from the platform',
      'Manage assignments for riders and providers',
      'Organise routes, zones and sectors',
      'Follow active deliveries in progress',
      'Run day-to-day delivery operations',
    ],
    cta: { label: 'Join Delivery Network', to: '/delivery-center' },
  },
];

const PlatformRolesSection = () => {
  return (
    <section id="ariiti-ecosystem" className="home-brand-section home-brand-section--commerce py-12 md:py-16 bg-gray-50 dark:bg-gray-900 transition-colors scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <span className="inline-block px-3.5 py-1 mb-4 rounded-full bg-[#75d04b]/15 text-[#5ac12f] text-xs font-bold uppercase tracking-wider">
            One platform · Three connected experiences
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Aritii connects local commerce end to end
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
            From selling to buying to delivery — buyers, sellers and delivery services work
            together on the same platform, in one connected flow.
          </p>
        </div>

        {/* Role cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8 lg:gap-6">
          {experiences.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                className="group relative flex h-full flex-col overflow-hidden bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 md:p-6 hover:shadow-md transition-all duration-300"
                style={{ borderTopWidth: '3px', borderTopColor: item.accent }}
              >
                <img
                  src={item.image}
                  alt={item.imageAlt}
                  width="1024"
                  height={item.key === 'delivery' ? '576' : '512'}
                  loading="lazy"
                  className="-mx-5 -mt-5 mb-5 aspect-[2/1] w-[calc(100%_+_2.5rem)] object-cover transition-transform duration-700 group-hover:scale-[1.025] md:-mx-6 md:-mt-6 md:mb-6 md:w-[calc(100%_+_3rem)]"
                />

                {/* Connector arrow */}
                {index < experiences.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="hidden md:flex lg:hidden absolute -right-[26px] top-16 z-10 w-9 h-9 rounded-full bg-white dark:bg-gray-800 border border-[#75d04b]/40 text-[#75d04b] items-center justify-center shadow-xs"
                  >
                    <AiOutlineArrowRight size={16} />
                  </span>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <span className="w-11 h-11 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center" style={{ color: item.accent }}>
                    <Icon size={22} />
                  </span>
                  <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-bold text-gray-700 dark:text-gray-200">
                    {item.eyebrow}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                  {item.description}
                </p>

                <ul className="space-y-2.5 mb-6">
                  {item.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <AiOutlineCheck
                        className="flex-shrink-0 mt-0.5"
                        style={{ color: item.accent }}
                        size={16}
                        aria-hidden="true"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={item.cta.to}
                  className={`mt-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-white text-sm font-semibold transition-all shadow-xs hover:shadow-sm ${item.btnClass}`}
                >
                  {item.cta.label}
                  <AiOutlineArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export { PlatformRolesSection };
export default PlatformRolesSection;
