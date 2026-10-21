import React, { useMemo } from 'react';
import { FaTruck, FaMapMarkerAlt, FaMoneyBillWave, FaClock } from 'react-icons/fa';
import { useDeliveryLocation } from '@/shared/hooks/useDeliveryLocation';
import { useDeliveryZones } from '@/shared/hooks/useDeliveryZones';
import { money2 } from '@/shared/utils/deliveryPricing';

/**
 * DeliveryAvailability — what the buyer can actually get in the zone they
 * selected.
 *
 * Every fact here comes from the Delivery Service's own zone rules
 * (`GET /delivery/zone/public`): whether the zone is serviceable, whether it
 * offers cash on delivery, whether it offers store pickup, how long delivery
 * takes and what it costs. It used to be a hardcoded panel that always said
 * "Available" for everything and listed delivery options ("Standard, Express")
 * that no service actually offers — the buyer was told things the platform
 * could not honour.
 *
 * With no zone selected the panel says so instead of guessing.
 */
export function DeliveryAvailability() {
  const { zoneId, zoneName, hasZone } = useDeliveryLocation();
  const { zones, loading, error } = useDeliveryZones();

  const zone = useMemo(
    () => (hasZone ? zones.find((candidate) => String(candidate._id) === String(zoneId)) || null : null),
    [zones, zoneId, hasZone]
  );

  if (!hasZone) {
    return (
      <div className="mt-6 border border-gray-200 rounded-lg p-4 bg-gray-50 dark:bg-dark-900 dark:border-dark-600">
        <h3 className="text-sm font-semibold mb-2 dark:text-gray-200">Delivery & Pickup</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Select a delivery area to see the delivery options, cost and timing for this shop.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mt-6 border border-gray-200 rounded-lg p-4 bg-gray-50 dark:bg-dark-900 dark:border-dark-600">
        <h3 className="text-sm font-semibold mb-2 dark:text-gray-200">Delivery & Pickup</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading delivery options…</p>
      </div>
    );
  }

  if (error || !zone) {
    return (
      <div className="mt-6 border border-amber-200 rounded-lg p-4 bg-amber-50 dark:bg-amber-950">
        <h3 className="text-sm font-semibold mb-2 text-amber-900 dark:text-amber-200">Delivery & Pickup</h3>
        <p className="text-sm text-amber-800 dark:text-amber-300">
          Delivery options for {zoneName || 'your area'} could not be loaded right now. Please try again shortly.
        </p>
      </div>
    );
  }

  const deliveryAvailable = true; // the public list only contains serviceable zones
  const pickupAvailable = Boolean(zone.pickupAvailable);
  const codAvailable = zone.codAvailable !== false;
  const eta = zone.estimatedDeliveryTime || null;

  return (
    <div className="mt-6 border border-gray-200 rounded-lg p-4 bg-gray-50 dark:bg-dark-900 dark:border-dark-600">
      <h3 className="text-sm font-semibold mb-3 dark:text-gray-200">Delivery & Pickup</h3>
      <ul className="space-y-2 text-sm">
        <li className="flex items-center text-gray-700 dark:text-gray-300">
          <FaTruck className="mr-2 text-brand-primary" /> Delivery to your location:{' '}
          <span className={`ml-2 font-medium ${deliveryAvailable ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
            {deliveryAvailable ? 'Available' : 'Not available'}
          </span>
        </li>
        <li className="flex items-center text-gray-700 dark:text-gray-300">
          <FaMapMarkerAlt className="mr-2 text-brand-primary" /> Pickup:{' '}
          <span className={`ml-2 font-medium ${pickupAvailable ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
            {pickupAvailable ? 'Available' : 'Not available'}
          </span>
        </li>
        <li className="flex items-center text-gray-700 dark:text-gray-300">
          <FaMoneyBillWave className="mr-2 text-brand-primary" /> Cash on Delivery:{' '}
          <span className={`ml-2 font-medium ${codAvailable ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
            {codAvailable ? 'Available' : 'Not available'}
          </span>
        </li>
      </ul>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
        {eta && (
          <span className="inline-flex items-center gap-1">
            <FaClock /> Estimated delivery: {eta}
          </span>
        )}
        {Number(zone.deliveryFee) > 0 && (
          <span>Delivery fee: {money2(zone.deliveryFee).toFixed(2)} ETB</span>
        )}
        {Number(zone.freeDeliveryThreshold) > 0 && (
          <span>Free delivery over {money2(zone.freeDeliveryThreshold).toFixed(2)} ETB</span>
        )}
      </div>
    </div>
  );
}

export default DeliveryAvailability;
