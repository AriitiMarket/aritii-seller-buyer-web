import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  MdLocationOn,
  MdLocalShipping,
  MdStore,
  MdMyLocation,
  MdCheckCircle,
  MdPhone,
  MdApartment,
  MdNearMe,
} from 'react-icons/md';
import { locationService } from '@/services/location.service';

export default function LocationInformationForm({ value = {}, onChange }) {
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [zones, setZones] = useState([]);
  const [ports, setPorts] = useState([]);
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingZones, setLoadingZones] = useState(false);
  const [detectingGps, setDetectingGps] = useState(false);
  const [gpsMessage, setGpsMessage] = useState('');

  const update = useCallback(
    (updates) => {
      onChange({ ...value, ...updates });
    },
    [value, onChange]
  );

  // Load Regions from hierarchy
  useEffect(() => {
    let active = true;
    setLoadingRegions(true);
    locationService
      .getHierarchy()
      .then((tree) => {
        if (!active) return;
        const country = Array.isArray(tree) && tree.length > 0 && tree[0].type === 'country' ? tree[0] : null;
        const topNodes = country?.children || (Array.isArray(tree) ? tree : []);
        if (topNodes && topNodes.length > 0) {
          setRegions(topNodes);
        } else {
          locationService.list({ status: 'active', limit: 200 }).then((data) => {
            if (active) setRegions(Array.isArray(data) ? data : []);
          });
        }
      })
      .catch(() => {
        locationService
          .list({ status: 'active', limit: 200 })
          .then((data) => {
            if (active) setRegions(Array.isArray(data) ? data : []);
          })
          .catch(() => {
            if (active) setRegions([]);
          });
      })
      .finally(() => {
        if (active) setLoadingRegions(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // Load Cities when Region changes
  useEffect(() => {
    const regionId = value.regionId;
    if (!regionId) {
      setCities([]);
      return;
    }

    const regionObj = regions.find((r) => String(r._id || r.id) === String(regionId));
    if (regionObj && regionObj.type === 'city') {
      setCities([regionObj]);
      return;
    }

    let active = true;
    setLoadingCities(true);
    locationService
      .getChildren(regionId)
      .then((data) => {
        if (!active) return;
        const list = Array.isArray(data) ? data : [];
        if (list.length > 0) {
          setCities(list);
        } else if (regionObj?.children && regionObj.children.length > 0) {
          setCities(regionObj.children);
        } else {
          setCities([{ _id: regionId, name: regionObj?.name || 'Central District', type: 'city' }]);
        }
      })
      .catch(() => {
        if (active) setCities([]);
      })
      .finally(() => {
        if (active) setLoadingCities(false);
      });

    return () => {
      active = false;
    };
  }, [value.regionId, regions]);

  // Load Delivery Zones when City changes
  useEffect(() => {
    const cityId = value.cityId;
    if (!cityId) {
      setZones([]);
      return;
    }

    let active = true;
    setLoadingZones(true);
    locationService
      .findZone(cityId)
      .then((data) => {
        if (!active) return;
        const list = Array.isArray(data) && data.length > 0 ? data : [];
        if (list.length > 0) {
          setZones(list);
        } else {
          locationService.listZones().then((all) => {
            if (active) setZones(Array.isArray(all) ? all : []);
          });
        }
      })
      .catch(() => {
        locationService.listZones().then((all) => {
          if (active) setZones(Array.isArray(all) ? all : []);
        });
      })
      .finally(() => {
        if (active) setLoadingZones(false);
      });

    return () => {
      active = false;
    };
  }, [value.cityId]);

  // Load Ports when delivery zone changes
  useEffect(() => {
    const zoneId = value.deliveryZoneId;
    if (!zoneId) {
      setPorts([]);
      return;
    }

    let active = true;
    locationService
      .getPortsByZone(zoneId)
      .then((data) => {
        if (active) setPorts(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (active) setPorts([]);
      });

    return () => {
      active = false;
    };
  }, [value.deliveryZoneId]);

  // Handlers for structured cascading picks
  const handleRegionChange = (e) => {
    const id = e.target.value;
    const regionObj = regions.find((r) => String(r._id || r.id) === id);
    const regionName = regionObj ? regionObj.name : '';
    update({
      regionId: id || '',
      regionName,
      region: regionName,
      cityId: '',
      cityName: '',
      city: '',
      deliveryZoneId: '',
      deliveryZoneName: '',
      portId: '',
      portName: '',
    });
  };

  const handleCityChange = (e) => {
    const id = e.target.value;
    const cityObj = cities.find((c) => String(c._id || c.id) === id);
    const cityName = cityObj ? cityObj.name : '';
    update({
      cityId: id || '',
      cityName,
      city: cityName,
      deliveryZoneId: '',
      deliveryZoneName: '',
      portId: '',
      portName: '',
    });
  };

  const handleZoneChange = (e) => {
    const id = e.target.value;
    const zoneObj = zones.find((z) => String(z._id || z.id) === id);
    const deliveryZoneName = zoneObj ? zoneObj.name : '';
    update({
      deliveryZoneId: id || '',
      deliveryZoneName,
      portId: zoneObj?.portId || '',
      portName: zoneObj?.portName || '',
    });
  };

  const handlePortChange = (e) => {
    const id = e.target.value;
    const portObj = ports.find((p) => String(p._id || p.id) === id);
    update({
      portId: id || '',
      portName: portObj ? portObj.name : '',
    });
  };

  // Browser GPS detection helper
  const handleDetectGps = () => {
    if (!navigator?.geolocation) {
      setGpsMessage('Geolocation is not supported by your browser.');
      return;
    }
    setDetectingGps(true);
    setGpsMessage('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDetectingGps(false);
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        update({
          latitude: lat,
          longitude: lng,
        });
        setGpsMessage(`Location detected: ${lat}, ${lng}`);
      },
      (err) => {
        setDetectingGps(false);
        setGpsMessage(`Unable to retrieve GPS: ${err.message}`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Resolved human-readable summary badge
  const locationSummary = useMemo(() => {
    const parts = [];
    if (value.regionName || value.region) parts.push(value.regionName || value.region);
    if (value.cityName || value.city) parts.push(value.cityName || value.city);
    if (value.deliveryZoneName) parts.push(value.deliveryZoneName);
    return parts.join(' › ');
  }, [value.regionName, value.region, value.cityName, value.city, value.deliveryZoneName]);

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="rounded-xl border border-[#75d04b]/30 bg-[#f3ffee] p-4 text-[#131921]">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-[#75d04b] p-2 text-white">
            <MdLocalShipping size={22} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">
              Delivery & Order Pickup Location
            </h3>
            <p className="mt-0.5 text-xs text-gray-600 leading-relaxed">
              Define where your store or warehouse is physically located and the delivery zone
              where orders will be dispatched. Delivery riders use this exact location to collect
              customer orders for prompt fulfillment.
            </p>
          </div>
        </div>
      </div>

      {/* Selected Location Pill */}
      {locationSummary && (
        <div className="flex items-center gap-2 rounded-lg border border-[#75d04b]/40 bg-white px-3 py-2 text-xs shadow-sm">
          <MdCheckCircle className="text-[#75d04b] flex-shrink-0" size={16} />
          <span className="font-semibold text-gray-500">Service Location:</span>
          <span className="font-bold text-gray-900 truncate">{locationSummary}</span>
        </div>
      )}

      {/* Section 1: Geographic Hierarchy & Delivery Service Area */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <MdLocationOn className="text-[#75d04b]" size={20} />
          <h4 className="text-sm font-bold text-gray-900">
            1. Operating Region & Delivery Zone
          </h4>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Region */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Region / State <span className="text-red-500">*</span>
            </label>
            <select
              value={value.regionId || ''}
              onChange={handleRegionChange}
              disabled={loadingRegions}
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm font-normal focus:border-[#75d04b] focus:ring-1 focus:ring-[#75d04b] bg-white disabled:bg-gray-100"
              required
            >
              <option value="">
                {loadingRegions ? 'Loading regions...' : 'Select region / state'}
              </option>
              {regions.map((r) => (
                <option key={r._id || r.id} value={r._id || r.id}>
                  {r.name || r.localName}
                </option>
              ))}
            </select>
          </div>

          {/* City / Subcity */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              City / Subcity <span className="text-red-500">*</span>
            </label>
            <select
              value={value.cityId || ''}
              onChange={handleCityChange}
              disabled={!value.regionId || loadingCities}
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm font-normal focus:border-[#75d04b] focus:ring-1 focus:ring-[#75d04b] bg-white disabled:bg-gray-100"
              required
            >
              <option value="">
                {!value.regionId
                  ? 'First choose a region'
                  : loadingCities
                  ? 'Loading cities...'
                  : 'Select city or subcity'}
              </option>
              {cities.map((c) => (
                <option key={c._id || c.id} value={c._id || c.id}>
                  {c.name || c.localName}
                </option>
              ))}
            </select>
            {/* Fallback text input if custom city is needed */}
            {!cities.length && value.regionId && !loadingCities && (
              <input
                type="text"
                placeholder="Enter city / town name"
                value={value.cityName || value.city || ''}
                onChange={(e) => update({ cityName: e.target.value, city: e.target.value })}
                className="mt-2 w-full rounded-lg border border-gray-300 p-2 text-xs"
              />
            )}
          </div>

          {/* Delivery Zone */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Operating Delivery Zone
            </label>
            <select
              value={value.deliveryZoneId || ''}
              onChange={handleZoneChange}
              disabled={!value.cityId || loadingZones}
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm font-normal focus:border-[#75d04b] focus:ring-1 focus:ring-[#75d04b] bg-white disabled:bg-gray-100"
            >
              <option value="">
                {!value.cityId
                  ? 'Select city to view zones'
                  : loadingZones
                  ? 'Loading delivery zones...'
                  : 'Select operating delivery zone'}
              </option>
              {zones.map((z) => (
                <option key={z._id || z.id} value={z._id || z.id}>
                  {z.name || z.zoneName}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-gray-400">
              Orders from customers in this zone are matched to this dispatch hub.
            </p>
          </div>

          {/* Logistics Port / Hub (if available) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Dispatch Port / Logistics Hub
            </label>
            <select
              value={value.portId || ''}
              onChange={handlePortChange}
              disabled={!ports.length}
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm font-normal focus:border-[#75d04b] focus:ring-1 focus:ring-[#75d04b] bg-white disabled:bg-gray-100"
            >
              <option value="">
                {ports.length ? 'Select delivery port (optional)' : 'No specific port required (standard dispatch)'}
              </option>
              {ports.map((p) => (
                <option key={p._id || p.id} value={p._id || p.id}>
                  {p.name} {p.code ? `(${p.code})` : ''}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-gray-400">
              Designated hub where package sorting & batching occurs.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Precise Store / Warehouse Pickup Address */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <MdStore className="text-[#75d04b]" size={20} />
          <h4 className="text-sm font-bold text-gray-900">
            2. Store & Order Pickup Address
          </h4>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Specific Physical Address */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Street Address / Shop & House Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={value.address || ''}
              onChange={(e) => update({ address: e.target.value })}
              placeholder="e.g., Bole Medhanialem, Street 14, Shop #G-12"
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm font-normal focus:border-[#75d04b] focus:ring-1 focus:ring-[#75d04b]"
            />
          </div>

          {/* Building / Mall / Commercial Center */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1 flex items-center gap-1">
              <MdApartment size={15} className="text-gray-400" />
              Building / Mall / Plaza
            </label>
            <input
              type="text"
              value={value.building || ''}
              onChange={(e) => update({ building: e.target.value })}
              placeholder="e.g., Edna Mall Building, 2nd Floor"
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm font-normal focus:border-[#75d04b] focus:ring-1 focus:ring-[#75d04b]"
            />
          </div>

          {/* Prominent Landmark */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1 flex items-center gap-1">
              <MdNearMe size={15} className="text-gray-400" />
              Prominent Landmark
            </label>
            <input
              type="text"
              value={value.landmark || ''}
              onChange={(e) => update({ landmark: e.target.value })}
              placeholder="e.g., Opposite Awash Bank, behind Total Station"
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm font-normal focus:border-[#75d04b] focus:ring-1 focus:ring-[#75d04b]"
            />
          </div>

          {/* Area / Sector / Woreda */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Area / Kebele / Woreda
            </label>
            <input
              type="text"
              value={value.areaName || value.sectorName || ''}
              onChange={(e) =>
                update({
                  areaName: e.target.value,
                  sectorName: e.target.value,
                })
              }
              placeholder="e.g., Woreda 03, Kebele 12"
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm font-normal focus:border-[#75d04b] focus:ring-1 focus:ring-[#75d04b]"
            />
          </div>

          {/* Dispatch / Pickup Phone */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1 flex items-center gap-1">
              <MdPhone size={15} className="text-gray-400" />
              Dispatch Manager Phone
            </label>
            <input
              type="tel"
              value={value.dispatchPhone || ''}
              onChange={(e) => update({ dispatchPhone: e.target.value })}
              placeholder="+251 911 000 000"
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm font-normal focus:border-[#75d04b] focus:ring-1 focus:ring-[#75d04b]"
            />
            <p className="mt-1 text-[11px] text-gray-400">
              Riders call this number upon arriving at your shop for order pickup.
            </p>
          </div>

          {/* Pickup Instructions */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Driver Pickup Instructions & Access Notes
            </label>
            <textarea
              rows={2}
              value={value.instructions || ''}
              onChange={(e) => update({ instructions: e.target.value })}
              placeholder="e.g., Enter through parking gate #2, packaging pickup counter is at shop rear."
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm font-normal focus:border-[#75d04b] focus:ring-1 focus:ring-[#75d04b]"
            />
          </div>
        </div>
      </div>

      {/* Section 3: GPS Coordinates & Pinpoint Location */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <MdMyLocation className="text-[#75d04b]" size={20} />
            <h4 className="text-sm font-bold text-gray-900">
              3. Map Coordinates (Optional for faster routing)
            </h4>
          </div>
          <button
            type="button"
            onClick={handleDetectGps}
            disabled={detectingGps}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#75d04b] bg-[#f3ffee] px-3 py-1.5 text-xs font-bold text-[#4ca72b] hover:bg-[#75d04b] hover:text-white transition disabled:opacity-50"
          >
            <MdMyLocation size={15} />
            <span>{detectingGps ? 'Detecting...' : 'Detect My Store GPS'}</span>
          </button>
        </div>

        {gpsMessage && (
          <p className="text-xs text-blue-600 bg-blue-50 border border-blue-200 p-2.5 rounded-lg">
            {gpsMessage}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Latitude
            </label>
            <input
              type="number"
              step="any"
              value={value.latitude || ''}
              onChange={(e) => update({ latitude: e.target.value ? Number(e.target.value) : '' })}
              placeholder="e.g., 9.012345"
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm font-normal focus:border-[#75d04b] focus:ring-1 focus:ring-[#75d04b]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Longitude
            </label>
            <input
              type="number"
              step="any"
              value={value.longitude || ''}
              onChange={(e) => update({ longitude: e.target.value ? Number(e.target.value) : '' })}
              placeholder="e.g., 38.765432"
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm font-normal focus:border-[#75d04b] focus:ring-1 focus:ring-[#75d04b]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
