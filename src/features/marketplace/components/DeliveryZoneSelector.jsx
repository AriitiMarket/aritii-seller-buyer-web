import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { locationService } from '@/services';

export function DeliveryZoneSelector({
  mode = 'any',
  initialValues = {},
  onSelect,
  label = 'Delivery Location',
  placeholder = 'Select location…',
  disabled = false,
}) {
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRegionId, setSelectedRegionId] = useState(initialValues.regionId || '');
  const [selectedCityId, setSelectedCityId] = useState(initialValues.cityId || '');
  const [selectedZoneId, setSelectedZoneId] = useState(initialValues.zoneId || '');
  const [selectedRegionName, setSelectedRegionName] = useState(initialValues.regionName || '');
  const [selectedCityName, setSelectedCityName] = useState(initialValues.cityName || '');
  const [selectedZoneName, setSelectedZoneName] = useState(initialValues.zoneName || '');
  const [cityLoading, setCityLoading] = useState(false);
  const [zoneLoading, setZoneLoading] = useState(false);

  useEffect(() => {
    setSelectedRegionId(initialValues.regionId || '');
    setSelectedCityId(initialValues.cityId || '');
    setSelectedZoneId(initialValues.zoneId || '');
    setSelectedRegionName(initialValues.regionName || '');
    setSelectedCityName(initialValues.cityName || '');
    setSelectedZoneName(initialValues.zoneName || '');
  }, [initialValues.regionId, initialValues.regionName, initialValues.cityId, initialValues.cityName, initialValues.zoneId, initialValues.zoneName]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    locationService
      .list({ type: 'region', status: 'active', limit: 200 })
      .then((data) => {
        if (isMounted) setRegions(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (isMounted) console.error('Failed to load regions:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (!selectedRegionId) {
      setCities([]); setSelectedCityId(''); setSelectedCityName('');
      setZones([]); setSelectedZoneId(''); setSelectedZoneName('');
      return;
    }
    let isMounted = true;
    setCityLoading(true);
    locationService
      .list({ type: 'city', parentId: selectedRegionId, status: 'active', limit: 200 })
      .then((data) => {
        if (isMounted) setCities(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (isMounted) console.error('Failed to load cities:', err);
      })
      .finally(() => { if (isMounted) setCityLoading(false); });
    return () => { isMounted = false; };
  }, [selectedRegionId, mode]);

  useEffect(() => {
    if (!selectedCityId) {
      setZones([]); setSelectedZoneId(''); setSelectedZoneName(''); return;
    }
    let isMounted = true;
    setZoneLoading(true);
    locationService
      .list({ type: 'zone', parentId: selectedCityId, status: 'active', limit: 200 })
      .then((data) => {
        if (isMounted) setZones(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (isMounted) console.error('Failed to load zones:', err);
      })
      .finally(() => { if (isMounted) setZoneLoading(false); });
    return () => { isMounted = false; };
  }, [selectedCityId, mode]);

  const handleRegionChange = useCallback(
    (e) => {
      const id = e.target.value;
      const region = regions.find((r) => String(r._id || r.id) === id);
      setSelectedRegionId(id);
      setSelectedRegionName(region ? region.name : '');
      setSelectedCityId(''); setSelectedCityName('');
      setSelectedZoneId(''); setSelectedZoneName('');
      onSelect && onSelect({
        regionId: id || undefined, cityId: undefined, zoneId: undefined,
        regionName: region ? region.name : '', cityName: '', zoneName: '',
      });
    },
    [regions, onSelect]
  );

  const handleCityChange = useCallback(
    (e) => {
      const id = e.target.value;
      const city = cities.find((c) => String(c._id || c.id) === id);
      setSelectedCityId(id); setSelectedCityName(city ? city.name : '');
      setSelectedZoneId(''); setSelectedZoneName('');
      onSelect && onSelect({
        regionId: selectedRegionId || undefined, cityId: id || undefined, zoneId: undefined,
        regionName: selectedRegionName, cityName: city ? city.name : '', zoneName: '',
      });
    },
    [cities, selectedRegionId, selectedRegionName, onSelect]
  );

  const handleZoneChange = useCallback(
    (e) => {
      const id = e.target.value;
      const zone = zones.find((z) => String(z._id || z.id) === id);
      setSelectedZoneId(id); setSelectedZoneName(zone ? zone.name : '');
      onSelect && onSelect({
        regionId: selectedRegionId || undefined, cityId: selectedCityId || undefined, zoneId: id || undefined,
        regionName: selectedRegionName, cityName: selectedCityName, zoneName: zone ? zone.name : '',
        portId: zone?.portId || undefined, portName: zone?.portName || '',
      });
    },
    [zones, selectedRegionId, selectedCityId, selectedRegionName, selectedCityName, onSelect]
  );

  const handleClear = useCallback(() => {
    setSelectedRegionId(''); setSelectedCityId(''); setSelectedZoneId('');
    setSelectedRegionName(''); setSelectedCityName(''); setSelectedZoneName('');
    setCities([]); setZones([]);
    onSelect && onSelect({
      regionId: undefined, cityId: undefined, zoneId: undefined,
      regionName: '', cityName: '', zoneName: '',
    });
  }, [onSelect]);

  const hasSelection = Boolean(selectedRegionId || selectedCityId || selectedZoneId);
  const showRegion = mode === 'region' || mode === 'zone' || mode === 'any';
  const showCity = mode === 'city' || mode === 'region' || mode === 'zone' || mode === 'any';
  const showZone = mode === 'zone' || mode === 'any';
  const cityDisabled = !selectedRegionId || disabled;
  const zoneDisabled = !selectedCityId || disabled;

  const regionOptions = useMemo(
    () => regions.map((r) => ({ value: r._id || r.id, label: r.name || r.localName || r.code })),
    [regions]
  );
  const cityOptions = useMemo(
    () => cities.map((c) => ({ value: c._id || c.id, label: c.name || c.localName || c.code })),
    [cities]
  );
  const zoneOptions = useMemo(
    () => zones.map((z) => ({ value: z._id || z.id, label: z.name || z.localName || z.code })),
    [zones]
  );

  const selectionText = useMemo(() => {
    const parts = [];
    if (selectedRegionName) parts.push(selectedRegionName);
    if (selectedCityName) parts.push(selectedCityName);
    if (selectedZoneName) parts.push(selectedZoneName);
    return parts.length ? parts.join(' › ') : placeholder;
  }, [selectedRegionName, selectedCityName, selectedZoneName, placeholder]);

  const selectClass = (
    "w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg " +
    "bg-white dark:bg-gray-800 text-gray-900 dark:text-white " +
    "focus:outline-none focus:ring-2 focus:ring-[#75d04b]/30 " +
    "disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
  );

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Header row: label + clear button */}
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <span className="text-xs font-bold text-[#131921] dark:text-white uppercase tracking-wider leading-tight">
          {label}
        </span>
        {hasSelection && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="flex-shrink-0 text-xs text-[#75d04b] hover:text-[#5ac12f] underline decoration-1 hover:decoration-[#5ac12f] underline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed py-1"
          >
            ✕ Clear
          </button>
        )}
      </div>

      {showRegion && (
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Region
          </label>
          <select
            value={selectedRegionId}
            onChange={handleRegionChange}
            disabled={loading || disabled}
            className={selectClass}
          >
            <option value="">All regions</option>
            {regionOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {loading && <span className="text-xs text-[#75d04b] font-medium">Loading regions…</span>}
        </div>
      )}

      {showCity && (
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            City
          </label>
          <select
            value={selectedCityId}
            onChange={handleCityChange}
            disabled={cityDisabled}
            className={selectClass}
          >
            <option value="">Select city</option>
            {cityOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {cityLoading && <span className="text-xs text-[#75d04b] font-medium">Loading cities…</span>}
        </div>
      )}

      {showZone && (
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Zone
          </label>
          <select
            value={selectedZoneId}
            onChange={handleZoneChange}
            disabled={zoneDisabled}
            className={selectClass}
          >
            <option value="">Select zone</option>
            {zoneOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {zoneLoading && <span className="text-xs text-[#75d04b] font-medium">Loading zones…</span>}
        </div>
      )}

      {hasSelection && (
        <div className="bg-[#FDF6EC] dark:bg-gray-900 border border-[#75d04b]/20 rounded-lg p-2.5 text-xs sm:text-sm">
          <span className="flex items-center gap-1.5">
            <span className="font-bold text-[#75d04b] dark:text-[#75d04b]">Selected:</span>
            <span className="text-gray-700 dark:text-gray-300 truncate">{selectionText}</span>
          </span>
        </div>
      )}
    </div>
  );
}

export default DeliveryZoneSelector;
