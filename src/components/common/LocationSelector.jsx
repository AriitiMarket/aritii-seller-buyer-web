import { useState, useEffect, useCallback, useRef } from 'react';
import locationService from '@/services/location.service';

/**
 * LocationSelector
 * 
 * Dependent dropdowns for platform geographic hierarchy and delivery logistics:
 *   Region / Federal City → City / Town → Sector / Community → Delivery Zone → Port / Hub
 * 
 * Props:
 *   onSelect(location)  — called with { regionId, regionName, cityId, cityName, areaId, areaName, sectorId, sectorName, deliveryZoneId, deliveryZoneName, portId, portName }
 *   initialSelection    — pre-fill saved address values for edit mode
 *   className           — additional CSS classes
 *   required            — mark required fields (default: true)
 */
const LocationSelector = ({ onSelect, initialSelection = {}, className = '', required = true }) => {
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [zones, setZones] = useState([]);
  const [ports, setPorts] = useState([]);

  const [selectedRegion, setSelectedRegion] = useState(initialSelection.regionId || '');
  const [selectedCity, setSelectedCity] = useState(initialSelection.cityId || '');
  const [selectedArea, setSelectedArea] = useState(initialSelection.areaId || '');
  const [selectedSector, setSelectedSector] = useState(initialSelection.sectorId || '');
  const [selectedZone, setSelectedZone] = useState(initialSelection.deliveryZoneId || '');
  const [selectedPort, setSelectedPort] = useState(initialSelection.portId || '');

  const [loadingRegions, setLoadingRegions] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingSectors, setLoadingSectors] = useState(false);
  const [loadingZones, setLoadingZones] = useState(false);
  const [loadingPorts, setLoadingPorts] = useState(false);

  // 1. Load regions & chartered cities on mount via hierarchy
  useEffect(() => {
    let isMounted = true;
    setLoadingRegions(true);

    locationService.getHierarchy()
      .then((tree) => {
        if (!isMounted) return;
        const country = Array.isArray(tree) && tree.length > 0 && tree[0].type === 'country' ? tree[0] : null;
        const topNodes = country?.children || (Array.isArray(tree) ? tree : []);

        if (topNodes && topNodes.length > 0) {
          const list = topNodes.map((n) => ({
            _id: n._id,
            name: n.name,
            code: n.code,
            type: n.type,
            children: n.children || [],
          }));
          setRegions(list);

          // Pre-select region if initialSelection matches or if there's an existing region
          if (initialSelection.regionId) {
            setSelectedRegion(initialSelection.regionId);
          } else if (initialSelection.cityId) {
            const parent = list.find((r) =>
              r._id === initialSelection.cityId ||
              (r.children && r.children.some((c) => c._id === initialSelection.cityId))
            );
            if (parent) setSelectedRegion(parent._id);
          }
        } else {
          locationService.list({ status: 'active', limit: 200 })
            .then((flat) => {
              if (isMounted) setRegions(Array.isArray(flat) ? flat : []);
            })
            .catch(() => {});
        }
      })
      .catch((err) => {
        console.error('Failed to load location hierarchy:', err);
        locationService.list({ status: 'active', limit: 200 })
          .then((flat) => {
            if (isMounted) setRegions(Array.isArray(flat) ? flat : []);
          })
          .catch(console.error);
      })
      .finally(() => {
        if (isMounted) setLoadingRegions(false);
      });

    return () => { isMounted = false; };
  }, []);

  // 2. Load cities when region changes
  useEffect(() => {
    if (!selectedRegion) {
      setCities([]);
      setSelectedCity('');
      return;
    }

    const regionObj = regions.find((r) => r._id === selectedRegion);

    // If top node is already a city (e.g. Addis Ababa)
    if (regionObj && regionObj.type === 'city') {
      const selfCity = [{ _id: regionObj._id, name: regionObj.name, type: 'city' }];
      setCities(selfCity);
      setSelectedCity(regionObj._id);
      return;
    }

    let isMounted = true;
    setLoadingCities(true);

    locationService.getChildren(selectedRegion)
      .then((children) => {
        if (!isMounted) return;
        const childList = Array.isArray(children) ? children : [];
        if (childList.length > 0) {
          setCities(childList);
          setSelectedCity((curr) => {
            if (curr && childList.some((c) => c._id === curr)) return curr;
            if (initialSelection.cityId && childList.some((c) => c._id === initialSelection.cityId)) {
              return initialSelection.cityId;
            }
            return childList.length === 1 ? childList[0]._id : '';
          });
        } else if (regionObj?.children && regionObj.children.length > 0) {
          setCities(regionObj.children);
          setSelectedCity((curr) => {
            if (curr && regionObj.children.some((c) => c._id === curr)) return curr;
            if (initialSelection.cityId && regionObj.children.some((c) => c._id === initialSelection.cityId)) {
              return initialSelection.cityId;
            }
            return regionObj.children.length === 1 ? regionObj.children[0]._id : '';
          });
        } else {
          // Region is itself the city
          const self = [{ _id: selectedRegion, name: regionObj?.name || 'City', type: 'city' }];
          setCities(self);
          setSelectedCity(selectedRegion);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        if (regionObj?.children && regionObj.children.length > 0) {
          setCities(regionObj.children);
          setSelectedCity(regionObj.children[0]._id);
        }
      })
      .finally(() => {
        if (isMounted) setLoadingCities(false);
      });

    return () => { isMounted = false; };
  }, [selectedRegion, regions, initialSelection.cityId]);

  // 3. Load areas, sectors, and delivery zones when city changes
  useEffect(() => {
    if (!selectedCity) {
      setAreas([]);
      setSelectedArea('');
      setSectors([]);
      setSelectedSector('');
      setZones([]);
      return;
    }

    const cityObj = cities.find((c) => c._id === selectedCity);
    const cityName = cityObj?.name || '';

    let isMounted = true;
    setLoadingAreas(true);
    setLoadingSectors(true);
    setLoadingZones(true);

    Promise.all([
      locationService.getChildren(selectedCity).catch(() => []),
      locationService.listSectors(cityName).catch(() => []),
      locationService.findZone(selectedCity).catch(() => []),
    ])
      .then(([children, backendSectors, directZones]) => {
        if (!isMounted) return;

        const childList = Array.isArray(children) ? children : [];
        const areaList = childList.filter((c) => c.type === 'area');
        const locationSectors = childList.filter((c) => c.type !== 'area');
        setAreas(areaList);

        // Merge sectors from commerce /sector (e.g. Harar Sector 1, 2, 3, 4)
        const combined = [...locationSectors];
        for (const bs of (backendSectors || [])) {
          if (!combined.some((s) => s._id === bs._id || s.name === bs.name)) {
            combined.push({
              _id: bs._id,
              name: bs.name,
              deliveryFee: bs.deliveryFee,
              estimatedDeliveryTime: bs.estimatedDeliveryTime,
            });
          }
        }

        setSectors(combined);

        // Pre-select sector if matches initial selection or only 1 option
        setSelectedSector((curr) => {
          if (curr && combined.some((s) => s._id === curr)) return curr;
          if (initialSelection.sectorId && combined.some((s) => s._id === initialSelection.sectorId)) {
            return initialSelection.sectorId;
          }
          return combined.length === 1 ? combined[0]._id : '';
        });

        // Set zones
        const zoneList = Array.isArray(directZones) && directZones.length > 0 ? directZones : [];
        if (zoneList.length > 0) {
          setZones(zoneList);
        } else {
          locationService.listZones()
            .then((all) => {
              if (isMounted) setZones(Array.isArray(all) ? all : []);
            })
            .catch(() => {
              if (isMounted) setZones([]);
            });
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoadingAreas(false);
          setLoadingSectors(false);
          setLoadingZones(false);
        }
      });

    return () => { isMounted = false; };
  }, [selectedCity, cities, initialSelection.sectorId]);

  // 4. Refine delivery zone when a specific sector is selected
  useEffect(() => {
    if (!selectedSector) return;
    let isMounted = true;
    locationService.findZone(selectedSector)
      .then((refinedZones) => {
        if (isMounted && refinedZones && refinedZones.length > 0) {
          setZones(refinedZones);
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, [selectedSector]);

  // 5. Automatically select zone when zones change
  useEffect(() => {
    if (!zones || zones.length === 0) {
      setSelectedZone('');
      return;
    }
    setSelectedZone((current) => {
      if (current && zones.some((z) => z._id === current)) return current;
      if (initialSelection.deliveryZoneId && zones.some((z) => z._id === initialSelection.deliveryZoneId)) {
        return initialSelection.deliveryZoneId;
      }
      return zones[0]._id;
    });
  }, [zones, initialSelection.deliveryZoneId]);

  // 6. Fetch ports whenever selectedZone changes
  useEffect(() => {
    if (!selectedZone) {
      setPorts([]);
      setSelectedPort('');
      return;
    }
    let isMounted = true;
    setLoadingPorts(true);

    locationService.getPortsByZone(selectedZone)
      .then((data) => {
        if (!isMounted) return;
        const list = Array.isArray(data) ? data : [];
        if (list.length === 0) {
          locationService.listPorts({ zoneId: selectedZone })
            .then((fallback) => {
              if (!isMounted) return;
              const portList = Array.isArray(fallback) ? fallback : [];
              setPorts(portList);
              setSelectedPort((curr) => {
                if (curr && portList.some((p) => p._id === curr)) return curr;
                if (initialSelection.portId && portList.some((p) => p._id === initialSelection.portId)) {
                  return initialSelection.portId;
                }
                return portList.length > 0 ? portList[0]._id : '';
              });
            })
            .catch(() => {
              if (isMounted) setPorts([]);
            });
          return;
        }

        setPorts(list);
        setSelectedPort((current) => {
          if (current && list.some((p) => p._id === current)) return current;
          if (initialSelection.portId && list.some((p) => p._id === initialSelection.portId)) {
            return initialSelection.portId;
          }
          const activeZoneObj = zones.find((z) => z._id === selectedZone);
          if (activeZoneObj?.portId && list.some((p) => p._id === String(activeZoneObj.portId))) {
            return String(activeZoneObj.portId);
          }
          return list.length > 0 ? list[0]._id : '';
        });
      })
      .catch(() => {
        if (isMounted) setPorts([]);
      })
      .finally(() => {
        if (isMounted) setLoadingPorts(false);
      });

    return () => { isMounted = false; };
  }, [selectedZone, zones, initialSelection.portId]);

  // 7. Emit selection to parent whenever any field changes
  const emitSelection = useCallback(() => {
    const regionObj = regions.find((r) => r._id === selectedRegion);
    const cityObj = cities.find((c) => c._id === selectedCity);
    const areaObj = areas.find((a) => a._id === selectedArea);
    const sectorObj = sectors.find((s) => s._id === selectedSector);
    const zoneObj = zones.find((z) => z._id === selectedZone) || (zones.length > 0 ? zones[0] : null);
    const portObj = ports.find((p) => p._id === selectedPort) || (ports.length > 0 ? ports[0] : null);

    const hasSubLocations = areas.length > 0 || sectors.length > 0;
    const effectiveSectorId = selectedSector || (!hasSubLocations && selectedCity ? selectedCity : null);
    const effectiveSectorName = sectorObj?.name || (!hasSubLocations && cityObj?.name ? cityObj?.name : null);

    onSelect({
      regionId: selectedRegion || null,
      regionName: regionObj?.name || null,
      cityId: selectedCity || null,
      cityName: cityObj?.name || null,
      areaId: selectedArea || null,
      areaName: areaObj?.name || null,
      sectorId: effectiveSectorId,
      sectorName: effectiveSectorName,
      deliveryZoneId: zoneObj?._id || selectedZone || null,
      deliveryZoneName: zoneObj?.name || null,
      portId: portObj?._id || selectedPort || (zoneObj?.portId ? String(zoneObj.portId) : null),
      portName: portObj?.name || zoneObj?.portName || null,
    });
  }, [
    selectedRegion, selectedCity, selectedArea, selectedSector, selectedZone, selectedPort,
    regions, cities, areas, sectors, zones, ports, onSelect
  ]);

  useEffect(() => {
    emitSelection();
  }, [emitSelection]);

  const selectClass =
    'w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#20305C] focus:ring-1 focus:ring-[#20305C] text-sm bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-[#20305C] transition-all duration-200';

  const hasSubLocations = areas.length > 0 || sectors.length > 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Region / Administrative Region */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Region / Chartered City {required && <span className="text-red-500">*</span>}
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
              {r.name} {r.code ? `(${r.code})` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* City / Town */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          City / Town {required && <span className="text-red-500">*</span>}
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
              {c.name} {c.code ? `(${c.code})` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Area — optional sub-division if present */}
      {areas.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Area / Sub-city (Optional)
          </label>
          <select
            className={selectClass}
            value={selectedArea}
            onChange={(e) => {
              setSelectedArea(e.target.value);
              setSelectedSector('');
            }}
            disabled={!selectedCity || loadingAreas}
          >
            <option value="">Select area</option>
            {areas.map((a) => (
              <option key={a._id} value={a._id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Sector / Community */}
      {sectors.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Sector / Delivery District {required && <span className="text-red-500">*</span>}
          </label>
          <select
            className={selectClass}
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            required={required}
            disabled={loadingSectors}
          >
            <option value="">Select sector</option>
            {sectors.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} {s.deliveryFee ? `(Fee: ${s.deliveryFee} ETB)` : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* When no sub-sectors exist for the city */}
      {selectedCity && !hasSubLocations && !loadingAreas && !loadingSectors && (
        <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 p-2.5 text-xs text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
          <span>✓</span>
          <span>City-wide direct delivery (no sub-sector required)</span>
        </div>
      )}

      {/* Delivery Zone Selection */}
      {selectedCity && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Delivery Zone {required && <span className="text-red-500">*</span>}
          </label>
          {loadingZones ? (
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-3 text-sm text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Checking available delivery zones...
            </div>
          ) : zones.length > 1 ? (
            <select
              className={selectClass}
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              required={required}
            >
              <option value="">Select delivery zone</option>
              {zones.map((z) => (
                <option key={z._id} value={z._id}>
                  {z.name} {z.code ? `(${z.code})` : ''}
                </option>
              ))}
            </select>
          ) : zones.length === 1 ? (
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-3 text-sm text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center justify-between">
              <span>
                Delivery zone: <strong>{zones[0].name}</strong> {zones[0].code ? `(${zones[0].code})` : ''}
              </span>
              <span className="text-xs bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded font-medium">
                Active Zone
              </span>
            </div>
          ) : (
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 p-3 text-sm text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              No active delivery zone covers this location yet. Standard dispatch will be used.
            </div>
          )}
        </div>
      )}

      {/* Delivery Port Selection */}
      {selectedZone && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Delivery Port / Pickup Hub {required && <span className="text-red-500">*</span>}
          </label>
          {loadingPorts ? (
            <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950/30 p-3 text-sm text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Loading ports for selected zone...
            </div>
          ) : ports.length > 1 ? (
            <select
              className={selectClass}
              value={selectedPort}
              onChange={(e) => setSelectedPort(e.target.value)}
              required={required}
            >
              <option value="">Select delivery port / hub</option>
              {ports.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} {p.description ? `— ${p.description}` : ''}
                </option>
              ))}
            </select>
          ) : ports.length === 1 ? (
            <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950/30 p-3 text-sm text-indigo-800 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
              <span>
                Fulfillment Port: <strong>{ports[0].name}</strong>
              </span>
              <span className="text-xs bg-indigo-200 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100 px-2 py-0.5 rounded font-medium">
                Local Hub
              </span>
            </div>
          ) : (
            <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3 text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
              {zones.find((z) => z._id === selectedZone)?.portName ? (
                <span>
                  Port: <strong>{zones.find((z) => z._id === selectedZone)?.portName}</strong>
                </span>
              ) : (
                <span>Standard local dispatch (default zone port)</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
