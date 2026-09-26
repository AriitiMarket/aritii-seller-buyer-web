import React from 'react';
import { Link } from 'react-router-dom';
import { useBusinessShops } from '@/business/hooks/useBusinessShops';

const ShopSwitcher = () => {
  const { shops, activeShopId, loading, error, selectShop } = useBusinessShops();

  if (loading || shops.length === 0) return null;

  return (
    <div className="border-b border-gray-200 p-3">
      <label htmlFor="business-shop" className="mb-1 block text-xs font-semibold text-gray-500">
        Active shop
      </label>
      <select
        id="business-shop"
        value={activeShopId || ''}
        onChange={(event) => selectShop(event.target.value)}
        className="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-sm"
        aria-invalid={Boolean(error)}
      >
        {shops.map((shop) => (
          <option key={shop._id} value={shop._id}>
            {shop.name || 'Unnamed shop'}
          </option>
        ))}
      </select>
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
      {shops.length === 1 && (
        <p className="mt-1 text-xs text-gray-500">Only one shop · <Link to="/business/shops" className="text-[#75d04b] hover:underline">Manage shops</Link></p>
      )}
    </div>
  );
};

export default ShopSwitcher;
