import React from 'react';
import { MdStore, MdLocationOn, MdLocalShipping, MdBusiness } from 'react-icons/md';

const Row = ({ label, value }) => (
  <div>
    <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</dt>
    <dd className="mt-0.5 text-sm font-medium text-gray-900">{value || '—'}</dd>
  </div>
);

export default function SellerApplicationSummary({ application = {} }) {
  const business = application.businessInformation || {};
  const location = application.location || {};
  const shop = application.shopInformation || {};

  return (
    <div className="space-y-6">
      {/* 1. Business Info */}
      <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
          <MdBusiness className="text-[#75d04b]" size={18} />
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800">
            Business Profile
          </h4>
        </div>
        <dl className="grid gap-3 sm:grid-cols-2 text-sm">
          <Row label="Seller Type" value={application.sellerType} />
          <Row label="Business Name" value={business.businessName} />
          <Row label="Business Category" value={business.businessCategory} />
          <Row label="Business Phone" value={business.phone} />
          <Row label="Business Email" value={business.email} />
        </dl>
      </div>

      {/* 2. Delivery & Order Pickup Location */}
      <div className="rounded-xl border border-[#75d04b]/30 bg-[#f3ffee]/40 p-4">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#75d04b]/20">
          <MdLocalShipping className="text-[#75d04b]" size={18} />
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
            Delivery & Order Pickup Location
          </h4>
        </div>
        <dl className="grid gap-3 sm:grid-cols-2 text-sm">
          <Row label="Region / State" value={location.regionName || location.region} />
          <Row label="City / Subcity" value={location.cityName || location.city} />
          <Row label="Operating Delivery Zone" value={location.deliveryZoneName} />
          <Row label="Dispatch Port / Hub" value={location.portName} />
          <Row label="Store / Warehouse Pickup Address" value={location.address} />
          <Row label="Building / Floor / Plaza" value={location.building} />
          <Row label="Landmark" value={location.landmark} />
          <Row label="Area / Woreda" value={location.areaName || location.sectorName} />
          <Row label="Dispatch Contact Phone" value={location.dispatchPhone} />
          {location.latitude && location.longitude && (
            <Row label="GPS Coordinates" value={`${location.latitude}, ${location.longitude}`} />
          )}
          {location.instructions && (
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pickup Instructions for Couriers</dt>
              <dd className="mt-0.5 text-sm font-medium text-gray-900">{location.instructions}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* 3. Shop Details */}
      <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
          <MdStore className="text-[#75d04b]" size={18} />
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800">
            Storefront Details
          </h4>
        </div>
        <dl className="grid gap-3 sm:grid-cols-2 text-sm">
          <Row label="Shop Name" value={shop.shopName} />
          <Row label="Shop Category" value={shop.category} />
          <Row label="Public Phone" value={shop.publicPhone} />
          <Row label="Public Email" value={shop.publicEmail} />
        </dl>
      </div>
    </div>
  );
}
