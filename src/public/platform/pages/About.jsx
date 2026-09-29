import React from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '@/public/layout/PublicLayout';
import { EXPERIENCES, PLATFORM_EXPERIENCES } from '@/public/experiences';
import ExperiencePageHeader from '@/public/components/ExperiencePageHeader';

/**
 * About page (/about) — platform story. Uses the standard ExperiencePageHeader
 * (Marketplace accent as the neutral platform context) for consistency with
 * every other public page.
 */
const AboutPage = () => {
  return (
    <PublicLayout>
      <ExperiencePageHeader
        experience={EXPERIENCES.marketplace}
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'About' }]}
        badge="About Aritii Market"
        title="Ethiopia's trusted multi-vendor marketplace"
        description="Aritii Market connects customers with local sellers and makes trusted commerce accessible across Ethiopia — one platform for buyers, sellers and delivery services."
      />

      {/* One platform, three experiences */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            One platform, three connected experiences
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
            Buyers discover and order, sellers provide products, and delivery services connect
            orders to customers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-14">
          {PLATFORM_EXPERIENCES.map((exp) => (
            <Link
              key={exp.key}
              to={exp.base === '/' ? '/marketplace' : exp.base}
              className={`group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${exp.border}`}
            >
              <span className={`inline-block px-3 py-1 mb-4 rounded-full text-xs font-bold uppercase tracking-wider ${exp.badge}`}>
                {exp.label}
              </span>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{exp.tagline}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {exp.key === 'marketplace' &&
                  'Browse products and shops, compare options, place orders and track deliveries.'
                }
                {exp.key === 'seller' &&
                  'Open your shop, manage products and orders, and reach buyers across Ethiopia.'
                }
                {exp.key === 'delivery' &&
                  'Receive requests, run assignments, routes and zones, and complete deliveries.'
                }
              </p>
              <span className={`mt-4 inline-block text-sm font-semibold ${exp.accentText}`}>
                Explore {exp.label} →
              </span>
            </Link>
          ))}
        </div>

        {/* Mission / Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Aritii Market connects customers with local sellers and makes trusted commerce
              accessible across Ethiopia.
            </p>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h2>
            <p className="text-gray-600 dark:text-gray-400">
              To build a reliable, inclusive marketplace where buyers and independent businesses
              can grow together.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 md:p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              A marketplace built around trust
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Browse verified products, discover independent shops, and manage your purchases in
              one customer experience.
            </p>
          </div>
        </div>

        {/* Values */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Our Values</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Trust', 'Local Growth', 'Simple Shopping', 'Customer First'].map((value) => (
              <div
                key={value}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-5 rounded-2xl text-center"
              >
                <p className="font-semibold text-gray-900 dark:text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default AboutPage;
