import React from 'react';
import { MdWarning, MdInfo } from 'react-icons/md';
import { useProviderDelivery } from '../hooks/useProviderDelivery';

/**
 * Warnings - shows provider warnings and notifications.
 */
const Warnings = () => {
  const { supported } = useProviderDelivery();

  if (!supported) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Warnings</h1>
          <p className="text-gray-600 mt-1">View warnings and notifications.</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <p className="text-amber-800">
            <strong>Warnings Not Available:</strong> The warning/notification system is not currently supported by the delivery service.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Warnings</h1>
        <p className="text-gray-600 mt-1">View warnings and notifications.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <MdInfo className="mx-auto text-gray-300 mb-4" size={48} />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No warnings at this time</h3>
        <p className="text-gray-500">
          You have no warnings or notifications. We'll notify you if any issues require your attention.
        </p>
      </div>
    </div>
  );
};

export default Warnings;
