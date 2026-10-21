import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdLocalShipping, MdLocationOn, MdStore, MdMap } from 'react-icons/md';
import { useProvider } from '../hooks/useProvider';
import { providerDeliveryApi } from '../services/providerDeliveryApi';
import { locationService } from '@/services/location.service';

/**
 * OperatingArea - shows the provider's assigned operating area.
 *
 * Reads assigned Zone, Port and City records from the provider-scoped coverage
 * endpoint and the public location hierarchy for the network overview.
 */
const OperatingArea = () => {
  const { isProvider } = useProvider();
  const [profile, setProfile] = useState(null);
  const [coverage, setCoverage] = useState({ zones: [], port: null, city: null });
  const [hierarchy, setHierarchy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isProvider) return;
    let cancelled = false;
    setLoading(true);
    Promise.all([
      providerDeliveryApi
        .getProviderProfile()
        .then(({ profile: loaded }) => {
          if (!cancelled) setProfile(loaded || null);
        }),
      providerDeliveryApi.getProviderCoverage().then((loaded) => {
        if (!cancelled) setCoverage(loaded);
      }),
      locationService
        .getHierarchy()
        .then((h) => {
          if (!cancelled) setHierarchy(h || []);
        }),
    ])
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isProvider]);

  if (!isProvider) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Operating Area</h1>
          <p className="text-gray-600 mt-1">
            Your delivery coverage area and assigned zones.
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <p className="text-amber-800">
            <strong>Provider Access Required:</strong> You don't have provider
            access. Please contact support if you believe this is an error.
          </p>
        </div>
      </div>
    );
  }

  const zones = coverage.zones || [];

  const topLevel = hierarchy.filter((loc) => !loc.parentId);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Operating Area</h1>
          <p className="text-gray-600 mt-1">
            Your delivery coverage area and assigned zones.
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <span className="h-6 w-6 animate-spin rounded-full border-4 border-gray-200 border-t-[#75d04b]" />
          <p className="mt-2 text-sm text-gray-500">Loading your operating area\u2026</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Operating Area</h1>
          <p className="text-gray-600 mt-1">
            Your delivery coverage area and assigned zones.
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800">
          Could not load your operating area: {error?.response?.data?.message || error?.message || 'Please try again later.'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Operating Area</h1>
          <p className="text-gray-600 mt-1">
            Your delivery coverage area and assigned zones.
          </p>
        </div>
        <Link
          to="/provider"
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#75d04b] hover:text-[#5ac12f] transition"
        >
          <MdLocalShipping size={16} /> Back to Overview
        </Link>
      </div>

      {/* Provider coverage summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Coverage</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Zones</p>
            <p className="text-lg font-bold text-gray-900">
              {zones.length > 0 ? zones.length : 'None assigned'}
            </p>
            {zones.length > 0 && <p className="mt-1 text-sm text-gray-600">{zones.map((zone) => zone.name).join(', ')}</p>}
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Port</p>
            <p className="text-lg font-bold text-gray-900">
              {coverage.port?.name || 'None assigned'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">City</p>
            <p className="text-lg font-bold text-gray-900">{coverage.city?.name || 'None assigned'}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Status</p>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
              profile?.availability?.isOnline
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {profile?.availability?.isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Assigned zones */}
      {zones.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Assigned Zones
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            These are the zones your provider account is authorised to work in.
          </p>
          <div className="flex flex-wrap gap-2">
            {zones.map((zone) => (
              <span key={zone.id} className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100">
                {zone.name}{zone.status && zone.status !== 'active' ? ` (${zone.status})` : ''}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Operating area hierarchy */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Location Network
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Regions and cities configured in the delivery network. Your assigned zones and port are listed above.
        </p>
        {!hierarchy.length ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <MdMap className="mx-auto text-gray-300 mb-3" size={32} />
            <p className="text-gray-500 text-sm">No operating areas published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topLevel.map((region) => (
              <div key={region._id || region.name} className="p-4 rounded-lg border border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2 mb-3">
                  <MdStore className="text-[#75d04b]" size={18} />
                  <span className="font-semibold text-gray-900">{region.name}</span>
                </div>
                {region.children && region.children.length > 0 ? (
                  <div className="space-y-1">
                    {region.children.map((city) => (
                      <div key={city._id || city.name} className="flex items-center justify-between py-1">
                        <span className="text-sm text-gray-700">{city.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic mt-2">
                    No cities published yet
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-amber-50 rounded-lg p-4 text-sm text-amber-700 border border-amber-100">
        <MdLocationOn className="text-amber-600 mr-2" size={16} />
        Your port and zone assignments are managed by Aritii administrators \u2014 contact support to
        request a coverage change. All monetary values are in Ethiopian Birr
        (ETB).
      </div>
    </div>
  );
};

export default OperatingArea;
