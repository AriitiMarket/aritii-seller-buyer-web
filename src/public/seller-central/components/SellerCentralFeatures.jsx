import React from 'react'
import { AiOutlineGlobal, AiOutlineShop, AiOutlineBarChart } from 'react-icons/ai'

/**
 * SellerCentralFeatures - Benefits cards grid
 *
 * Three core seller benefits focused on local commerce
 */
const SellerCentralFeatures = () => {
  const features = [
    {
      icon: AiOutlineGlobal,
      title: 'Local Market Access',
      description: 'Connect with customers in your community. Reach buyers in your neighborhood, city, and region through one unified marketplace.',
      highlights: [
        'Local customer discovery',
        'Neighborhood visibility',
        'Regional expansion',
      ],
    },
    {
      icon: AiOutlineShop,
      title: 'Order Fulfillment Support',
      description: 'Integrated delivery network handles pickup and delivery. Focus on your products while local delivery partners fulfill orders.',
      highlights: [
        'Local delivery partners',
        'Order coordination',
        'Customer doorstep delivery',
      ],
    },
    {
      icon: AiOutlineBarChart,
      title: 'Seller Dashboard & Analytics',
      description: 'Powerful tools to manage inventory, track performance, run promotions, and grow your business with actionable insights.',
      highlights: [
        'Sales performance tracking',
        'Inventory management',
        'Promotion tools',
      ],
    },
  ]

  return (
    <section className="bg-white dark:bg-gray-950 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F1111] dark:text-white mb-4">
            Why Sell on Aritii?
          </h2>
          <p className="text-lg text-[#565959] dark:text-gray-400 max-w-2xl mx-auto">
            Get the tools, reach, and support you need to build a successful business on our marketplace.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="bg-white dark:bg-gray-900 border border-[#E7E5E4] dark:border-gray-800 rounded-lg p-8 hover:shadow-lg transition-shadow duration-200"
              >
                {/* Icon */}
                <div className="w-16 h-16 bg-[#F7F7F7] dark:bg-gray-800 rounded-lg flex items-center justify-center mb-6">
                  <Icon className="w-8 h-8 text-[#FF9900]" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-[#0F1111] dark:text-white mb-3">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-[#565959] dark:text-gray-400 text-sm mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Highlights */}
                <ul className="space-y-3">
                  {feature.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-3">
                      <span className="text-[#FF9900] font-bold mt-1">•</span>
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

export default SellerCentralFeatures
