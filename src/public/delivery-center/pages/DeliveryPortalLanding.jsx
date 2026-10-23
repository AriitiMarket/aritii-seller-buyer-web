import React from 'react';
import { Link } from 'react-router-dom';
import {
  AiOutlineArrowRight,
  AiOutlineSafety,
  AiOutlineDollar,
  AiOutlineClockCircle,
} from 'react-icons/ai';
import { useLayout } from '@/app/providers/LayoutContext';

import DeliveryPortalLayout from '../layout/DeliveryPortalLayout';
import DeliveryPortalHero from '../components/DeliveryPortalHero';
import DeliveryPartnerGrid from '../components/DeliveryPartnerGrid';
import { deliveryFooterColumns } from '../components/DeliveryPortalFooter';
import StepGrid from '@/public/components/StepGrid';
import FaqAccordion from '@/public/components/FaqAccordion';

/**
 * DeliveryPortalLanding - Aritii Delivery Partner Portal
 *
 * The header navigation and the footer anchors point at the sections this
 * page renders.
 */
const DELIVERY_CENTER_NAV = [
  { label: 'How to Start', to: '#ways-to-deliver' },
  { label: 'Earnings & Pay', to: '#earnings' },
  { label: 'FAQs', to: '#faq' },
];

const DELIVERY_CENTER_FOOTER_COLUMNS = deliveryFooterColumns({
  waysToDeliver: '#ways-to-deliver',
  vehicleRequirements: '#ways-to-deliver',
  earnings: '#earnings',
  safety: '#faq',
});

const DELIVERY_STEPS = [
  {
    step: '1',
    title: 'Apply Online',
    description: 'Fill out driver details, submit your driver license/Kebele ID, and select your delivery vehicle.',
  },
  {
    step: '2',
    title: 'Rapid Verification',
    description: 'Our safety team verifies your credentials and background check within 24 to 48 hours.',
  },
  {
    step: '3',
    title: 'Set Up Wallet',
    description: 'Link your CBE, Telebirr, or preferred local bank for automatic daily or weekly deposits.',
  },
  {
    step: '4',
    title: 'Deliver & Earn',
    description: 'Open the driver portal, pick up scheduled local blocks or on-demand orders, and earn.',
  },
];

const DeliveryPortalLanding = () => {
  const { openLoginModal } = useLayout();

  return (
    <DeliveryPortalLayout
      navItems={DELIVERY_CENTER_NAV}
      footerColumns={DELIVERY_CENTER_FOOTER_COLUMNS}
    >
      {/* Hero with Driver Earnings Card */}
      <DeliveryPortalHero />

      {/* Partner Network Grid */}
      <DeliveryPartnerGrid />

      {/* Aritii Delivery Style - 4 Steps to Start Delivering */}
      <section id="ways-to-deliver" className="bg-white dark:bg-[#0f1419] py-16 md:py-24 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00A8E1] bg-[#00A8E1]/10 px-3 py-1 rounded-full">
              Rapid Onboarding
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F1111] dark:text-white mt-3 mb-2">
              Start Delivering in 4 Easy Steps
            </h2>
            <p className="text-base text-[#565959] dark:text-gray-400">
              Get verified quickly and take your first route
            </p>
          </div>

          <StepGrid steps={DELIVERY_STEPS} accent="#00A8E1" />
        </div>
      </section>

      {/* Driver Benefits Grid */}
      <section id="earnings" className="bg-[#F7F7F7] dark:bg-[#131921] py-16 md:py-24 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F1111] dark:text-white mb-2">
              Why Drive with Aritii
            </h2>
            <p className="text-base text-[#565959] dark:text-gray-400">
              Designed to give drivers maximum flexibility and guaranteed payouts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#1a222d] p-6 rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="w-10 h-10 rounded-lg bg-[#00A8E1]/10 text-[#00A8E1] flex items-center justify-center mb-4">
                <AiOutlineClockCircle size={24} />
              </div>
              <h3 className="text-base font-bold text-[#0F1111] dark:text-white mb-2">
                100% Flexible Schedule
              </h3>
              <p className="text-xs text-[#565959] dark:text-gray-400 leading-relaxed">
                Work when it fits your life. Reserve scheduled delivery blocks in advance or accept immediate pickup requests when you are nearby.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1a222d] p-6 rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="w-10 h-10 rounded-lg bg-[#00A8E1]/10 text-[#00A8E1] flex items-center justify-center mb-4">
                <AiOutlineDollar size={24} />
              </div>
              <h3 className="text-base font-bold text-[#0F1111] dark:text-white mb-2">
                Transparent Compensation
              </h3>
              <p className="text-xs text-[#565959] dark:text-gray-400 leading-relaxed">
                Know what you will earn before accepting a route. Keep 100% of customer tips, with guaranteed base rates and peak hour surge bonuses.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1a222d] p-6 rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="w-10 h-10 rounded-lg bg-[#00A8E1]/10 text-[#00A8E1] flex items-center justify-center mb-4">
                <AiOutlineSafety size={24} />
              </div>
              <h3 className="text-base font-bold text-[#0F1111] dark:text-white mb-2">
                Driver Safety & Insurance
              </h3>
              <p className="text-xs text-[#565959] dark:text-gray-400 leading-relaxed">
                Every delivery route is backed by accident protection and in-app emergency assistance. Our dispatch team is available 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Driver FAQ Section */}
      <section id="faq" className="bg-white dark:bg-[#0f1419] py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F1111] dark:text-white mb-2">
              Frequently Asked Questions
            </h2>
          </div>

          <FaqAccordion
            idPrefix="delivery-faq"
            items={[
              {
                question: 'How much can I earn as an Aritii Delivery Partner?',
                answer:
                  'Most partners earn between 850 and 1,500 ETB per day depending on the number of deliveries completed, zone distance, and peak demand hours. You also keep 100% of any buyer tips.',
              },
              {
                question: 'What vehicles are accepted?',
                answer:
                  'We accept motorcycles, scooters, bicycles, and delivery vans/cars. Bicycles are especially popular for dense short-range local market orders in commercial centers.',
              },
              {
                question: 'How and when do I get paid?',
                answer:
                  'Earnings are credited to your in-app driver wallet upon completion of each route. You can transfer funds directly to Telebirr, CBE, or Awash Bank at any time.',
              },
              {
                question: 'What documents do I need to start?',
                answer:
                  'You need a valid Kebele ID or National ID, driver license (for motorized vehicles), vehicle registration, and a smartphone with mobile data.',
              },
            ]}
          />
        </div>
      </section>

      {/* Final Aritii Call to Action */}
      <section className="bg-[#131921] text-white py-16 border-t border-[#232F3E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
            Ready to hit the road?
          </h2>
          <p className="text-sm md:text-base text-[#CCCCCB] mb-8 max-w-xl mx-auto">
            Apply today, get verified within 24 hours, and start earning on your own schedule.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/delivery-sign-up"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#00A8E1] hover:bg-[#0087B8] text-white font-bold text-sm rounded transition-colors"
            >
              Apply to Deliver
              <AiOutlineArrowRight size={18} />
            </Link>
            <button
              type="button"
              onClick={() => openLoginModal('PROVIDER')}
              className="px-8 py-3.5 border border-[#565959] text-white font-semibold text-sm rounded hover:border-white hover:bg-white/5 transition-colors"
            >
              Sign In to Driver Portal
            </button>
          </div>
        </div>
      </section>
    </DeliveryPortalLayout>
  );
};

export default DeliveryPortalLanding;
