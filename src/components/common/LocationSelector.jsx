import { useState, useEffect, useCallback } from 'react';
import locationService from '@/services/location.service';

/**
 * LocationSelector
 * 
 * Reusable dependent dropdown for selecting from the platform's
 * geographic location hierarchy: Region → City → Area → Sector.
 * 
 * Props:
 *   onSelect(location)  — called with { regionId, regionName, cityId, cityName, areaId, areaName, sectorId, sectorName, zoneId }
 *   initialSelection    — pre-fill saved address values for edit mode
 *   className           — additional CSS classes
 *   required            — mark all fields as required (default: true)
 */
const LocationSelector = ({ onSelect, initialSelection = {}, className = '', required = true }) => {
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [zones, setZones] = useState([]);

  const [selectedRegion, setSelectedRegion] = useState(initialSelection.regionId || '');
  const [selectedCity, setSelectedCity] = useState(initialSelection.cityId || '');
  const [selectedArea, setSelectedArea] = useState(initialSelection.areaId || '');
  const [selectedSector, setSelectedSector] = useState(initialSelection.sectorId || '');

  const [loadingRegions, setLoadingRegions] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingSectors, setLoadingSectors] = useState(false);
  const [loadingZones, setLoadingZones] = useState(false);

  // Load regions on mount
  useEffect(() => {
    setLoadingRegions(true);
    locationService.list({ type: 'region' })
      .then(setRegions)
      .catch(console.error)
      .finally(() => setLoadingRegions(false));
  }, []);

  // Load cities when region changes
  useEffect(() => {
    if (!selectedRegion) {
      setCities([]);
      setSelectedCity('');
      return;
    }
    setLoadingCities(true);
    locationService.getChildren(selectedRegion)
      .then(setCities)
      .catch(console.error)
      .finally(() => {
        setLoadingCities(false);
      });
  }, [selectedRegion]);

  // Load areas when city changes
  useEffect(() => {
    if (!selectedCity) {
      setAreas([]);
      setSelectedArea('');
      return;
    }
    setLoadingAreas(true);
    locationService.getChildren(selectedCity)
      .then(setAreas)
      .catch(console.error)
      .finally(() => {
        setLoadingAreas(false);
      });
  }, [selectedCity]);

  // Load sectors when area changes (areas may not exist for all cities)
  useEffect(() => {
    if (!selectedArea) {
      setSectors([]);
      setSelectedSector('');
      return;
    }
    setLoadingSectors(true);
    locationService.getChildren(selectedArea)
      .then(setSectors)
      .catch(console.error)
      .finally(() => {
        setLoadingSectors(false);
      });
  }, [selectedArea]);

  // Find delivery zone when sector changes
  useEffect(() => {
    if (!selectedSector) {
      setZones([]);
      return;
    }
    setLoadingZones(true);
    locationService.findZone(selectedSector)
      .then(setZones)
      .catch(() => setZones([]))
      .finally(() => setLoadingZones(false));
  }, [selectedSector]);

  // Build and emit the selection whenever any dropdown changes
  const emitSelection = useCallback(() => {
    const regionObj = regions.find((r) => r._id === selectedRegion);
    const cityObj = cities.find((c) => c._id === selectedCity);
    const areaObj = areas.find((a) => a._id === selectedArea);
    const sectorObj = sectors.find((s) => s._id === selectedSector);

    onSelect({
      regionId: selectedRegion || null,
      regionName: regionObj?.name || null,
      cityId: selectedCity || null,
      cityName: cityObj?.name || null,
      areaId: selectedArea || null,
      areaName: areaObj?.name || null,
      sectorId: selectedSector || null,
      sectorName: sectorObj?.name || null,
      deliveryZoneId: zones.length > 0 ? zones[0]._id : null,
      deliveryZoneName: zones.length > 0 ? zones[0].name : null,
    });
  }, [selectedRegion, selectedCity, selectedArea, selectedSector, regions, cities, areas, sectors, zones, onSelect]);

  useEffect(() => {
    emitSelection();
  }, [emitSelection]);

  const selectClass =
    'w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#20305C] focus:ring-1 focus:ring-[#20305C] text-sm bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-[#20305C] transition-all duration-200';

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Region */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Region {required && <span className="text-red-500">*</span>}
        </label>
        <select
          className={selectClass}
          value={selectedRegion}
          onChange={(e) => {
            setSelectedRegion(e.target.value);
            setSelectedCity('');
            setSelectedArea('');
            setSelectedSector('');
          }}
          required={required}
          disabled={loadingRegions}
        >
          <option value="">
            {loadingRegions ? 'Loading regions...' : 'Select region'}
          </option>
          {regions.map((r) => (
            <option key={r._id} value={r._id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {/* City */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          City/Town {required && <span className="text-red-500">*</span>}
        </label>
        <select
          className={selectClass}
          value={selectedCity}
          onChange={(e) => {
            setSelectedCity(e.target.value);
            setSelectedArea('');
            setSelectedSector('');
          }}
          required={required}
          disabled={!selectedRegion || loadingCities}
        >
          <option value="">
            {loadingCities
              ? 'Loading cities...'
              : !selectedRegion
                ? 'Select a region first'
                : 'Select city'}
          </option>
          {cities.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Area — optional (some cities may not have areas) */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Area
        </label>
        <select
          className={selectClass}
          value={selectedArea}
          onChange={(e) => {
            setSelectedArea(e.target.value);
            setSelectedSector('');
          }}
          disabled={!selectedCity || loadingAreas || areas.length === 0}
        >
          <option value="">
            {loadingAreas
              ? 'Loading areas...'
              : areas.length === 0 && selectedCity
                ? 'No areas available — select sector below'
                : !selectedCity
                  ? 'Select a city first'
                  : 'Select area (optional)'}
          </option>
          {areas.map((a) => (
            <option key={a._id} value={a._id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sector */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Sector/Community {required && <span className="text-red-500">*</span>}
        </label>
        <select
          className={selectClass}
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
          required={required}
          disabled={
            (!selectedCity && !selectedArea) || loadingSectors
          }
        >
          <option value="">
            {loadingSectors
              ? 'Loading sectors...'
              : !selectedCity && !selectedArea
                ? 'Select city/area first'
                : 'Select sector'}
          </option>
          {(selectedArea ? sectors : []).map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Delivery zone indicator */}
      {selectedSector && (
        <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
          {loadingZones ? (
            'Checking delivery zone...'
          ) : zones.length > 0 ? (
            <span>
              Delivery zone: <strong>{zones[0].name}</strong>
            </span>
          ) : (
            <span className="text-amber-700">
              No delivery zone covers this area yet. Delivery may not be available.
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
