import React, { useState } from 'react';

/**
 * Newsletter - Email signup for updates and deals
 * Builds user engagement and retention
 */
const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      // Here you would typically call an API to subscribe
      setSubscribed(true);
      setEmail('');
    }
  };

  if (subscribed) {
    return (
      <section className="py-10 md:py-14 bg-[#FDF6EC] dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#75d04b]/10 text-[#75d04b] rounded-full">
            <span className="text-2xl">✓</span>
            <span className="font-semibold">Thanks for subscribing!</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 md:py-14 bg-[#FDF6EC] dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Stay Updated
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Subscribe to get the latest deals, new arrivals, and exclusive offers delivered to your inbox.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#75d04b]"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#75d04b] hover:bg-[#5ac12f] text-white font-semibold rounded-lg transition-colors"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export { Newsletter };
export default Newsletter;
