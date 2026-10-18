import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineArrowRight, AiOutlineCheck, AiOutlineCheckCircle } from 'react-icons/ai';

/**
 * UnifiedLandingPage - Reusable landing page template for Seller & Delivery experiences
 *
 * Provides consistent layout, styling, and structure across seller-central and
 * delivery-center landing pages. Each experience customizes:
 * - accent color (seller: #2f6e4f, delivery: #2563eb)
 * - hero image (seller.png vs delivery.png)
 * - copy and CTAs
 * - sections and features
 */
const UnifiedLandingPage = ({ experience, sections = {} }) => {
  const defaultSections = {
    hero: null,
    howitworks: null,
    benefits: null,
    features: null,
    resources: null,
    faq: null,
    cta: null,
  };

  const config = { ...defaultSections, ...sections };

  return (
    <div className="unified-landing-page">
      {/* Hero Section with Image Banner */}
      {config.hero && (
        <section className="relative w-full bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Text Content */}
              <div>
                <div className="mb-6">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor: `${experience.accent}15`,
                      color: experience.accent,
                    }}
                  >
                    {config.hero.badge}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  {config.hero.title}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                  {config.hero.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to={config.hero.primaryCTA.to}
                    className="px-8 py-4 rounded-xl font-bold text-white text-center transition-opacity hover:opacity-90"
                    style={{ backgroundColor: experience.accent }}
                  >
                    {config.hero.primaryCTA.label}
                  </Link>
                  {config.hero.secondaryCTA && (
                    <Link
                      to={config.hero.secondaryCTA.to}
                      className="px-8 py-4 rounded-xl font-bold border-2 text-center transition-colors"
                      style={{
                        borderColor: experience.accent,
                        color: experience.accent,
                      }}
                    >
                      {config.hero.secondaryCTA.label}
                    </Link>
                  )}
                </div>
              </div>

              {/* Image */}
              {config.hero.image && (
                <div className="relative h-96 md:h-full rounded-2xl overflow-hidden">
                  <img
                    src={config.hero.image}
                    alt={config.hero.imageAlt}
                    className="w-full h-full object-cover rounded-2xl"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* How It Works Section */}
      {config.howitworks && (
        <section className="bg-gray-50 dark:bg-gray-900 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {config.howitworks.title}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {config.howitworks.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4">
              {config.howitworks.steps.map((step, idx) => (
                <div key={step.step} className="relative">
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 h-full">
                    <div
                      className="w-12 h-12 rounded-full text-white font-bold text-lg flex items-center justify-center mb-4"
                      style={{ backgroundColor: experience.accent }}
                    >
                      {step.step}
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {step.description}
                    </p>
                  </div>

                  {idx < config.howitworks.steps.length - 1 && (
                    <div className="hidden md:flex absolute -right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <AiOutlineArrowRight
                        className="w-6 h-6"
                        style={{ color: experience.accent }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      {config.benefits && (
        <section className="bg-white dark:bg-gray-950 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {config.benefits.title}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {config.benefits.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {config.benefits.items.map((benefit) => (
                <div
                  key={benefit.title}
                  className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-8"
                >
                  <div className="flex gap-3 mb-4">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                      style={{ backgroundColor: `${experience.accent}15`, color: experience.accent }}
                    >
                      {benefit.icon ? <benefit.icon size={16} /> : <AiOutlineCheck size={16} />}
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {benefit.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      {config.features && (
        <section className="bg-gray-50 dark:bg-gray-900 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {config.features.title}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {config.features.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {config.features.items.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8"
                >
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-6">
                    {feature.title}
                  </h3>
                  <ul className="space-y-4">
                    {feature.items.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <AiOutlineCheckCircle
                          className="w-5 h-5 flex-shrink-0 mt-0.5"
                          style={{ color: experience.accent }}
                        />
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Resources Section */}
      {config.resources && (
        <section className="bg-white dark:bg-gray-950 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {config.resources.title}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {config.resources.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {config.resources.items.map((resource) => (
                <div
                  key={resource.title}
                  className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {resource.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {config.faq && (
        <section className="bg-gray-50 dark:bg-gray-900 py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {config.faq.title}
              </h2>
            </div>

            <div className="space-y-4">
              {config.faq.items.map((item, idx) => (
                <details
                  key={idx}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 cursor-pointer group"
                >
                  <summary className="font-bold text-gray-900 dark:text-white flex justify-between items-center list-none">
                    {item.q}
                    <span
                      className="transition-transform"
                      style={{ color: experience.accent }}
                    >
                      +
                    </span>
                  </summary>
                  <p className="text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA Section */}
      {config.cta && (
        <section
          className="py-16 md:py-24 text-white"
          style={{ backgroundColor: experience.accent }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {config.cta.title}
            </h2>
            <p className="text-lg mb-10 max-w-2xl mx-auto opacity-90">
              {config.cta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={config.cta.primaryButton.to}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 font-bold rounded-xl transition-colors"
              >
                {config.cta.primaryButton.label}
                <AiOutlineArrowRight size={20} />
              </Link>
              {config.cta.secondaryButton && (
                <Link
                  to={config.cta.secondaryButton.to}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
                >
                  {config.cta.secondaryButton.label}
                </Link>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default UnifiedLandingPage;
