import React from 'react'
import { toast } from 'react-toastify'
import { useState, useEffect } from 'react'
import { AiOutlineCamera } from 'react-icons/ai'
import { Avatar } from '@/components/common/ImageWithFallback'
import { PlaceholderAvatar } from '@/assets'
import shopService from '@/services/shop.service'
import { useBusinessShops } from '@/business/hooks/useBusinessShops'

/**
 * Business settings — edit ONE shop of the business.
 *
 * The form is bound to the ACTIVE SHOP (useBusinessShops), not to the identity
 * user: the fields used to come from `state.seller.seller` (a user record) and
 * were written back onto the shop, and the submit handler referenced an `api`
 * that was never imported, so saving threw before any request was made.
 */
const ShopSettings = () => {
  const { shops, activeShop, activeShopId, hasMultipleShops, selectShop, loading, error, refresh } = useBusinessShops();

  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [zipCode, setZipcode] = useState('');
  const [saving, setSaving] = useState(false);

  // Re-sync the form whenever the selected shop (re)loads so the settings page
  // always reflects the shop that is actually being edited.
  useEffect(() => {
    if (!activeShop) return;
    setName(activeShop.name ?? '');
    setDescription(activeShop.description ?? '');
    setAddress(activeShop.address ?? '');
    setPhoneNumber(activeShop.phoneNumber ?? '');
    setZipcode(activeShop.zipCode ?? '');
  }, [activeShop]);

  // Function to handle avatar change
  const handleAvatarChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!activeShopId) {
      toast.error('Select a shop first');
      return;
    }
    try {
      setAvatar(file);
      const formData = new FormData();
      formData.append('image', file);
      await shopService.updateShopAvatar(activeShopId, formData);
      toast.success('Avatar updated successfully!');
      refresh();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to update avatar');
    }
  }

  const updateHandler = async (e) => {
    e.preventDefault();
    if (!activeShopId) {
      toast.error('Select a shop first');
      return;
    }
    setSaving(true);
    try {
      await shopService.updateShopInfo(activeShopId, {
        name,
        description,
        address,
        phoneNumber,
        zipCode,
      });
      toast.success('Shop info updated successfully!');
      refresh();
    } catch (err) {
      const message = err?.response?.data?.errors?.[0]
        || err?.response?.data?.message
        || err?.message
        || 'Could not update the shop';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  if (loading && shops.length === 0) {
    return <p className="text-sm text-gray-500">Loading your shops…</p>;
  }

  if (!activeShop) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">No shop to edit</h2>
        <p className="text-sm text-gray-600">
          {error || 'This account does not own a shop yet. Complete seller onboarding to open one.'}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Which shop is being edited — a business can own several */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <label htmlFor="settings-shop" className="block text-sm font-medium text-gray-700 mb-2">
          Shop
        </label>
        {hasMultipleShops ? (
          <select
            id="settings-shop"
            value={activeShopId || ''}
            onChange={(event) => selectShop(event.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            {shops.map((shop) => (
              <option key={shop._id} value={shop._id}>
                {shop.name || 'Unnamed shop'} · {shop.status || 'PENDING_APPROVAL'}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-sm text-gray-700">
            {activeShop.name}{' '}
            <span className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
              {activeShop.status || 'PENDING_APPROVAL'}
            </span>
          </p>
        )}
        {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
      </div>

      {/* Shop Avatar Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Shop Avatar</h2>
        <div className="flex justify-center">
          <div className="relative">
            <Avatar
              data={activeShop}
              fallback={PlaceholderAvatar}
              className="w-[150px] h-[150px] rounded-full object-cover border-4 border-green-600"
              alt={activeShop.name || 'Shop'}
            />
            <div className="w-[40px] h-[40px] bg-green-600 rounded-full flex items-center justify-center cursor-pointer absolute bottom-0 right-0 text-white hover:bg-green-700 transition">
              <input
                type="file"
                className="hidden"
                id="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
              />
              <label htmlFor="avatar" className="cursor-pointer flex items-center justify-center w-full h-full">
                <AiOutlineCamera size={20} />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Information Form */}
      <form
        aria-required={true}
        onSubmit={updateHandler}
      >
        {/* Basic Information Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="space-y-4">
            {/* Shop Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shop Name</label>
              <input
                type="text"
                placeholder="Enter your shop name"
                value={name ?? ""}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                required
              />
            </div>

            {/* Shop Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shop Description</label>
              <input
                type="text"
                placeholder="Enter your shop description"
                value={description ?? ""}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Contact Information Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="space-y-4">
            {/* Shop Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shop Address</label>
              <input
                type="text"
                placeholder="Enter your shop address"
                value={address ?? ""}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shop Phone Number</label>
              <input
                type="number"
                placeholder="Enter your phone number"
                value={phoneNumber ?? ""}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                required
              />
            </div>

            {/* Zip Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shop Zip Code</label>
              <input
                type="number"
                placeholder="Enter your zip code"
                value={zipCode ?? ""}
                onChange={(e) => setZipcode(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-green-600 text-white px-8 py-2 rounded-lg hover:bg-green-700 font-semibold transition disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Update Shop'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ShopSettings