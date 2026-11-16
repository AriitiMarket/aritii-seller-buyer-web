import React from 'react';
import { MdInfo } from 'react-icons/md';

/**
 * Warnings - shows provider warnings and notifications.
 *
 * The delivery service has no warning/notification endpoint yet, so this page
 * is a static placeholder. It does not fetch deliveries to decide support.
 */
const Warnings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Warnings</h1>
        <p className="text-gray-600 mt-1">View warnings and notifications.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <MdInfo className="mx-auto text-gray-300 mb-4" size={48} />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Warnings aren’t available in this portal yet</h3>
        <p className="text-gray-500">
          The delivery service does not currently provide a warnings feed, so this page cannot confirm whether you have warnings.
        </p>
        <a className="inline-block mt-4 text-blue-600 hover:underline" href="mailto:support@aritii.market?subject=Delivery%20provider%20support">Contact provider support</a>
      </div>
    </div>
  );
};

export default Warnings;
