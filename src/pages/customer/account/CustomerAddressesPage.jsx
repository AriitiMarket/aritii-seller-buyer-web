import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Country, State } from 'country-state-city'
import { toast } from 'react-toastify'
import { updatUserAddress, deleteUserAddress } from '../../../store/redux/actions/user'
import { MdLocationOn, MdAdd, MdDelete, MdCheckCircle } from 'react-icons/md'
import { RxCross1 } from 'react-icons/rx'

// Buyer Account: Addresses - Modern card-based address management
const CustomerAddressesPage = () => {
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [addresses, setAddresses] = useState(user?.addresses || [])

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
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition"
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
            addresses={addresses}
            setAddresses={setAddresses}
            dispatch={dispatch}
          />
        )}

        {/* Addresses Grid */}
        {addresses && addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address, idx) => (
              <AddressCard
                key={idx}
                address={address}
                idx={idx}
                dispatch={dispatch}
                setAddresses={setAddresses}
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
              onClick={() => setOpen(true)}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition inline-block"
            >
              Add Your First Address
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const AddressCard = ({ address, idx, dispatch, setAddresses }) => {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      dispatch(deleteUserAddress(address._id))
      toast.success('Address deleted successfully')
      setAddresses((prev) => prev.filter((_, i) => i !== idx))
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
        <button
          onClick={() => {
            handleDelete()
          }}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          title="Delete address"
        >
          <MdDelete className="text-lg" />
        </button>
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
            <p className="text-gray-900 font-medium">{address.city}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Postal Code</p>
            <p className="text-gray-900 font-medium">{address.zipCode || '—'}</p>
          </div>
        </div>

        {/* Country */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Country</p>
          <p className="text-gray-900 font-medium">{address.country}</p>
        </div>
      </div>
    </div>
  )
}

const AddressModal = ({ open, setOpen, addresses, setAddresses, dispatch }) => {
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [addressType, setAddressType] = useState('Home')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!addressType || !country || !city || !address1) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
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
      toast.success('Address added successfully!')
      
      // Reset form
      setCountry('')
      setCity('')
      setAddress1('')
      setAddress2('')
      setZipCode('')
      setAddressType('Home')
      setOpen(false)
    } catch (error) {
      toast.error('Failed to add address')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-teal-50 to-teal-100 px-6 py-4 border-b border-teal-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <MdLocationOn className="text-teal-600 text-xl" />
            Add New Address
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <RxCross1 className="text-2xl" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Address Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Address Type</label>
            <select
              value={addressType}
              onChange={(e) => setAddressType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-teal-600 focus:ring-2 focus:ring-teal-600"
            >
              <option value="Home">🏠 Home</option>
              <option value="Office">🏢 Office</option>
              <option value="Other">📍 Other</option>
            </select>
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Country *</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-teal-600 focus:ring-2 focus:ring-teal-600"
              disabled={loading}
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
            <label className="block text-sm font-semibold text-gray-900 mb-2">City *</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-teal-600 focus:ring-2 focus:ring-teal-600"
              disabled={!country || loading}
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
            <label className="block text-sm font-semibold text-gray-900 mb-2">Address Line 1 *</label>
            <input
              type="text"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              placeholder="Street address"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-teal-600 focus:ring-2 focus:ring-teal-600"
              disabled={loading}
            />
          </div>

          {/* Address Line 2 */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Address Line 2</label>
            <input
              type="text"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              placeholder="Apt, suite, etc. (optional)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-teal-600 focus:ring-2 focus:ring-teal-600"
              disabled={loading}
            />
          </div>

          {/* Postal Code */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Postal Code</label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Postal code"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-teal-600 focus:ring-2 focus:ring-teal-600"
              disabled={loading}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Save Address'}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
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
