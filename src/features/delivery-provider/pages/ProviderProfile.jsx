import React, { useState } from 'react';
import { MdPerson, MdStore, MdPhone, MdLocationOn, MdWifi, MdEdit } from 'react-icons/md';
import { useProvider } from '../hooks/useProvider';
import { providerDeliveryApi } from '../services/providerDeliveryApi';
import { toast } from 'react-toastify';

/**
 * ProviderProfile - shows provider profile and settings.
 * Displays provider information and allows editing of supported fields.
 */
const ProviderProfile = () => {
  const { isProvider, provider } = useProvider();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: provider?.name || '',
    phone: provider?.phone || '',
    vehicleType: provider?.vehicleType || '',
    vehicleModel: provider?.vehicleModel || '',
    serviceArea: provider?.serviceArea || '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await providerDeliveryApi.updateProviderProfile(formData);
      if (response.success) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!isProvider) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">Manage your provider profile and settings.</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <p className="text-amber-800">
            <strong>Provider Access Required:</strong> You don't have provider access. Please contact support if you believe this is an error.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">Manage your provider profile and settings.</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#75d04b] text-white font-semibold rounded-lg hover:bg-[#5ac12f] transition"
          >
            <MdEdit size={18} />
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Provider Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Provider Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#75d04b] focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{provider?.name || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#75d04b] focus:border-transparent"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <MdPhone className="text-gray-400" size={16} />
                  <p className="text-gray-900">{provider?.phone || 'Not set'}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Provider ID</label>
              <p className="text-sm font-mono text-gray-500">{provider?.providerId || provider?.id || 'Not assigned'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
              {isEditing ? (
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#75d04b] focus:border-transparent"
                >
                  <option value="">Select vehicle type</option>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="car">Car</option>
                  <option value="bicycle">Bicycle</option>
                </select>
              ) : (
                <div className="flex items-center gap-2">
                  <MdStore className="text-gray-400" size={16} />
                  <p className="text-gray-900">{provider?.vehicleType || 'Not set'}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Model</label>
              {isEditing ? (
                <input
                  type="text"
                  name="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={handleChange}
                  placeholder="e.g., Toyota Corolla 2018"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#75d04b] focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{provider?.vehicleModel || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
              <p className="text-gray-900">{provider?.vehiclePlate || 'Not set'}</p>
            </div>
          </div>
        </div>

        {/* Service Area */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Area</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Area</label>
              {isEditing ? (
                <input
                  type="text"
                  name="serviceArea"
                  value={formData.serviceArea}
                  onChange={handleChange}
                  placeholder="e.g., Addis Ababa, Bole"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#75d04b] focus:border-transparent"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <MdLocationOn className="text-gray-400" size={16} />
                  <p className="text-gray-900">{provider?.serviceArea || 'Not set'}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability Status</label>
              <div className="flex items-center gap-2">
                <MdWifi className="text-green-600" size={16} />
                <span className="text-gray-900">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900 mb-1">Managed by Ariiti</p>
              <p className="text-xs text-gray-500">
                Account status, approval, and verification are managed by Ariiti administrators. Contact support for changes.
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-900 mb-1">Editable by Provider</p>
              <p className="text-xs text-green-700">
                Name, phone, vehicle information, and service area can be updated by you.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Actions */}
      {isEditing && (
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-6 py-3 bg-[#75d04b] text-white font-semibold rounded-lg hover:bg-[#5ac12f] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setFormData({
                name: provider?.name || '',
                phone: provider?.phone || '',
                vehicleType: provider?.vehicleType || '',
                vehicleModel: provider?.vehicleModel || '',
                serviceArea: provider?.serviceArea || '',
              });
            }}
            disabled={saving}
            className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default ProviderProfile;
