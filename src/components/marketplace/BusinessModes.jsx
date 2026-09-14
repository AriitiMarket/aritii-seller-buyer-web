import React from 'react'
import { Link } from 'react-router-dom'

/**
 * BusinessModes Component - UPDATED DESIGN
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Three-column showcase of business categories with updated color scheme
 *
 * Now includes:
 * - Smoother transitions from dark hero section
 * - Enhanced hover effects and animations
 * - Better visual hierarchy
 * - Improved responsive design
 *
 * Layout: 1 col mobile → 3 cols desktop (responsive grid)
 * Cards: Hover effects (shadow, transform), interactive CTAs with arrows
 *
 * Column 1: Local Ethiopian Artisans
 * - Icon: Amber/gold
 * - Badge: "Artisanal Direct" (amber)
 * - Description: Handwoven, handmade, traditional crafts
 * - Features with checkmarks
 * - CTA with arrow
 *
 * Column 2: B2B Commercial Bulk Sourcing (FEATURED)
 * - Icon: Green
 * - Badge: "Wholesale & Export" (green)
 * - Featured styling (ring, prominent)
 * - Description: High-volume, farm/factory direct
 * - Features with checkmarks
 * - CTA with arrow
 *
 * Column 3: Local Verified Stores & Retail
 * - Icon: Gray
 * - Badge: "Retail Storefronts" (gray)
 * - Description: Everyday retail, verified shops
 * - Features with checkmarks
 * - CTA with arrow
 */
const BusinessModes = () => {
  const modes = [
    {
      id: 'artisans',
      title: 'Local Ethiopian Artisans',
      subtitle: 'Artisanal Direct',
      icon: '👗',
      description: 'Authentic handwoven Habesha Kemis, handmade leather satchels, traditional clay Jebena pottery, and woven Mesob crafts crafted by generational masters.',
      features: [
        'Custom bespoke sizing available',
        'Direct support to regional cooperatives',
      ],
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      badgeBg: 'bg-amber-200',
      badgeText: 'text-amber-900',
      accentBg: 'bg-amber-100',
      accentText: 'text-amber-800',
      link: '/artisans',
      linkText: 'Browse Artisan Directory',
    },
    {
      id: 'b2b',
      title: 'B2B Commercial Bulk Sourcing',
      subtitle: 'Wholesale & Export',
      icon: '📦',
      description: 'High-volume sourcing of green specialty coffee beans (Yirgacheffe, Sidamo, Harrar), organic white teff grain, oilseeds, spices, and bulk apparel fabrics.',
      features: [
        'Certified ECX grades & phytosanitary certificates',
        'Tiered discounts & letter of credit (LC) terms',
      ],
      bgColor: 'bg-emerald-50',
      borderColor: 'border-brand-primary',
      badgeBg: 'bg-brand-primary',
      badgeText: 'text-white',
      accentBg: 'bg-brand-primary',
      accentText: 'text-white',
      link: '/wholesale',
      linkText: 'Access B2B Procurement Desk',
      featured: true,
    },
    {
      id: 'retail',
      title: 'Local Verified Stores & Retail',
      subtitle: 'Retail Storefronts',
      icon: '🏪',
      description: 'Everyday retail convenience: Consumer electronics, modern fashion, packaged pantry food items, organic cosmetics, and Addis Ababa city shop pickups.',
      features: [
        '24-48 hr national shipping',
        '7-day hassle-free return guarantee',
      ],
      bgColor: 'bg-white',
      borderColor: 'border-slate-200',
      badgeBg: 'bg-slate-200',
      badgeText: 'text-slate-800',
      accentBg: 'bg-slate-100',
      accentText: 'text-slate-800',
      link: '/retail-stores',
      linkText: 'Explore City Retail Stores',
    },
  ]

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50 border-b border-slate-100" data-purpose="business-modes-overview">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">
            ✨ Seamless Ecosystem
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
            Explore Marketplace by Trade Type
          </h2>
          <p className="text-sm md:text-base text-slate-600 mt-4 leading-relaxed">
            Whether you need one bespoke Habesha dress or metric tons of export-grade coffee, Aritii handles verification, escrow, and logistics.
          </p>
        </div>

        {/* Three-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {modes.map((mode) => (
            <div
              key={mode.id}
              className={`
                ${mode.bgColor} border ${mode.borderColor} rounded-2xl p-6 md:p-8
                flex flex-col justify-between
                transition-all duration-300 ease-out
                hover:shadow-lg hover:-translate-y-1
                ${mode.featured ? 'md:ring-2 md:ring-brand-accent md:ring-opacity-50 md:scale-105' : ''}
              `}
            >
              {/* Header Section - Icon & Badge */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 rounded-xl ${mode.accentBg} ${mode.accentText} flex items-center justify-center text-3xl font-bold`}>
                    {mode.icon}
                  </div>
                  <span className={`${mode.badgeBg} ${mode.badgeText} text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide`}>
                    {mode.subtitle}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">
                  {mode.title}
                </h3>

                {/* Description */}
                <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-6">
                  {mode.description}
                </p>

                {/* Features List with Checkmarks */}
                <ul className="space-y-3 mb-6">
                  {mode.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                      <span className={`
                        ${mode.featured ? 'text-brand-accent' : 'text-brand-primary'}
                        font-bold text-lg flex-shrink-0 mt-0.5
                      `}>
                        ✓
                      </span>
                      <span className="flex-1">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Link with Arrow */}
              <Link
                to={mode.link}
                className={`
                  inline-flex items-center justify-between gap-3
                  text-sm font-bold
                  pt-4 border-t transition-colors duration-200
                  ${mode.featured 
                    ? `text-white ${mode.borderColor} hover:opacity-80` 
                    : 'text-brand-primary border-slate-300 hover:text-brand-primary/80'
                  }
                `}
              >
                <span className="flex-1">{mode.linkText}</span>
                <span className="text-lg flex-shrink-0 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BusinessModes
