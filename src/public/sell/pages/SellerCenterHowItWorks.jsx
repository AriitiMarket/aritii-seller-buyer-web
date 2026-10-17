import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineArrowRight } from 'react-icons/ai';
import SellerCenterLayout from '@/public/sell/layout/SellerCenterLayout';
import SellerHowItWorks from '@/public/sell/components/SellerHowItWorks';

/**
 * SellerCenterHowItWorksPage — /seller-center/how-it-works
 *
 * Step-by-step guide to becoming a seller on Aritii.
 * Uses independent SellerCenterLayout for header and navigation.
 */
const SellerCenterHowItWorksPage = () => {
  return (
    <SellerCenterLayout>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-[#131921] to-[#232f3e] text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 mb-4 rounded-full bg-[#FF9900]/20 text-[#FF9900] text-xs font-bold uppercase tracking-wider">
              Get Started
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              From sign-up to first sale
            </h1>
            <p className="text-lg text-white/90">
              Four simple steps. No hidden fees. No surprises. Just a straightforward path to selling on Aritii.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <SellerHowItWorks />
      </section>

      {/* Detailed Steps */}
      <section className="bg-white dark:bg-gray-900 py-12 md:py-16 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-10 text-center">
            What happens at each step
          </h2>

          <div className="space-y-8">
            {[
              {
                step: '1',
                title: 'Create Your Account',
                description: 'Sign up free with your email or phone number. One account lets you buy and sell on Aritii. It takes less than 2 minutes.',
                details: [
                  'No upfront fees to register',
                  'Free seller account creation',
                  'Set your shop name and profile',
                ],
              },
              {
                step: '2',
                title: 'Apply as a Seller',
                description: "Tell us about your business and the shop you want to open. We need some basic information to verify your identity and location.",
                details: [
                  'Business information form',
                  'Shop details and category',
                  'Contact and location verification',
                ],
              },
              {
                step: '3',
                title: 'Get Approved',
                description: 'Our team reviews your application, usually within 1-3 business days. We verify that your shop meets Aritii standards.',
                details: [
                  'We review your application',
                  "You'll receive an email notification",
                  'No approval fee',
                ],
              },
              {
                step: '4',
                title: 'List and Sell',
                description: 'Upload your products, set prices and stock, then go live. Your shop appears in the marketplace and customers can start buying.',
                details: [
                  'Access your seller dashboard',
                  'Upload products with photos and descriptions',
                  'Receive orders and manage delivery',
                ],
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex gap-6 p-8 bg-gray-50 dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800"
              >
                <div className="flex-shrink-0">
                  <div
                    className="flex items-center justify-center w-16 h-16 rounded-full text-white font-bold text-2xl"
                    style={{ backgroundColor: exp.accent }}
                  >
                    {item.step}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{item.description}</p>
                  <ul className="space-y-2">
                    {item.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                        <span className="inline-block w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: exp.accent }} />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-[#FDF6EC] dark:bg-gray-950 py-12 md:py-16 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-10 text-center">
            Common Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: 'How long does approval take?',
                a: "Most seller applications are approved within 1-3 business days. You'll receive an email notification with your status.",
              },
              {
                q: 'Is there a fee to open a shop?',
                a: 'No. Opening a seller account on Aritii is completely free. We only take a small commission on successful sales.',
              },
              {
                q: 'What do I need to get started?',
                a: 'Just your identity (ID or passport), location information, business details, and product information. No legal entity required to start.',
              },
              {
                q: 'Can I sell from anywhere in Ethiopia?',
                a: 'Yes. Aritii sellers are located across Ethiopia. Delivery is available in our coverage zones.',
              },
            ].map((item) => (
              <details
                key={item.q}
                className="group p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 cursor-pointer"
              >
                <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
                  {item.q}
                  <span className="inline-block transition-transform group-open:rotate-180">▼</span>
                </summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            Preview your seller workspace or start your application now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/seller-center/workspace"
              className="px-8 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Workspace Preview
            </Link>
            <Link
              to="/seller-sign-up"
              className={`group inline-flex items-center justify-center gap-2 px-8 py-3 font-bold rounded-lg transition-colors ${exp.button}`}
            >
              Start Selling
              <AiOutlineArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
          </div>
        </div>
      </section>
    </SellerCenterLayout>
  );
};

export default SellerCenterHowItWorksPage;
