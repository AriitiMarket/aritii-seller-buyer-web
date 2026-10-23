import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { AiOutlineCamera } from 'react-icons/ai';
import { Avatar } from '@/components/common/ImageWithFallback';
import { PlaceholderAvatar } from '@/assets';
import shopService from '@/services/shop.service';
import { useBusinessShops } from '@/business/hooks/useBusinessShops';
import SellerEmptyState from '@/business/components/SellerEmptyState';

const ShopSettings = () => {
  const { shops, activeShop, activeShopId, loading, error, refresh } = useBusinessShops();

  const [, setAvatar] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [zipCode, setZipcode] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!activeShop) return;
    setName(activeShop.name ?? '');
    setDescription(activeShop.description ?? '');
    setAddress(activeShop.address ?? '');
    setPhoneNumber(activeShop.phoneNumber ?? '');
    setZipcode(activeShop.zipCode ?? '');
  }, [activeShop]);

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
      toast.success('Avatar updated successfully');
      refresh();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to update avatar');
    }
  };

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
      toast.success('Shop info updated successfully');
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
  };

  if (loading && shops.length === 0) {
    return <p className="text-sm text-market-on-surface-variant">Loading your shops…</p>;
  }

  if (!activeShop) {
    return (
      <SellerEmptyState
        title="No shop to edit"
        description={error || "This account doesn't own a shop yet. Complete seller onboarding to create one."}
        action={{ to: '/seller-registration', label: 'Open a store' }}
        icon="🏪"
      />
    );
  }

  return (
    <form onSubmit={updateHandler} className="space-y-6">
      <div className="seller-form-section">
        <h2 className="seller-form-section-title">Shop Profile</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="seller-form-group">
            <label className="seller-form-label">Shop Logo</label>
            <div className="flex items-center gap-4">
              <Avatar
                data={activeShop}
                fallback={PlaceholderAvatar}
                alt={activeShop.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <label
                htmlFor="avatar"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-market-primary text-market-on-primary cursor-pointer hover:bg-market-primary-hover transition"
              >
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <AiOutlineCamera size={16} />
              </label>
            </div>
          </div>
          <div className="seller-form-group">
            <label className="seller-form-label">Shop Name</label>
            <input
              type="text"
              placeholder="Enter your shop name"
              value={name ?? ''}
              onChange={(e) => setName(e.target.value)}
              className="seller-form-input"
              required
            />
          </div>
          <div className="lg:col-span-2 seller-form-group">
            <label className="seller-form-label">Shop Description</label>
            <textarea
              placeholder="Enter your shop description"
              value={description ?? ''}
              onChange={(e) => setDescription(e.target.value)}
              className="seller-form-input"
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="seller-form-section">
        <h2 className="seller-form-section-title">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="seller-form-group">
            <label className="seller-form-label">Shop & Order Pickup Address</label>
            <input
              type="text"
              placeholder="e.g., Bole Medhanialem, Edna Mall 2nd Floor, Shop #204"
              value={address ?? ''}
              onChange={(e) => setAddress(e.target.value)}
              className="seller-form-input"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Delivery riders collect customer orders from this address.
            </p>
          </div>
          <div className="seller-form-group">
            <label className="seller-form-label">Phone Number</label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phoneNumber ?? ''}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="seller-form-input"
              required
            />
          </div>
          <div className="seller-form-group">
            <label className="seller-form-label">Zip Code</label>
            <input
              type="text"
              placeholder="Enter your zip code"
              value={zipCode ?? ''}
              onChange={(e) => setZipcode(e.target.value)}
              className="seller-form-input"
              required
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="seller-btn-primary"
        >
          {saving ? 'Updating…' : 'Update Shop'}
        </button>
      </div>
    </form>
  );
};

export default ShopSettings;
