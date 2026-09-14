import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Country, State } from 'country-state-city'
import { toast } from 'react-toastify'
import { updatUserAddress, deleteUserAddress } from '../../../store/redux/actions/user'
import { addressService } from '../../../services'
import { MdLocationOn, MdAdd, MdDelete, MdEdit } from 'react-icons/md'
import { RxCross1 } from 'react-icons/rx'

// Buyer Account: Addresses - Modern card-based address management
const CustomerAddressesPage = () => {
  const { user, updateUserAddressLoading, deleteUserAddressLoading, addressError } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)

  // Load addresses on mount
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        setLoading(true)
        const allAddresses = await addressService.getAll()
        setAddresses(allAddresses)
      } catch (error) {
        console.error('Failed to load addresses:', error)
        toast.error('Failed to load addresses')
      } finally {
        setLoading(false)
      }
    }

    loadAddresses()
  }, [])

  // Sync addresses from Redux when they change
  useEffect(() => {
    if (user?.addresses) {
      setAddresses(user.addresses)
    }
  }, [user?.addresses])

  // Handle error messages
  useEffect(() => {
    if (addressError) {
      toast.error(addressError)
    }
  }, [addressError])

  return (
    <div className="w-full bg-gray-50 min-h-screen py-6 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Address Book</h1>
            <p className="text-sm text-gray-600 mt-1">Manage your delivery addresses</p>
          </div>
          <button
            onClick={() => {
              setEditingId(null)
              setOpen(true)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={updateUserAddressLoading || deleteUserAddressLoading}
          >
            <MdAdd className="text-lg" />
            Add Address
          </button>
        </div>

        {/* Address Modal */}
        {open && (
          <AddressModal
            open={open}
            setOpen={setOpen}
            dispatch={dispatch}
            editingId={editingId}
            editingAddress={editingId ? addresses.find(a => a._id === editingId) : null}
            isLoading={updateUserAddressLoading}
          />
        )}

        {/* Addresses Grid */}
        {loading ? (
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-300 border-t-teal-600 rounded-full"></div>
            <p className="text-gray-600 text-lg font-medium mt-4">Loading addresses...</p>
          </div>
        ) : addresses && addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <AddressCard
                key={address._id}
                address={address}
                dispatch={dispatch}
                onEdit={() => {
                  setEditingId(address._id)
                  setOpen(true)
                }}
                isDeleting={deleteUserAddressLoading}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 text-center">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdLocationOn className="text-4xl text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg font-medium mb-2">No addresses yet</p>
            <p className="text-gray-500 text-sm mb-6">Add a delivery address to get started</p>
            <button
              onClick={() => {
                setEditingId(null)
                setOpen(true)
              }}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition inline-block"
              disabled={updateUserAddressLoading}
            >
              Add Your First Address
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const AddressCard = ({ address, dispatch, onEdit, isDeleting }) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        dispatch(deleteUserAddress(address._id))
        toast.success('Address deleted successfully')
      } catch (error) {
        toast.error('Failed to delete address')
      }
    }
  }

  const getAddressTypeColor = (type) => {
    const t = type?.toLowerCase() || ''
    if (t.includes('home')) return 'bg-blue-50 border-blue-200 text-blue-700'
    if (t.includes('office')) return 'bg-purple-50 border-purple-200 text-purple-700'
    if (t.includes('default')) return 'bg-teal-50 border-teal-200 text-teal-700'
    return 'bg-gray-50 border-gray-200 text-gray-700'
  }

  const getAddressTypeIcon = (type) => {
    const t = type?.toLowerCase() || ''
    if (t.includes('home')) return '🏠'
    if (t.includes('office')) return '🏢'
    return '📍'
  }

  // Get the state/city name from the code
  const getCityName = (cityCode, countryCode) => {
    if (!cityCode || !countryCode) return cityCode
    try {
      const states = State.getStatesOfCountry(countryCode)
      const state = states.find(s => s.isoCode === cityCode)
      return state?.name || cityCode
    } catch (e) {
      return cityCode
    }
  }

  // Get the country name from the code
  const getCountryName = (countryCode) => {
    if (!countryCode) return countryCode
    try {
      const country = Country.getCountryByCode(countryCode)
      return country?.name || countryCode
    } catch (e) {
      return countryCode
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`${getAddressTypeColor(address.addressType)} px-3 py-1 rounded-full border`}>
            <div className="flex items-center gap-1 text-sm font-bold">
              <span>{getAddressTypeIcon(address.addressType)}</span>
              <span className="capitalize">{address.addressType || 'Address'}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title="Edit address"
          >
            <MdEdit className="text-lg" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete address"
            disabled={isDeleting}
          >
            <MdDelete className="text-lg" />
          </button>
        </div>
      </div>

      {/* Address Details */}
      <div className="space-y-3 text-sm">
        {/* Primary Address Line */}
        <div>
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Address</p>
          <p className="text-gray-900 font-medium">{address.address1}</p>
          {address.address2 && (
            <p className="text-gray-700">{address.address2}</p>
          )}
        </div>

        {/* City & Zip */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">City</p>
            <p className="text-gray-900 font-medium">{getCityName(address.city, address.country)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Postal Code</p>
            <p className="text-gray-900 font-medium">{address.zipCode || '—'}</p>
          </div>
        </div>

        {/* Country */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Country</p>
          <p className="text-gray-900 font-medium">{getCountryName(address.country)}</p>
        </div>
      </div>
    </div>
  )
}

const AddressModal = ({ open, setOpen, dispatch, editingId, editingAddress, isLoading }) => {
  const [country, setCountry] = useState(editingAddress?.country || '')
  const [city, setCity] = useState(editingAddress?.city || '')
  const [zipCode, setZipCode] = useState(editingAddress?.zipCode || '')
  const [address1, setAddress1] = useState(editingAddress?.address1 || '')
  const [address2, setAddress2] = useState(editingAddress?.address2 || '')
  const [addressType, setAddressType] = useState(editingAddress?.addressType || 'Home')
  const [validationErrors, setValidationErrors] = useState({})

  // Validate form fields
  const validateForm = () => {
    const errors = {}

    if (!addressType?.trim()) {
      errors.addressType = 'Address type is required'
    }

    if (!country?.trim()) {
      errors.country = 'Country is required'
    }

    if (!city?.trim()) {
      errors.city = 'City is required'
    }

    if (!address1?.trim()) {
      errors.address1 = 'Address line 1 is required'
    } else if (address1.trim().length < 5) {
      errors.address1 = 'Address must be at least 5 characters'
    }

    if (address2 && address2.trim().length > 100) {
      errors.address2 = 'Address line 2 cannot exceed 100 characters'
    }

    if (zipCode && zipCode.trim().length > 20) {
      errors.zipCode = 'Postal code cannot exceed 20 characters'
    }

    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      toast.error('Please fix the validation errors')
      return
    }

    try {
      setValidationErrors({})
      dispatch(
        updatUserAddress(
          country,
          city,
          address1,
          address2 || '',
          zipCode || '',
          addressType
        )
      )
      toast.success('Address saved successfully!')

      // Reset form
      setCountry('')
      setCity('')
      setAddress1('')
      setAddress2('')
      setZipCode('')
      setAddressType('Home')
      setOpen(false)
    } catch (error) {
      console.error('Error adding address:', error)
      toast.error(error.message || 'Failed to save address')
    }
  }

  const handleClose = () => {
    setValidationErrors({})
    setOpen(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-teal-50 to-teal-100 px-6 py-4 border-b border-teal-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <MdLocationOn className="text-teal-600 text-xl" />
            {editingId ? 'Edit Address' : 'Add New Address'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition disabled:opacity-50"
            disabled={isLoading}
          >
            <RxCross1 className="text-2xl" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Address Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Address Type
              {validationErrors.addressType && <span className="text-red-600 text-xs ml-1">({validationErrors.addressType})</span>}
            </label>
            <select
              value={addressType}
              onChange={(e) => {
                setAddressType(e.target.value)
                setValidationErrors({ ...validationErrors, addressType: '' })
              }}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:border-teal-600 focus:ring-2 focus:ring-teal-600 ${
                validationErrors.addressType ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
            >
              <option value="Home">🏠 Home</option>
              <option value="Office">🏢 Office</option>
              <option value="Other">📍 Other</option>
            </select>
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Country
              {validationErrors.country && <span className="text-red-600 text-xs ml-1">({validationErrors.country})</span>}
            </label>
            <select
              value={country}
              onChange={(e) => {
                setCountry(e.target.value)
                setCity('')
                setValidationErrors({ ...validationErrors, country: '' })
              }}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:border-teal-600 focus:ring-2 focus:ring-teal-600 ${
                validationErrors.country ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
            >
              <option value="">Select your country</option>
              {Country.getAllCountries().map((item) => (
                <option key={item.isoCode} value={item.isoCode}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              City
              {validationErrors.city && <span className="text-red-600 text-xs ml-1">({validationErrors.city})</span>}
            </label>
            <select
              value={city}
              onChange={(e) => {
                setCity(e.target.value)
                setValidationErrors({ ...validationErrors, city: '' })
              }}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:border-teal-600 focus:ring-2 focus:ring-teal-600 ${
                validationErrors.city ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={!country || isLoading}
            >
              <option value="">Select your city</option>
              {country &&
                State.getStatesOfCountry(country).map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Address Line 1 */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Address Line 1
              {validationErrors.address1 && <span className="text-red-600 text-xs ml-1">({validationErrors.address1})</span>}
            </label>
            <input
              type="text"
              value={address1}
              onChange={(e) => {
                setAddress1(e.target.value)
                setValidationErrors({ ...validationErrors, address1: '' })
              }}
              placeholder="Street address"
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:border-teal-600 focus:ring-2 focus:ring-teal-600 ${
                validationErrors.address1 ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
              maxLength={100}
            />
            {address1.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">{address1.length}/100 characters</p>
            )}
          </div>

          {/* Address Line 2 */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Address Line 2
              {validationErrors.address2 && <span className="text-red-600 text-xs ml-1">({validationErrors.address2})</span>}
            </label>
            <input
              type="text"
              value={address2}
              onChange={(e) => {
                setAddress2(e.target.value)
                setValidationErrors({ ...validationErrors, address2: '' })
              }}
              placeholder="Apt, suite, etc. (optional)"
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:border-teal-600 focus:ring-2 focus:ring-teal-600 ${
                validationErrors.address2 ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
              maxLength={100}
            />
          </div>

          {/* Postal Code */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Postal Code
              {validationErrors.zipCode && <span className="text-red-600 text-xs ml-1">({validationErrors.zipCode})</span>}
            </label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => {
                setZipCode(e.target.value)
                setValidationErrors({ ...validationErrors, zipCode: '' })
              }}
              placeholder="Postal code"
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:border-teal-600 focus:ring-2 focus:ring-teal-600 ${
                validationErrors.zipCode ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
              maxLength={20}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save Address'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CustomerAddressesPage
