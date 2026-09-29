import React from 'react';
import { Link } from 'react-router-dom';
import {
  AiOutlineArrowRight,
  AiOutlineCheck,
  AiOutlineCar,
  AiOutlineInbox,
  AiOutlineUserSwitch,
  AiOutlineNodeIndex,
  AiOutlineAim,
  AiOutlineGlobal,
  AiOutlineDashboard,
  AiOutlineClockCircle,
} from 'react-icons/ai';
import { PublicLayout } from '@/public/layout/PublicLayout';
import { EXPERIENCES } from '@/public/experiences';
import ExperiencePageHeader from '@/public/components/ExperiencePageHeader';
import { DELIVERY_PROVIDER_LABELS } from '@/app/config';
import DeliveryFlowVisual from '@/public/delivery/components/DeliveryFlowVisual';

/**
 * PUBLIC DELIVERY EXPERIENCE (/delivery)
 *
 * The logistics-focused public page — NOT the delivery dashboard, and it never
 * queries delivery data. Uses the standard ExperiencePageHeader (Delivery
 * accent = slate blue) so the page reads as part of the one Aritii platform.
 * Hands off to the existing auth flows; delivery operations live in the
 * protected /delivery domain once a provider capability is provisioned.
 */

const capabilities = [
  {
    icon: AiOutlineInbox,
    title: 'Delivery requests',
    description: 'Every packed order becomes a structured request with pickup and destination.',
  },
  {
    icon: AiOutlineUserSwitch,
    title: 'Assignments',
    description: 'Requests are assigned to riders and providers with clear ownership.',
  },
  {
    icon: AiOutlineAim,
    title: 'Zones & sectors',
    description: 'Delivery areas are organised into zones so coverage stays predictable.',
  },
  {
    icon: AiOutlineNodeIndex,
    title: 'Routes',
    description: 'Assignments carry route context for efficient, reliable delivery runs.',
  },
  {
    icon: AiOutlineGlobal,
    title: 'Active tracking',
    description: 'In-progress deliveries are visible with live status for buyers and operators.',
  },
  {
    icon: AiOutlineDashboard,
    title: 'Delivery operations',
    description: 'Providers manage their day from one operations workspace.',
  },
];

const roleCards = [
  {
    title: 'Aritii Delivery',
    description:
      "The platform's own delivery network. Riders receive assignments, run their routes and zones, and complete deliveries across coverage areas.",
    tag: 'Platform network',
  },
  {
    title: 'External providers',
    description:
      'Trusted logistics partners plugged into the same flow — they receive requests, manage assignments, and fulfil deliveries under the same standards.',
    tag: 'Partner network',
  },
];

const DeliveryPage = () => {
  const exp = EXPERIENCES.delivery;

  return (
    <PublicLayout>
      {/* Standard experience page header — Delivery accent */}
      <ExperiencePageHeader
        experience={exp}
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Delivery' }]}
        badge="Delivery Experience"
        title="Delivery that connects every order to every customer"
        description="Aritii Delivery and trusted external providers move orders from local sellers to buyers across Ethiopia — one connected flow from the moment an order is confirmed until it reaches the door."
        visual={(
          <img
            src="/delivery.png"
            alt="An Aritii delivery provider handing a package to a customer"
            width="1024"
            height="576"
            loading="eager"
            fetchPriority="high"
            className="block w-full rounded-2xl border border-white/20 shadow-2xl"
          />
        )}
        actions={
          <>
            <Link
              to="/delivery-sign-up"
              className={`group inline-flex items-center justify-center gap-2 px-8 py-3.5 font-bold rounded-full text-base transition-colors focus-visible:outline-none focus-visible:ring-2 ${exp.button} ${exp.ring}`}
            >
              Join Delivery Services
              <AiOutlineArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-full text-base border border-gray-300 dark:border-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]"
            >
              See how orders travel
            </Link>
          </>
        }
      />

      {/* The flow */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 scroll-mt-32">
        <DeliveryFlowVisual />
      </section>

      {/* Capabilities */}
      <section id="delivery-capabilities" className="bg-[#FDF6EC] dark:bg-gray-950 border-y border-gray-100 dark:border-gray-800 scroll-mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              What the delivery network runs on
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
              The capabilities providers and riders use every day to keep orders moving.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {capabilities.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 md:p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                >
                  <span className={`w-10 h-10 mb-3 rounded-xl flex items-center justify-center ${exp.accentSoft} ${exp.accentText}`}>
                    <Icon size={20} />
                  </span>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Provider roles */}
      <section id="providers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 scroll-mt-32">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Two ways delivery gets done
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
            The platform never assumes a single provider — Aritii's own network and external
            partners work the same flow.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-10">
          {roleCards.map((card) => (
            <div
              key={card.title}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              <span className={`inline-block px-3 py-1 mb-4 rounded-full text-xs font-bold uppercase tracking-wider ${exp.badge}`}>
                {card.tag}
              </span>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{card.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {Object.values(DELIVERY_PROVIDER_LABELS).map((label) => (
            <span
              key={label}
              className="px-3 py-1 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-400"
            >
              {label}
            </span>
          ))}
        </div>
      </section>

      {/* Buyer tracking note */}
      <section id="tracking" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 scroll-mt-32">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <AiOutlineClockCircle size={26} className="flex-shrink-0" style={{ color: exp.accent }} aria-hidden="true" />
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong className="font-semibold text-gray-900 dark:text-white">Waiting on an order?</strong>{' '}
            Buyers follow every delivery live from their dashboard — track your order from
            confirmation to the door.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#FDF6EC] dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Move orders where they matter
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8 text-sm md:text-lg">
            Create an account to get started with Aritii Delivery — provider onboarding is
            provisioned by the platform once your delivery capability is set up.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/delivery-sign-up"
              className={`inline-flex items-center justify-center px-10 py-4 font-bold rounded-full text-base transition-colors ${exp.button}`}
            >
              Join Delivery Services
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-10 py-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-full text-base border border-gray-300 dark:border-gray-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default DeliveryPage;
