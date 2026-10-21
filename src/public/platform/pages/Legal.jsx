import React from 'react';
import { PublicLayout } from '@/public/layout/PublicLayout';
import { EXPERIENCES } from '@/public/experiences';
import ExperiencePageHeader from '@/public/components/ExperiencePageHeader';

/**
 * Legal pages (/privacy, /terms, /cookie) — one page, three documents.
 *
 * The content below is a PLACEHOLDER skeleton: it describes the structure the
 * final legal review will fill in, and must be replaced with counsel-approved
 * text before launch.
 */
const DOCUMENTS = {
  privacy: {
    title: 'Privacy Policy',
    description: 'How Aritii Market collects, uses and protects your personal data.',
    sections: [
      {
        heading: 'Information we collect',
        body: 'We collect the information you provide when you create an account, place an order, list a product or apply to deliver — such as your name, contact details, pickup and delivery addresses, and payment or payout details.',
      },
      {
        heading: 'How we use your information',
        body: 'We use your information to process orders, deliver goods, pay sellers and delivery partners, provide support, and prevent fraud. We do not sell your personal information to third parties.',
      },
      {
        heading: 'Sharing and retention',
        body: 'We share only the information a buyer, seller or delivery partner needs to complete a transaction, and we keep it only for as long as required by law and our operational needs.',
      },
      {
        heading: 'Your rights',
        body: 'You can request a copy of your data, ask us to correct it, or ask us to delete it by contacting support@aritii.market.',
      },
    ],
  },
  terms: {
    title: 'Terms of Service',
    description: 'The rules that govern the use of Aritii Market by buyers, sellers and delivery partners.',
    sections: [
      {
        heading: 'Using the platform',
        body: 'You may use Aritii Market if you can form a binding contract, you provide accurate information, and you use the platform lawfully.',
      },
      {
        heading: 'Orders and payment',
        body: 'Prices are shown in Ethiopian Birr (ETB). A contract forms when we confirm an order. Payment is collected through our supported methods, and refunds follow the return policy published on the relevant product page.',
      },
      {
        heading: 'Sellers and delivery partners',
        body: 'Sellers are responsible for the accuracy of their listings, the quality and legality of their goods, and fulfilment within the stated delivery window. Delivery partners must hold the valid documents required to operate in their zone.',
      },
      {
        heading: 'Changes to these terms',
        body: 'We may update these terms. Material changes are announced on the platform and take effect from the date stated in the notice.',
      },
    ],
  },
  cookie: {
    title: 'Cookie Policy',
    description: 'The cookies and similar technologies Aritii Market uses to run and improve the platform.',
    sections: [
      {
        heading: 'Essential cookies',
        body: 'These keep you signed in, remember your cart and delivery location, and protect forms against abuse. The platform cannot work without them.',
      },
      {
        heading: 'Preference cookies',
        body: 'These remember choices such as your selected delivery zone and your last used sort order, so the platform behaves the way you left it.',
      },
      {
        heading: 'Analytics',
        body: 'We measure aggregated usage so we can find and fix broken journeys. Analytics data is not used to build advertising profiles.',
      },
      {
        heading: 'Managing cookies',
        body: 'You can clear or block cookies in your browser settings. Blocking essential cookies will stop parts of the platform from working.',
      },
    ],
  },
};

const LegalPage = ({ doc = 'privacy' }) => {
  const document = DOCUMENTS[doc] || DOCUMENTS.privacy;

  return (
    <PublicLayout>
      <ExperiencePageHeader
        experience={EXPERIENCES.marketplace}
        breadcrumb={[{ label: 'Home', to: '/' }, { label: document.title }]}
        badge="Legal"
        title={document.title}
        description={document.description}
        size="sm"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <p className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
          This document is a placeholder pending final legal review.
        </p>

        <div className="space-y-8">
          {document.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2">
                {section.heading}
              </h2>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <p className="mt-10 text-sm text-gray-500 dark:text-gray-400">
          Questions? Email{' '}
          <a
            href="mailto:support@aritii.market"
            className="font-semibold text-[#75d04b] hover:text-[#5ac12f]"
          >
            support@aritii.market
          </a>
        </p>
      </div>
    </PublicLayout>
  );
};

export default LegalPage;
