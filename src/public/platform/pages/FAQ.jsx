import React from 'react';
import { PublicLayout } from '@/public/layout/PublicLayout';
import { EXPERIENCES } from '@/public/experiences';
import ExperiencePageHeader from '@/public/components/ExperiencePageHeader';
import FaqAccordion from '@/public/components/FaqAccordion';

/**
 * FAQ page (/faq) — help center. Standard ExperiencePageHeader + the shared
 * accessible accordion pattern (button + aria-expanded, chevron swap).
 */
const FAQPage = () => {
  const faqs = [
    {
      question: 'What is your return policy?',
      answer:
        "If you're not satisfied with your purchase, we accept returns within 30 days of delivery. To initiate a return, please email us at support@aritii.market with your order number and a brief explanation of why you're returning the item.",
    },
    {
      question: 'How do I track my order?',
      answer:
        'You can track your order by clicking the tracking link in your shipping confirmation email, or by logging into your account on our website and viewing the order details.',
    },
    {
      question: 'How do I contact customer support?',
      answer:
        'You can contact our customer support team by emailing us at support@aritii.market, or by calling us at (555) 123-4567 between the hours of 9am and 5pm EAT, Monday through Friday.',
    },
    {
      question: 'Can I change or cancel my order?',
      answer:
        "Unfortunately, once an order has been placed, we are not able to make changes or cancellations. If you no longer want the items you've ordered, you can return them for a refund within 30 days of delivery.",
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Currently, we only offer shipping within Ethiopia.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept Visa, Mastercard, CBE Birr, and cash on delivery.',
    },
  ];

  return (
    <PublicLayout>
      <ExperiencePageHeader
        experience={EXPERIENCES.marketplace}
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'FAQ' }]}
        badge="Help Center"
        title="Frequently Asked Questions"
        description="Quick answers about ordering, delivery, payments and returns on Aritii Market."
        size="sm"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <FaqAccordion items={faqs} idPrefix="faq" />

        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Still need help? Email{' '}
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

export default FAQPage;
