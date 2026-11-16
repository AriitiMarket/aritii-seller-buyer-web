import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { useDeliveryLocation } from '@/shared/hooks/useDeliveryLocation';
import DeliveryZoneSelector from '@/features/marketplace/components/DeliveryZoneSelector';

export default function TopUtilityBar() {
  const [deliverToOpen, setDeliverToOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { regionId, regionName, zoneId: selectedZoneId, cityId: selectedCityId, zoneName, cityName, setLocation } = useDeliveryLocation();

  const getDeliveryLocation = () => {
    if (zoneName) return zoneName;
    if (cityName) return cityName;
    if (regionName) return regionName;
    return 'Select location';
  };

  const handleDeliverySelect = (selection) => {
    setLocation(selection);
    if (!['/products', '/shops'].includes(location.pathname)) return;
    const params = new URLSearchParams(location.search);
    for (const key of ['regionId', 'regionName', 'cityId', 'cityName', 'zoneId', 'zoneName']) {
      if (selection[key]) params.set(key, selection[key]); else params.delete(key);
    }
    navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDeliverToOpen(false);
      }
    };
    if (deliverToOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [deliverToOpen]);

  return (
    <nav
      className="h-10 bg-[#141414] border-b border-gray-800 text-gray-300 text-xs sm:text-sm flex items-center px-4 sm:px-6 lg:px-8 justify-between w-full relative z-[60]"
      role="navigation"
      aria-label="Top utility bar"
    >
      {/* Left: Delivery location trigger */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setDeliverToOpen((prev) => !prev)}
          className="flex items-center gap-1.5 py-1 px-2 rounded hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#75d04b]"
          aria-expanded={deliverToOpen}
          aria-haspopup="dialog"
          aria-label="Select delivery location"
        >
          <MdLocationOn size={16} className="text-[#75d04b] flex-shrink-0" />
          <span className="hidden xs:inline text-gray-400">Deliver to:</span>
          <span className="font-semibold text-white truncate max-w-[130px] sm:max-w-[200px]">
            {getDeliveryLocation()}
          </span>
        </button>

        {deliverToOpen && (
          <div
            className="absolute top-full left-0 mt-1 z-[80] w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-gray-800 bg-[#141414] text-white p-4 shadow-2xl animate-fade-in-up"
            role="dialog"
            aria-label="Delivery Location Selection"
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-800 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#75d04b]">
                Choose Location
              </span>
              <button
                type="button"
                onClick={() => setDeliverToOpen(false)}
                className="text-gray-400 hover:text-white text-xs p-1 rounded"
                aria-label="Close location selector"
              >
                ✕
              </button>
            </div>
            <DeliveryZoneSelector
              mode="zone"
              initialValues={{ regionId, regionName, cityId: selectedCityId, cityName, zoneId: selectedZoneId, zoneName }}
              onSelect={handleDeliverySelect}
              label="Select Delivery Zone"
              placeholder="All locations"
            />
            <div className="pt-3 mt-3 border-t border-gray-800 flex items-center justify-between text-xs">
              <Link
                to="/my-dashboard/addresses"
                onClick={() => setDeliverToOpen(false)}
                className="text-[#75d04b] hover:underline font-medium"
              >
                Manage addresses →
              </Link>
              <button
                type="button"
                onClick={() => setDeliverToOpen(false)}
                className="px-3 py-1 bg-[#75d04b] hover:brightness-95 text-white font-semibold rounded-full"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right: Portal switcher links */}
      <div className="flex items-center gap-2 sm:gap-4 text-xs font-medium">
        <Link
          to="/seller-center"
          className="py-1 px-2 rounded hover:text-amber-400 hover:bg-white/5 transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>Become a Seller</span>
        </Link>
        <span className="text-gray-700 select-none">|</span>
        <Link
          to="/delivery-center"
          className="py-1 px-2 rounded hover:text-sky-400 hover:bg-white/5 transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-400"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          <span>Become a Driver</span>
        </Link>
      </div>
    </nav>
  );
}
