import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdLocalShipping, MdLocationOn, MdStore, MdMap } from 'react-icons/md';
import { useProvider } from '../hooks/useProvider';
import { providerDeliveryApi } from '../services/providerDeliveryApi';
import { locationService } from '@/services/location.service';

/**
 * OperatingArea - shows the provider's assigned operating area.
 *
 * Reads the caller's own provider record (zones, port) via
 * GET /delivery/provider/me and the public location hierarchy
 * (GET /delivery/location/hierarchy) so the provider can see which
 * regions, cities, zones and local delivery ports they cover.
 *
 * No new backend endpoints are introduced.
 */
const OperatingArea = () => {
  const { isProvider, provider } = useProvider();
  const [profile, setProfile] = useState(null);
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

  const zoneIds = profile?.zoneIds || (profile?.zoneId ? [profile.zoneId] : []);
  const portId = profile?.portId;
  const zoneNames = new Set();
  let portName = null;

  // Resolve zone and port names from the hierarchy.
  const findInHierarchy = (nodes, id) => {
    for (const node of nodes || []) {
      if (node._id === id) return node;
      if (node.children) {
        const found = findInHierarchy(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  if (hierarchy.length) {
    zoneIds.forEach((zid) => {
      const node = findInHierarchy(hierarchy, zid);
      if (node) zoneNames.add(node.name);
    });
    if (portId) {
      const portNode = findInHierarchy(hierarchy, portId);
      if (portNode) portName = portNode.name;
    }
  }

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

  if (error && !profile) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Operating Area</h1>
          <p className="text-gray-600 mt-1">
            Your delivery coverage area and assigned zones.
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800">
          Could not load your operating area. Please try again later.
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Zones</p>
            <p className="text-lg font-bold text-gray-900">
              {zoneNames.size > 0 ? zoneNames.size : 'None assigned'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Port</p>
            <p className="text-lg font-bold text-gray-900">
              {portName || 'None assigned'}
            </p>
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
      {zoneNames.size > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Assigned Zones
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            These are the zones your provider account is authorised to work in.
          </p>
          <div className="flex flex-wrap gap-2">
            {[...zoneNames].map((name) => (
              <span key={name} className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100">
                {name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Operating area hierarchy */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Supported Operating Areas
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Regions, cities, zones, and local delivery ports in the delivery
          network.
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
                        <span className="text-[10px] text-[#2563eb] font-medium">
                          zones
                        </span>
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
        A delivery port is a local station serving its zone. Your port and zone
        assignments are managed by Ariiti administrators \u2014 contact support to
        request a coverage change. All monetary values are in Ethiopian Birr
        (ETB).
      </div>
    </div>
  );
};

export default OperatingArea;
