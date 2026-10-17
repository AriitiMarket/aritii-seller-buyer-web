import React from 'react'
import { AiOutlineCar, AiOutlineShop, AiOutlineHome } from 'react-icons/ai'

/**
 * DeliveryPartnerGrid - Partner pathway cards grid
 * 
 * Three core delivery partnership models
 */
const DeliveryPartnerGrid = () => {
  const partnerTypes = [
    {
      icon: AiOutlineCar,
      title: 'Flex Drivers',
      description: 'Use your own vehicle to deliver packages on your schedule. Complete deliveries, earn competitive rates, and build your reputation.',
      highlights: [
        'Use your own vehicle',
        'Choose your hours',
        'Instant pay available',
        'Keep what you earn',
      ],
    },
    {
      icon: AiOutlineShop,
      title: 'Delivery Service Partners',
      description: 'Build and scale your own delivery business. Hire drivers, manage routes, and grow a profitable business with Aritii support.',
      highlights: [
        'Build your business',
        'Manage your fleet',
        'Flexible terms',
        'Business resources',
      ],
    },
    {
      icon: AiOutlineHome,
      title: 'Delivery Hubs',
      description: 'Host a local delivery hub or locker location. Earn revenue by providing package pickup and drop-off services to your community.',
      highlights: [
        'Host a hub location',
        'Passive income stream',
        'Local community impact',
        'Minimal operational overhead',
      ],
    },
  ]

  return (
    <section className="bg-white dark:bg-gray-950 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F1111] dark:text-white mb-4">
            Ways to Deliver
          </h2>
          <p className="text-lg text-[#565959] dark:text-gray-400 max-w-2xl mx-auto">
            Choose the partnership model that works best for you and your business goals.
          </p>
        </div>

        {/* Partner Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {partnerTypes.map((partner) => {
            const Icon = partner.icon
            return (
              <div
                key={partner.title}
                className="bg-white dark:bg-gray-900 border border-[#E7E5E4] dark:border-gray-800 rounded-lg p-8 hover:shadow-lg transition-shadow duration-200"
              >
                {/* Icon */}
                <div className="w-16 h-16 bg-[#F7F7F7] dark:bg-gray-800 rounded-lg flex items-center justify-center mb-6">
                  <Icon className="w-8 h-8 text-[#00A8E1]" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-[#0F1111] dark:text-white mb-3">
                  {partner.title}
                </h3>

                {/* Description */}
                <p className="text-[#565959] dark:text-gray-400 text-sm mb-6 leading-relaxed">
                  {partner.description}
                </p>

                {/* Highlights */}
                <ul className="space-y-3">
                  {partner.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-3">
                      <span className="text-[#00A8E1] font-bold mt-1">•</span>
                      <span className="text-sm text-[#0F1111] dark:text-gray-300">
                        {highlight}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default DeliveryPartnerGrid
