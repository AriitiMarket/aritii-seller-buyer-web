import React, { useState } from "react";
import { PublicLayout } from '@/public/layout/PublicLayout';

const FAQPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const toggleTab = (tab) => {
    if (activeTab === tab) {
      setActiveTab(0);
    } else {
      setActiveTab(tab);
    }
  };

  const faqs = [
    { 
      question: "What is your return policy?", 
      answer: "If you're not satisfied with your purchase, we accept returns within 30 days of delivery. To initiate a return, please email us at support@aritii.market with your order number and a brief explanation of why you're returning the item."
    },
    { 
      question: "How do I track my order?", 
      answer: "You can track your order by clicking the tracking link in your shipping confirmation email, or by logging into your account on our website and viewing the order details."
    },
    { 
      question: "How do I contact customer support?", 
      answer: "You can contact our customer support team by emailing us at support@aritii.market, or by calling us at (555) 123-4567 between the hours of 9am and 5pm EAT, Monday through Friday."
    },
    { 
      question: "Can I change or cancel my order?", 
      answer: "Unfortunately, once an order has been placed, we are not able to make changes or cancellations. If you no longer want the items you've ordered, you can return them for a refund within 30 days of delivery."
    },
    { 
      question: "Do you offer international shipping?", 
      answer: "Currently, we only offer shipping within Ethiopia."
    },
    { 
      question: "What payment methods do you accept?", 
      answer: "We accept Visa, Mastercard, CBE Birr, and cash on delivery."
    },
  ];

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-16">
        <div className="mb-8">
          <span className="inline-block px-4 py-1.5 bg-[#75d04b] rounded-full/10 text-[#75d04b] text-sm font-semibold rounded-full mb-3">
            Help Center
          </span>
          <h2 className="text-3xl font-bold text-[#1F2937]">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-4">
              <button
                className="flex items-center justify-between w-full"
                onClick={() => toggleTab(index + 1)}
              >
                <span className="text-lg font-medium text-gray-900 dark:text-white font-bold">
                  {faq.question}
                </span>
                {activeTab === index + 1 ? (
                  <svg
                    className="h-6 w-6 text-gray-500 dark:text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 text-gray-500 dark:text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
              </button>
              {activeTab === index + 1 && (
                <div className="mt-4">
                  <p className="text-base text-gray-500 dark:text-gray-400">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
};

export default FAQPage;