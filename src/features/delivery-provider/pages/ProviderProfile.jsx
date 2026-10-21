import React, { useEffect, useState } from 'react';
import { MdStore, MdPhone, MdWifi } from 'react-icons/md';
import { useProvider } from '../hooks/useProvider';
import { providerDeliveryApi } from '../services/providerDeliveryApi';

/**
 * ProviderProfile - shows provider profile and settings (read-only).
 *
 * The displayed record is the rider's OWN delivery-provider document
 * (`GET /delivery/provider/me`) — its `_id`, status and availability are the
 * delivery service's, not the identity account's. Profile fields
 * (name/phone/vehicle/plate) are admin-managed: the delivery API only lets a
 * provider flip their own availability (`PUT /delivery/provider/:id/online`),
 * which is done from the Overview page.
 */
const ProviderProfile = () => {
  const { isProvider, provider } = useProvider();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load this account's provider record (id, status, availability, vehicle).
  useEffect(() => {
    if (!isProvider) return;
    let cancelled = false;
    providerDeliveryApi
      .getProviderProfile()
      .then(({ profile: loaded, supported, message }) => {
        if (cancelled) return;
        setProfile(loaded || null);
        if (!supported) setError(message || 'Provider profile is not available for this account.');
      })
      .catch((err) => {
        if (!cancelled) setError(err?.response?.data?.message || err?.message || 'Could not load provider profile.');
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
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">Manage your provider profile and settings.</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <p className="text-amber-800">
            <strong>Provider Access Required:</strong> You don't have provider access. Please contact support if you believe this is an error.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">Loading provider profile…</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-1">Your delivery provider profile.</p>
      </div>

      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Provider Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Provider Information</h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Name</p>
              <p className="text-gray-900">{profile?.name || provider?.name || 'Not set'}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Phone</p>
              <div className="flex items-center gap-2">
                <MdPhone className="text-gray-400" size={16} />
                <p className="text-gray-900">{profile?.phone || provider?.phone || 'Not set'}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Provider ID</p>
              <p className="text-sm font-mono text-gray-500">{profile?._id || 'Not assigned'}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Account Status</p>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  profile?.status === 'available' || profile?.status === 'busy'
                    ? 'bg-green-100 text-green-700'
                    : profile?.status === 'suspended'
                      ? 'bg-red-100 text-red-700'
                      : profile?.status === 'offline'
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {profile?.status ? profile.status.replace(/_/g, ' ') : 'Unavailable'}
              </span>
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Vehicle Type</p>
              <div className="flex items-center gap-2">
                <MdStore className="text-gray-400" size={16} />
                <p className="text-gray-900">{profile?.vehicleType || provider?.vehicleType || 'Not set'}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">License Plate</p>
              <p className="text-gray-900">{profile?.plateNumber || 'Not set'}</p>
            </div>
          </div>
        </div>

        {/* Operations */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Operations</h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Active Deliveries</p>
              <p className="text-gray-900">
                {profile ? `${profile.activeDeliveries ?? 0} / ${profile.maxActiveAssignments ?? '—'}` : '—'}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Completed Deliveries</p>
              <p className="text-gray-900">{profile?.completedDeliveries ?? 0}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Availability Status</p>
              <div className="flex items-center gap-2">
                <MdWifi
                  className={profile?.availability?.isOnline ? 'text-green-600' : 'text-gray-400'}
                  size={16}
                />
                <span className="text-gray-900">
                  {profile?.availability?.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h2>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900 mb-1">Managed by Aritii</p>
              <p className="text-xs text-gray-500">
                Profile details (name, phone, vehicle), account status, approval, and verification are managed by Aritii administrators. Contact support for changes.
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-900 mb-1">Your Availability</p>
              <p className="text-xs text-green-700">
                Go online or offline from the availability toggle on the Overview page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;
