import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineArrowRight, AiOutlineCheck, AiOutlineMobile } from 'react-icons/ai';
import { MdLocalShipping, MdStore } from 'react-icons/md';
import api from '@/services/api';
import DeliveryFlowVisual from '@/public/delivery/components/DeliveryFlowVisual';
import DeliveryLandingLayout from '../layout/DeliveryLandingLayout';
import { useAuth } from '@/auth/hooks/useAuth';

const EXPLANATORY_STEPS = [
  {
    title: 'Register & verify',
    description:
      'Create a delivery provider account, submit your vehicle and ID details, and wait for platform approval.',
  },
  {
    title: 'Go online',
    description:
      'Set your availability to online in the provider workspace so you can receive delivery assignments in your operating area.',
  },
  {
    title: 'Accept an assignment',
    description:
      'Review available delivery assignments in your zone and accept the ones that fit your route and schedule.',
  },
  {
    title: 'Pick up & deliver',
    description:
      'Collect the order from the seller, follow the assigned route, and complete the drop-off at the buyer\'s door.',
  },
  {
    title: 'Complete & earn',
    description:
      'Mark the delivery delivered, confirm any cash-on-delivery collection, and track your earnings in ETB.',
  },
];

const SERVICE_CARDS = [
  {
    title: 'Aritii Delivery Network',
    description:
      "Ariiti's own delivery fleet. Riders receive assignments, run local routes and zones, and complete deliveries across coverage areas.",
    tag: 'Platform network',
  },
  {
    title: 'External Providers',
    description:
      'Trusted external delivery providers plugged into the same flow — they receive requests, manage assignments, and fulfil deliveries under the same standards.',
    tag: 'Provider network',
  },
  {
    title: 'Batch Dispatch',
    description:
      'Group multiple deliveries into one efficient run. Pick up from several sellers in a zone and deliver along an optimized route.',
    tag: 'Multi-stop',
  },
  {
    title: 'Cash on Delivery (COD)',
    description:
      'Collect payment on delivery where supported and confirm the amount collected through the delivery workflow. All monetary values in Ethiopian Birr (ETB).',
    tag: 'COD supported',
  },
];

const WHY_DELIVER_CARDS = [
  {
    title: 'Local commerce',
    description:
      'Deliver orders from nearby shops and sellers in your own region, city, and zone.',
  },
  {
    title: 'Clear assignments',
    description:
      'Every assignment shows pickup, destination, item count, and estimated earnings before you accept.',
  },
  {
    title: 'Reliable coordination',
    description:
      'Route and zone context helps you run efficient paths, and live tracking keeps buyers and sellers informed.',
  },
  {
    title: 'Local opportunity',
    description:
      'Earn in Ethiopian Birr (ETB) by serving your community as a platform rider or external delivery provider.',
  },
];

const DeliveryPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const [operatingAreas, setOperatingAreas] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [locationsError, setLocationsError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLocationsLoading(true);
    api
      .get('/delivery/location/hierarchy', { skipAuth: true })
      .then((data) => {
        if (!cancelled) setOperatingAreas(data.hierarchy || []);
      })
      .catch((err) => {
        if (!cancelled) {
          setLocationsError(err);
          setOperatingAreas([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLocationsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const topLevel = operatingAreas.filter((loc) => !loc.parentId);
  const regions = topLevel.slice(0, 6);

  return (
    <DeliveryLandingLayout>
      {/* Provider Access Banner - for existing providers */}
      {isAuthenticated && !loading && (
        <section className="bg-gradient-to-r from-[#00A8E1] to-[#0087B8] text-white">
          <div className="px-4 sm:px-6 lg:px-8 py-4 md:py-6">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div>
                <p className="text-sm md:text-base font-medium">
                  Ready to start delivering?
                </p>
                <p className="text-xs md:text-sm text-white/80 mt-1">
                  Access your Delivery Center workspace to view assignments and manage deliveries
                </p>
              </div>
              <Link
                to="/provider"
                className="flex-shrink-0 px-6 py-2 bg-white text-[#00A8E1] font-semibold rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
              >
                Go to Delivery Center
                <AiOutlineArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8 py-10 md:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <span className="inline-block px-3 py-1 mb-4 rounded-full bg-[#00A8E1]/10 text-[#00A8E1] text-xs font-bold uppercase tracking-wider">
                Aritii Market Delivery Portal
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                Deliver Locally. Grow with Aritii Market.
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
                Connect with local delivery opportunities, manage assignments,
                coordinate deliveries, and serve customers across your operating
                area.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/delivery-sign-up"
                  className="inline-flex items-center justify-center px-10 py-4 font-bold rounded-full text-base bg-[#00A8E1] hover:bg-[#0087B8] text-white transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-10 py-4 font-bold rounded-full text-base border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How Delivery Works */}
        <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                How Delivery Works
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
                From registration to completion, every delivery follows the same
                clear path.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {EXPLANATORY_STEPS.map((step, index) => (
                <div
                  key={step.title}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#00A8E1]/10 text-[#00A8E1] flex items-center justify-center flex-shrink-0 mb-4">
                    {index + 1}
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Delivery Services */}
        <section id="services" className="px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Delivery Services
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
                The delivery models and operating options supported on the
                Aritii Market delivery network.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {SERVICE_CARDS.map((card) => (
                <div
                  key={card.title}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                >
                  <span className="inline-block px-3 py-1 mb-4 rounded-full bg-[#00A8E1]/10 text-[#00A8E1] text-xs font-bold uppercase tracking-wider">
                    {card.tag}
                  </span>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Deliver with Aritii Market */}
        <section id="why" className="px-4 sm:px-6 lg:px-8 py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Why Deliver with Aritii Market?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
                Built for Ethiopia's local-first delivery model — region, city,
                zone, and port — so coverage stays predictable and close to home.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {WHY_DELIVER_CARDS.map((card) => (
                <div
                  key={card.title}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                >
                  <MdLocalShipping className="w-8 h-8 text-[#00A8E1] mb-4" />
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Operating Areas */}
        <section id="operating-areas" className="px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Operating Areas
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
                Supported regions, cities, zones, and local delivery ports.
                Coverage is drawn from the delivery location hierarchy.
              </p>
            </div>

            {locationsLoading && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                <span className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#00A8E1]" />
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                  Loading operating areas…
                </p>
              </div>
            )}

            {locationsError && !operatingAreas.length && (
              <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500 rounded-xl p-6 text-center">
                <p className="text-amber-800 dark:text-amber-200 text-sm">
                  Operating areas could not be loaded at this time. Delivery
                  coverage still applies where the service is active.
                </p>
              </div>
            )}

            {!locationsLoading && operatingAreas.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                <MdStore className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No operating areas published
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Supported regions, cities, zones, and ports will appear here
                  as the delivery network expands.
                </p>
              </div>
            )}

            {!locationsLoading && operatingAreas.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {regions.map((region) => (
                  <div
                    key={region._id || region.name}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <MdStore className="text-[#00A8E1]" size={20} />
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {region.name}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      Region • delivery coverage
                    </p>
                    <div className="space-y-2">
                      {region.children && region.children.length > 0 ? (
                        region.children.slice(0, 4).map((city) => (
                          <div
                            key={city._id || city.name}
                            className="flex items-center justify-between py-1.5"
                          >
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {city.name}
                            </span>
                            <span className="text-xs text-[#00A8E1] font-medium">
                              zones
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400 italic">
                          No cities published yet
                        </p>
                      )}
                      {region.children && region.children.length > 4 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          +{region.children.length - 4} more cities
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Getting Started */}
        <section id="getting-started" className="px-4 sm:px-6 lg:px-8 py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Getting Started
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
                Eligible to deliver? Choose the path that matches your account.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-6">
                  <AiOutlineMobile className="text-blue-600" size={24} />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">
                  New to delivery?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Create a delivery provider account, submit your details, and
                  apply to join the network.
                </p>
                <Link
                  to="/delivery-sign-up"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00A8E1] text-white font-semibold rounded-lg hover:bg-[#0087B8] transition"
                >
                  Get Started <AiOutlineArrowRight size={16} />
                </Link>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mx-auto mb-6">
                  <AiOutlineCheck className="text-green-600" size={24} />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">
                  Already have an account?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Sign in to access assignments, deliveries, and your workspace.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  Sign In <AiOutlineArrowRight size={16} />
                </Link>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mx-auto mb-6">
                  <MdLocalShipping className="text-purple-600" size={24} />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">
                  Track a delivery
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Buyers follow every delivery live from confirmation to the
                  door through their dashboard.
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  Go to Marketplace <AiOutlineArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Help & Support */}
        <section id="help" className="px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="max-w-7xl mx-auto">
            <div className="bg-[#FDF6EC] dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-8 md:p-12">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Help &amp; Support
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Need help with an assignment, a delivery, or your account?
                    Contact support or check your warnings in the provider
                    workspace.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  {isAuthenticated && (
                    <Link
                      to="/provider/warnings"
                      className="px-6 py-3 bg-[#00A8E1] text-white font-semibold rounded-lg hover:bg-[#0087B8] transition"
                    >
                      Warnings &amp; Notifications
                    </Link>
                  )}
                  {!isAuthenticated && (
                    <Link
                      to="/login"
                      className="px-6 py-3 bg-[#00A8E1] text-white font-semibold rounded-lg hover:bg-[#0087B8] transition"
                    >
                      Sign in for Support
                    </Link>
                  )}
                  <Link
                    to="/"
                    className="px-6 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    Return to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Delivery flow visual (reused component) */}
        <section className="px-4 sm:px-6 lg:px-8 py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
          <DeliveryFlowVisual />
        </section>
    </DeliveryLandingLayout>
  );
};

export default DeliveryPage;
