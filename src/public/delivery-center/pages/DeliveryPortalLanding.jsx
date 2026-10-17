import React from 'react'
import { Link } from 'react-router-dom'
import { AiOutlineCheckCircle, AiOutlineArrowRight } from 'react-icons/ai'

// Components
import DeliveryPortalLayout from '../layout/DeliveryPortalLayout'
import DeliveryPortalHero from '../components/DeliveryPortalHero'
import DeliveryPartnerGrid from '../components/DeliveryPartnerGrid'
import DeliveryPortalFooter from '../components/DeliveryPortalFooter'

/**
 * DeliveryPortalLanding - Main delivery partner landing page
 * 
 * Complete pre-login landing experience for delivery partners.
 * Header and Footer are handled by DeliveryPortalLayout.
 */
const DeliveryPortalLanding = () => {
  return (
    <DeliveryPortalLayout>
      <DeliveryPortalHero />

      {/* Partner Grid Section */}
      <DeliveryPartnerGrid />

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-[#F7F7F7] dark:bg-gray-900 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F1111] dark:text-white mb-4">
              How Delivery Works
            </h2>
            <p className="text-lg text-[#565959] dark:text-gray-400 max-w-2xl mx-auto">
              Get started delivering with Aritii in just a few simple steps
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4">
            {[
              {
                step: '1',
                title: 'Apply',
                description: 'Complete your application with basic information and vehicle details',
              },
              {
                step: '2',
                title: 'Verification',
                description: 'Pass background check and document verification within 24-48 hours',
              },
              {
                step: '3',
                title: 'Setup',
                description: 'Download the app, add payment details, and review safety guidelines',
              },
              {
                step: '4',
                title: 'Deliver',
                description: 'Start accepting deliveries and earning on your schedule immediately',
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                {/* Step Card */}
                <div className="bg-white dark:bg-gray-800 border border-[#E7E5E4] dark:border-gray-700 rounded-lg p-6 h-full">
                  {/* Step Number */}
                  <div className="w-12 h-12 bg-[#00A8E1] text-white font-bold rounded-full flex items-center justify-center mb-4 text-lg">
                    {item.step}
                  </div>

                  {/* Content */}
                  <h3 className="font-bold text-[#0F1111] dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#565959] dark:text-gray-400">
                    {item.description}
                  </p>
                </div>

                {/* Connector Arrow (hidden on last item and mobile) */}
                {item.step !== '4' && (
                  <div className="hidden md:flex absolute -right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <AiOutlineArrowRight className="w-6 h-6 text-[#00A8E1]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="bg-white dark:bg-gray-950 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F1111] dark:text-white mb-4">
              Partner Benefits
            </h2>
            <p className="text-lg text-[#565959] dark:text-gray-400 max-w-2xl mx-auto">
              Why thousands of delivery partners choose Aritii
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Flexible Scheduling',
                description: 'Work when you want. Choose deliveries that fit your schedule and lifestyle.',
              },
              {
                title: 'Competitive Pay',
                description: 'Earn transparent rates with incentives for performance and customer ratings.',
              },
              {
                title: '24/7 Support',
                description: 'Dedicated support team available round the clock to help with any issues.',
              },
              {
                title: 'Safety First',
                description: 'Comprehensive background checks and safety protocols protect you and customers.',
              },
              {
                title: 'Easy Payouts',
                description: 'Instant pay options available. Choose when to cash out your earnings.',
              },
              {
                title: 'Community',
                description: 'Join a community of delivery partners with resources, tips, and networking.',
              },
            ].map((benefit) => (
              <div
                key={benefit.title}
                className="bg-[#F7F7F7] dark:bg-gray-900 border border-[#E7E5E4] dark:border-gray-800 rounded-lg p-8"
              >
                <div className="flex gap-3 mb-3">
                  <AiOutlineCheckCircle className="w-6 h-6 text-[#00A8E1] flex-shrink-0 mt-1" />
                  <h3 className="font-bold text-[#0F1111] dark:text-white">
                    {benefit.title}
                  </h3>
                </div>
                <p className="text-[#565959] dark:text-gray-400 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section id="vehicle-requirements" className="bg-[#F7F7F7] dark:bg-gray-900 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F1111] dark:text-white mb-4">
              Requirements to Get Started
            </h2>
            <p className="text-lg text-[#565959] dark:text-gray-400">
              What you need to become a delivery partner
            </p>
          </div>

          {/* Requirements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white dark:bg-gray-800 border border-[#E7E5E4] dark:border-gray-700 rounded-lg p-8">
              <h3 className="font-bold text-[#0F1111] dark:text-white text-lg mb-6">
                Personal Requirements
              </h3>
              <ul className="space-y-4">
                {[
                  'At least 18 years old',
                  'Valid driver\'s license or ID',
                  'Clean background check',
                  'Valid phone number and email',
                  'Bank account for direct deposits',
                ].map((req) => (
                  <li key={req} className="flex items-start gap-3">
                    <AiOutlineCheckCircle className="w-5 h-5 text-[#00A8E1] mt-0.5 flex-shrink-0" />
                    <span className="text-[#0F1111] dark:text-gray-300">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-[#E7E5E4] dark:border-gray-700 rounded-lg p-8">
              <h3 className="font-bold text-[#0F1111] dark:text-white text-lg mb-6">
                Vehicle Requirements
              </h3>
              <ul className="space-y-4">
                {[
                  'Vehicle registered in your name',
                  'Valid vehicle insurance',
                  'Registration and inspection current',
                  'Vehicle in good working condition',
                  'Ability to transport packages safely',
                ].map((req) => (
                  <li key={req} className="flex items-start gap-3">
                    <AiOutlineCheckCircle className="w-5 h-5 text-[#00A8E1] mt-0.5 flex-shrink-0" />
                    <span className="text-[#0F1111] dark:text-gray-300">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-white dark:bg-gray-950 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F1111] dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {[
              {
                q: 'How much can I earn as a delivery partner?',
                a: 'Earnings vary based on deliveries completed, distance, and location. Most partners earn between $15-$25 per hour. Incentive programs offer additional earning opportunities.',
              },
              {
                q: 'How often can I work?',
                a: 'You have complete control over your schedule. Work full-time, part-time, or just on weekends. Log in to the app whenever you want to start accepting deliveries.',
              },
              {
                q: 'What about vehicle insurance and liability?',
                a: 'You\'re responsible for maintaining commercial or personal insurance on your vehicle. Aritii provides additional liability coverage while you\'re delivering.',
              },
              {
                q: 'How do I get paid?',
                a: 'We offer instant pay and weekly deposits. Choose your preferred payment method during setup. Earnings are automatically calculated and available in your account.',
              },
            ].map((faq, idx) => (
              <details
                key={idx}
                className="group bg-[#F7F7F7] dark:bg-gray-900 border border-[#E7E5E4] dark:border-gray-800 rounded-lg p-6 cursor-pointer"
              >
                <summary className="font-bold text-[#0F1111] dark:text-white flex justify-between items-center list-none">
                  {faq.q}
                  <span className="text-[#00A8E1]">+</span>
                </summary>
                <p className="text-[#565959] dark:text-gray-400 mt-4 leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gradient-to-r from-[#131921] to-[#232F3E] text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Delivering?
          </h2>
          <p className="text-lg text-gray-200 mb-10 max-w-2xl mx-auto">
            Join thousands of delivery partners earning flexible income on their own terms. Apply now and start delivering within hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/delivery-sign-up"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#00A8E1] hover:bg-[#0087B8] text-white font-bold rounded transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A8E1]"
            >
              Apply to Deliver
              <AiOutlineArrowRight size={20} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gray-400 text-white font-bold rounded hover:border-white hover:bg-white/5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A8E1]"
            >
              Sign in to Account
            </Link>
          </div>
        </div>
      </section>
    </DeliveryPortalLayout>
  )
}

export default DeliveryPortalLanding
