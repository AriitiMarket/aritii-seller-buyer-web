import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '@/public/layout/PublicLayout';
import { EXPERIENCES } from '@/public/experiences';
import ExperiencePageHeader from '@/public/components/ExperiencePageHeader';
import FaqAccordion from '@/public/components/FaqAccordion';
import {
  AiOutlineSearch,
  AiOutlineInbox,
  AiOutlineRollback,
  AiOutlineCreditCard,
  AiOutlineCar,
  AiOutlineShop,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineCustomerService,
} from 'react-icons/ai';

const HELP_CATEGORIES = [
  { id: 'all', label: 'All Topics' },
  { id: 'orders', label: 'Orders & Tracking' },
  { id: 'delivery', label: 'Shipping & Delivery' },
  { id: 'payments', label: 'Payments & Escrow' },
  { id: 'returns', label: 'Returns & Refunds' },
  { id: 'sellers', label: 'Sellers & Logistics' },
];

const FAQS = [
  {
    category: 'orders',
    question: 'How do I track my order status in real time?',
    answer:
      'You can track your order at any time by signing into your account and clicking "Returns & Orders" or visiting your Buyer Dashboard. You can see whether your order is Placed, Processing, Dispatched with a delivery rider, or Delivered.',
  },
  {
    category: 'orders',
    question: 'Can I modify or cancel my order after placing it?',
    answer:
      'You can cancel an order before the seller confirms and dispatches it. Simply go to Your Orders, select the order, and click "Cancel Order". If the order is already in transit, you can initiate a return upon receipt.',
  },
  {
    category: 'delivery',
    question: 'Which areas and regions in Ethiopia are covered for delivery?',
    answer:
      'Aritii covers key metropolitan zones including Addis Ababa (Bole, Kirkos, Yeka, Arada, Gullele, etc.), Dire Dawa, Hawassa, Adama, Bahir Dar, and regional transit hubs. Select your specific delivery zone in the top header bar to see tailored delivery times.',
  },
  {
    category: 'delivery',
    question: 'What are the estimated delivery timelines?',
    answer:
      'Local deliveries within the same metropolitan zone are typically fulfilled same-day or within 24 hours. Inter-regional deliveries typically take 2 to 3 business days via verified Aritii logistics partners.',
  },
  {
    category: 'payments',
    question: 'What payment methods are supported on Aritii?',
    answer:
      'We accept secure digital payments via Telebirr, CBE Birr, Chapa (Visa/Mastercard/local banks), Awash Birr, and Cash on Delivery for eligible local orders.',
  },
  {
    category: 'payments',
    question: 'How does Aritii Buyer Protection and Escrow work?',
    answer:
      'When you pay online, your funds are safely held in escrow by Aritii until you inspect and receive your package. Only after successful delivery are funds released to the seller, ensuring 100% protection against fraudulent listings.',
  },
  {
    category: 'returns',
    question: 'What is the return and refund policy?',
    answer:
      'Aritii provides an easy 7-day return window for items that are damaged, defective, or significantly different from the seller description. To initiate a return, go to Your Orders, select the item, and click "Request Return". Once approved and returned, your refund is credited directly to your payment method.',
  },
  {
    category: 'sellers',
    question: 'How can I become a verified seller on Aritii?',
    answer:
      'Opening a shop on Aritii is 100% free to start! Visit our Seller Center at /seller-center, click "Start Selling", submit your shop details and business license/TIN, and begin listing products once verified.',
  },
  {
    category: 'sellers',
    question: 'How can delivery drivers and riders join the fleet?',
    answer:
      'Delivery partners with a motorbike, bicycle, van, or truck can sign up via our Delivery Center at /delivery-center. Get onboarded within 24 hours and earn weekly payouts for every completed route.',
  },
];

const CustomerServicePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredFaqs = useMemo(() => {
    return FAQS.filter((item) => {
      const matchesTab = activeTab === 'all' || item.category === activeTab;
      const matchesSearch =
        !searchTerm.trim() ||
        item.question.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase().trim());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchTerm]);

  return (
    <PublicLayout>
      <ExperiencePageHeader
        experience={EXPERIENCES.marketplace}
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Customer Service' }]}
        badge="Aritii Help & Customer Care"
        title="How can we help you today?"
        description="Find fast answers, track deliveries, manage returns, or connect with our dedicated Ethiopian support team."
        size="sm"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <AiOutlineSearch size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search help topics, return policies, delivery zones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-850 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#75d04b] focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Self-Service Quick Action Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          <Link
            to="/my-dashboard/orders"
            className="flex flex-col items-center text-center p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a222d] shadow-xs hover:border-[#75d04b] hover:shadow-md transition group"
          >
            <div className="w-12 h-12 rounded-full bg-[#75d04b]/15 text-[#5ac12f] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <AiOutlineInbox size={24} />
            </div>
            <h3 className="font-bold text-sm text-[#0F1111] dark:text-white mb-1">Your Orders</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Track shipments & view invoices</p>
          </Link>

          <Link
            to="/my-dashboard/orders"
            className="flex flex-col items-center text-center p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a222d] shadow-xs hover:border-[#75d04b] hover:shadow-md transition group"
          >
            <div className="w-12 h-12 rounded-full bg-[#FF9900]/15 text-[#FF9900] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <AiOutlineRollback size={24} />
            </div>
            <h3 className="font-bold text-sm text-[#0F1111] dark:text-white mb-1">Returns & Refunds</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Return items & track refunds</p>
          </Link>

          <Link
            to="/delivery"
            className="flex flex-col items-center text-center p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a222d] shadow-xs hover:border-[#75d04b] hover:shadow-md transition group"
          >
            <div className="w-12 h-12 rounded-full bg-[#00A8E1]/15 text-[#00A8E1] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <AiOutlineCar size={24} />
            </div>
            <h3 className="font-bold text-sm text-[#0F1111] dark:text-white mb-1">Delivery Rates</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Explore rates across zones</p>
          </Link>

          <Link
            to="/seller-center"
            className="flex flex-col items-center text-center p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a222d] shadow-xs hover:border-[#75d04b] hover:shadow-md transition group"
          >
            <div className="w-12 h-12 rounded-full bg-purple-500/15 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <AiOutlineShop size={24} />
            </div>
            <h3 className="font-bold text-sm text-[#0F1111] dark:text-white mb-1">Seller Hub</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Open & manage your store</p>
          </Link>
        </div>

        {/* Topic Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6 border-b border-gray-200 dark:border-gray-800">
          {HELP_CATEGORIES.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-[#131921] dark:bg-white text-white dark:text-[#131921] shadow-xs'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="max-w-4xl mx-auto mb-16">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No matching help topics found for "{searchTerm}".
            </div>
          ) : (
            <FaqAccordion items={filteredFaqs} idPrefix="cs-faq" />
          )}
        </div>

        {/* Dedicated Support Channels */}
        <div className="bg-gray-50 dark:bg-[#131921] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-10">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F1111] dark:text-white mb-2">
              Still need assistance?
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Our Ethiopian customer support team is available Monday through Saturday to assist you with orders, payments, and storefronts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="flex items-start gap-4 p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 rounded-lg bg-[#75d04b]/15 text-[#5ac12f] flex items-center justify-center flex-shrink-0">
                <AiOutlineMail size={22} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#0F1111] dark:text-white mb-1">Email Support</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Responses within 2 to 4 business hours</p>
                <a
                  href="mailto:support@aritii.market"
                  className="text-xs font-bold text-[#75d04b] hover:underline"
                >
                  support@aritii.market →
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 rounded-lg bg-[#00A8E1]/15 text-[#00A8E1] flex items-center justify-center flex-shrink-0">
                <AiOutlineCustomerService size={22} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#0F1111] dark:text-white mb-1">Support Hours</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Monday – Saturday: 8:30 AM – 6:30 PM EAT</p>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Addis Ababa, Ethiopia
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default CustomerServicePage;
