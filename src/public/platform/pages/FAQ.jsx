import React, { useState } from 'react';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { PublicLayout } from '@/public/layout/PublicLayout';
import { EXPERIENCES } from '@/public/experiences';
import ExperiencePageHeader from '@/public/components/ExperiencePageHeader';

/**
 * FAQ page (/faq) — help center. Standard ExperiencePageHeader + a single
 * accessible accordion pattern (button + aria-expanded, chevron swap).
 */
const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(-1);

  const toggleTab = (index) => {
    setOpenIndex((current) => (current === index ? -1 : index));
  };

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
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`bg-white dark:bg-gray-900 rounded-2xl border transition-colors ${
                  isOpen
                    ? 'border-[#75d04b] shadow-sm'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <button
                  className="flex items-center justify-between gap-4 w-full text-left px-5 md:px-6 py-4 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75d04b]"
                  onClick={() => toggleTab(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${index}`}
                >
                  <span className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                    {faq.question}
                  </span>
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isOpen ? 'bg-[#75d04b] text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300'
                    }`}
                    aria-hidden="true"
                  >
                    {isOpen ? <AiOutlineMinus size={16} /> : <AiOutlinePlus size={16} />}
                  </span>
                </button>
                {isOpen && (
                  <div id={`faq-panel-${index}`} className="px-5 md:px-6 pb-5">
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-4">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

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
