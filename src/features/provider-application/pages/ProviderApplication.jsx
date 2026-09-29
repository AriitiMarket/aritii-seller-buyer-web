import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { providerApplicationApi } from '@/features/provider-application/services/providerApplicationApi';

/**
 * ProviderApplication - form for users to apply to become delivery providers.
 *
 * The form maps 1:1 onto the Delivery Service contract
 * (POST /provider-application). The field names here are UI names; `buildPayload`
 * is the single place that translates them, so the form and the API can each use
 * their natural vocabulary.
 */
const ProviderApplication = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    providerType: 'individual_rider',
    vehicleType: '',
    vehicleModel: '',
    vehiclePlate: '',
    hasInsurance: false,
    idDocument: null,
    availability: '',
    experience: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  /**
   * UI field names -> API contract.
   *
   * The ID document is sent as a filename reference only: the platform has no
   * public multipart upload endpoint for this flow yet, so the reviewer sees
   * which document the applicant attached and can request the file directly.
   */
  const buildPayload = () => ({
    name: formData.fullName.trim(),
    email: formData.email.trim(),
    phone: formData.phone.trim(),
    providerType: formData.providerType,
    vehicleType: formData.vehicleType,
    plateNumber: formData.vehiclePlate.trim(),
    metadata: {
      availability: formData.availability.trim(),
      experience: formData.experience.trim(),
      vehicleModel: formData.vehicleModel.trim(),
      hasInsurance: formData.hasInsurance,
      idDocumentName: formData.idDocument?.name || '',
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await providerApplicationApi.submit(buildPayload());
      toast.success('Application submitted successfully!');
      navigate('/provider-application/status');
    } catch (error) {
      // Surface the backend's own message (e.g. "You are already a registered
      // delivery provider") instead of a generic failure.
      const message = error?.response?.data?.message
        || 'Failed to submit application. Please try again.';
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Provider Application</h1>
          <p className="text-gray-600">Complete the form below to apply as a delivery provider.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          {/* Personal Information */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#75d04b] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#75d04b] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#75d04b] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Provider Type */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Provider Type</h2>
            <div>
              <label htmlFor="providerType" className="block text-sm font-medium text-gray-700 mb-1">
                What kind of provider are you? *
              </label>
              <select
                id="providerType"
                name="providerType"
                value={formData.providerType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#75d04b] focus:border-transparent"
              >
                <option value="individual_rider">Individual rider</option>
                <option value="delivery_business">Delivery business</option>
                <option value="logistics_partner">Logistics partner</option>
              </select>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Type *
                </label>
                <select
                  id="vehicleType"
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#75d04b] focus:border-transparent"
                >
                  <option value="">Select vehicle type</option>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="car">Car</option>
                  <option value="bicycle">Bicycle</option>
                  <option value="van">Van</option>
                  <option value="truck">Truck</option>
                </select>
              </div>

              <div>
                <label htmlFor="vehicleModel" className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Model *
                </label>
                <input
                  type="text"
                  id="vehicleModel"
                  name="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Toyota Corolla 2018"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#75d04b] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="vehiclePlate" className="block text-sm font-medium text-gray-700 mb-1">
                  License Plate Number *
                </label>
                <input
                  type="text"
                  id="vehiclePlate"
                  name="vehiclePlate"
                  value={formData.vehiclePlate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#75d04b] focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hasInsurance"
                  name="hasInsurance"
                  checked={formData.hasInsurance}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#75d04b] border-gray-300 rounded focus:ring-[#75d04b]"
                />
                <label htmlFor="hasInsurance" className="text-sm text-gray-700">
                  I have valid vehicle insurance
                </label>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Availability</h2>
            <div>
              <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
                When are you available to work? *
              </label>
              <textarea
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                required
                rows={3}
                placeholder="e.g., Weekdays 9am-5pm, Weekends flexible"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#75d04b] focus:border-transparent"
              />
            </div>
          </div>

          {/* Experience */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Experience</h2>
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                Previous delivery experience (optional)
              </label>
              <textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                rows={3}
                placeholder="Describe any previous delivery experience"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#75d04b] focus:border-transparent"
              />
            </div>
          </div>

          {/* ID Document */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Identification</h2>
            <div>
              <label htmlFor="idDocument" className="block text-sm font-medium text-gray-700 mb-1">
                Upload ID Document *
              </label>
              <input
                type="file"
                id="idDocument"
                name="idDocument"
                onChange={handleChange}
                accept="image/*,.pdf"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#75d04b] focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Accepted formats: JPG, PNG, PDF (Max 5MB)</p>
            </div>
          </div>

          {/* Submit */}
          {errorMessage && (
            <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-[#75d04b] text-white font-semibold rounded-lg hover:bg-[#5ac12f] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProviderApplication;
