import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineArrowRight } from 'react-icons/ai';
import SellerCenterLayout from '@/public/sell/layout/SellerCenterLayout';
import { EXPERIENCES } from '@/public/experiences';
import ExperiencePageHeader from '@/public/components/ExperiencePageHeader';

/**
 * SellerCenterOverviewPage — /seller-center/overview
 *
 * Introduction to selling on Aritii with hero section and CTA.
 * Users can navigate to Benefits, How It Works, and Workspace pages.
 */
const SellerCenterOverviewPage = () => {
  const exp = EXPERIENCES.seller;

  return (
    <SellerCenterLayout>
      <ExperiencePageHeader
        experience={exp}
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Sell on Aritii' }]}
        badge="Seller Experience"
        title="Sell on Aritii. Grow with your local market."
        description="Aritii Market gives your business a storefront in front of local buyers, tools to manage products and orders, and a delivery network that moves every order to the customer. You focus on the product — we connect the rest."
        size="md"
        visual={(
          <img
            src="/seller.png"
            alt="Aritii Seller Hub with shop management and growth tools"
            width="1024"
            height="512"
            loading="eager"
            fetchPriority="high"
            className="block w-full rounded-2xl border border-white/20 shadow-2xl"
          />
        )}
        actions={
          <>
            <Link
              to="/seller-sign-up"
              className={`group inline-flex items-center justify-center gap-2 px-8 py-3.5 font-bold rounded-full text-base transition-colors focus-visible:outline-none focus-visible:ring-2 ${exp.button} ${exp.ring}`}
            >
              Start Selling
              <AiOutlineArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
            <Link
              to="/seller-center/benefits"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-full text-base border border-gray-300 dark:border-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f6e4f]"
            >
              Learn More
            </Link>
          </>
        }
      />

      {/* Quick highlight section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Reach Local Buyers',
              description: 'Your shop appears in front of customers actively searching for products like yours across Ethiopia.',
            },
            {
              title: 'Manage Everything',
              description: 'Products, orders, inventory, promotions and analytics — all in one seller dashboard.',
            },
            {
              title: 'Get Paid',
              description: 'Secure payments and fast payouts. Track your earnings and grow your business with confidence.',
            },
          ].map((item) => (
            <div key={item.title} className="p-6 bg-[#2f6e4f]/5 border border-[#2f6e4f]/20 rounded-xl">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Navigation to other sections */}
      <section className="bg-[#FDF6EC] dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Ready to dive deeper?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explore the benefits, see how it works, and preview your seller workspace.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/seller-center/benefits"
              className="px-6 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center"
            >
              View Benefits
            </Link>
            <Link
              to="/seller-center/how-it-works"
              className="px-6 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center"
            >
              How It Works
            </Link>
            <Link
              to="/seller-center/workspace"
              className="px-6 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center"
            >
              Workspace Preview
            </Link>
          </div>
        </div>
      </section>
    </SellerCenterLayout>
  );
};

export default SellerCenterOverviewPage;
