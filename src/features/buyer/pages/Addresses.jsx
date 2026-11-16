import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { updatUserAddress, deleteUserAddress } from '@/store/slices/userThunks'
import { addressService } from '@/services'
import { MdLocationOn, MdAdd, MdDelete, MdEdit } from 'react-icons/md'
import { RxCross1 } from 'react-icons/rx'
import LocationSelector from '@/components/common/LocationSelector'

const BuyerAddressesPage = () => {
  const { user, updateUserAddressLoading, deleteUserAddressLoading, addressError } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        setLoading(true)
        const allAddresses = await addressService.getAll()
        setAddresses(allAddresses)
      } catch (error) {
        toast.error('Failed to load addresses')
      } finally {
        setLoading(false)
      }
    }
    loadAddresses()
  }, [])

  useEffect(() => {
    if (user?.addresses) setAddresses(user.addresses)
  }, [user?.addresses])

  useEffect(() => {
    if (addressError) toast.error(addressError)
  }, [addressError])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Addresses</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your delivery addresses</p>
        </div>
        <button
          onClick={() => { setEditingId(null); setOpen(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#75d04b] text-white rounded-full text-sm font-semibold hover:brightness-95 active:brightness-90 transition shadow-sm disabled:opacity-50"
          disabled={updateUserAddressLoading || deleteUserAddressLoading}
        >
          <MdAdd size={18} />
          Add Address
        </button>
      </div>

      {/* Modal */}
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

      {/* Addresses */}
      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-200 dark:border-gray-700 border-t-[#75d04b] rounded-full" />
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">Loading addresses...</p>
        </div>
      ) : addresses && addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <AddressCard
              key={address._id}
              address={address}
              dispatch={dispatch}
              onEdit={() => { setEditingId(address._id); setOpen(true); }}
              isDeleting={deleteUserAddressLoading}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <MdLocationOn className="text-3xl text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-gray-900 dark:text-white font-medium mb-1">No addresses yet</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Add a delivery address to get started</p>
          <button
            onClick={() => { setEditingId(null); setOpen(true); }}
            className="px-6 py-2.5 bg-[#75d04b] text-white rounded-full text-sm font-semibold hover:brightness-95 active:brightness-90 transition shadow-sm"
            disabled={updateUserAddressLoading}
          >
            Add Your First Address
          </button>
        </div>
      )}
    </div>
  )
}

const AddressCard = ({ address, dispatch, onEdit, isDeleting }) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        dispatch(deleteUserAddress(address._id))
        toast.success('Address deleted successfully')
      } catch {
        toast.error('Failed to delete address')
      }
    }
  }

  const getTypeConfig = (type) => {
    const t = type?.toLowerCase() || ''
    if (t.includes('home')) return { emoji: '🏠', color: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300' }
    if (t.includes('office')) return { emoji: '🏢', color: 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300' }
    return { emoji: '📍', color: 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200' }
  }

  const locationLine = [address.sectorName, address.areaName, address.cityName, address.regionName].filter(Boolean).join(', ')
  const legacyLine = [address.address1, address.city, address.country].filter(Boolean).join(', ')
  const typeConfig = getTypeConfig(address.addressType || address.label)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md hover:border-[#75d04b]/50 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${typeConfig.color}`}>
          <span>{typeConfig.emoji}</span>
          <span className="capitalize">{address.addressType || address.label || 'Address'}</span>
        </div>
        <div className="flex gap-1">
          <button onClick={onEdit} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition" title="Edit">
            <MdEdit size={16} />
          </button>
          <button onClick={handleDelete} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition disabled:opacity-50" title="Delete" disabled={isDeleting}>
            <MdDelete size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-2.5 text-sm">
        {locationLine && (
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Location</p>
            <p className="text-gray-900 dark:text-white font-medium mt-0.5">{locationLine}</p>
          </div>
        )}
        {(address.houseBuilding || address.landmark || address.description || address.address1) && (
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Address</p>
            {address.houseBuilding && <p className="text-gray-900 dark:text-white font-medium mt-0.5">{address.houseBuilding}</p>}
            {address.landmark && <p className="text-gray-500 dark:text-gray-400 text-xs">Near: {address.landmark}</p>}
            {address.description && <p className="text-gray-500 dark:text-gray-400 text-xs">{address.description}</p>}
            {!address.houseBuilding && address.address1 && <p className="text-gray-900 dark:text-white font-medium mt-0.5">{address.address1}</p>}
          </div>
        )}
        {address.phone && (
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Phone</p>
            <p className="text-gray-900 dark:text-white font-medium mt-0.5">{address.phone}</p>
          </div>
        )}
        {(address.deliveryZoneName || address.portName) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            {address.deliveryZoneName && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#f3ffee] dark:bg-[#75d04b]/15 border border-[#75d04b]/30 text-xs font-semibold text-[#75d04b]">
                <span>📍 Zone:</span> {address.deliveryZoneName}
              </span>
            )}
            {address.portName && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                <span>⚓ Port:</span> {address.portName}
              </span>
            )}
          </div>
        )}
        {!locationLine && legacyLine && (
          <p className="text-gray-900 dark:text-white font-medium">{legacyLine}</p>
        )}
      </div>
    </div>
  )
}

const AddressModal = ({ _open, setOpen, dispatch, editingId, editingAddress, isLoading }) => {
  const [addressType, setAddressType] = useState(editingAddress?.addressType || editingAddress?.label || 'Home')
  const [locationData, setLocationData] = useState({
    regionId: editingAddress?.regionId || null,
    regionName: editingAddress?.regionName || null,
    cityId: editingAddress?.cityId || null,
    cityName: editingAddress?.cityName || null,
    areaId: editingAddress?.areaId || null,
    areaName: editingAddress?.areaName || null,
    sectorId: editingAddress?.sectorId || null,
    sectorName: editingAddress?.sectorName || null,
    deliveryZoneId: editingAddress?.deliveryZoneId || null,
    deliveryZoneName: editingAddress?.deliveryZoneName || null,
    portId: editingAddress?.portId || null,
    portName: editingAddress?.portName || null,
  })
  const [houseBuilding, setHouseBuilding] = useState(editingAddress?.houseBuilding || '')
  const [landmark, setLandmark] = useState(editingAddress?.landmark || '')
  const [description, setDescription] = useState(editingAddress?.description || editingAddress?.address1 || '')
  const [phone, setPhone] = useState(editingAddress?.phone || '')
  const [validationErrors, setValidationErrors] = useState({})

  const validateForm = () => {
    const errors = {}
    if (!addressType?.trim()) errors.addressType = 'Required'
    if (!locationData.sectorId && !locationData.cityId) errors.location = 'Select location'
    if (!houseBuilding?.trim() && !landmark?.trim() && !description?.trim()) errors.address = 'Required'
    const digits = String(phone || '').replace(/[^\d]/g, '')
    if (!digits) errors.phone = 'Required'
    else if (digits.length < 9 || digits.length > 15) errors.phone = 'Enter a valid phone number'
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      toast.error('Please fix the validation errors')
      return
    }
    try {
      setValidationErrors({})
      const effectiveSectorId = locationData.sectorId || locationData.cityId || null;
      const effectiveSectorName = locationData.sectorName || locationData.cityName || '';
      const addressPayload = {
        regionId: locationData.regionId,
        regionName: locationData.regionName,
        cityId: locationData.cityId,
        cityName: locationData.cityName,
        areaId: locationData.areaId,
        areaName: locationData.areaName,
        sectorId: effectiveSectorId,
        sectorName: effectiveSectorName,
        deliveryZoneId: locationData.deliveryZoneId,
        deliveryZoneName: locationData.deliveryZoneName,
        portId: locationData.portId || null,
        portName: locationData.portName || '',
        houseBuilding,
        landmark,
        description,
        phone,
        country: locationData.regionName || '',
        city: locationData.cityName || '',
        address1: [houseBuilding, landmark, description].filter(Boolean).join(', '),
        address2: '',
        zipCode: '',
        addressType,
        label: addressType,
      }
      dispatch(updatUserAddress(addressPayload))
      toast.success('Address saved successfully!')
      setOpen(false)
    } catch (error) {
      toast.error(error.message || 'Failed to save address')
    }
  }

  const handleClose = () => { setValidationErrors({}); setOpen(false) }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{editingId ? 'Edit Address' : 'Add New Address'}</h2>
          <button onClick={handleClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition">
            <RxCross1 className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">Address Type</label>
            <select
              value={addressType}
              onChange={(e) => { setAddressType(e.target.value); setValidationErrors({ ...validationErrors, addressType: '' }); }}
              className={`w-full px-4 py-2.5 border rounded-xl text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-[#75d04b] focus:ring-2 focus:ring-[#75d04b]/20 transition ${validationErrors.addressType ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`}
              disabled={isLoading}
            >
              <option value="Home">Home</option>
              <option value="Office">Office</option>
              <option value="Other">Other</option>
            </select>
            {validationErrors.addressType && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{validationErrors.addressType}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">Delivery Location</label>
            <LocationSelector onSelect={setLocationData} initialSelection={locationData} />
            {validationErrors.location && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{validationErrors.location}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">House / Building</label>
            <input
              type="text"
              value={houseBuilding}
              onChange={(e) => { setHouseBuilding(e.target.value); setValidationErrors({ ...validationErrors, address: '' }); }}
              placeholder="House no., building name"
              className={`w-full px-4 py-2.5 border rounded-xl text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-[#75d04b] focus:ring-2 focus:ring-[#75d04b]/20 transition ${validationErrors.address ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`}
              disabled={isLoading}
            />
            {validationErrors.address && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
                Add a house/building, a landmark or street directions
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">Landmark</label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="Nearby landmark"
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-[#75d04b] focus:ring-2 focus:ring-[#75d04b]/20 transition"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">Street / Directions</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Additional directions"
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-[#75d04b] focus:ring-2 focus:ring-[#75d04b]/20 transition resize-none"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setValidationErrors({ ...validationErrors, phone: '' }); }}
              placeholder="Phone number for delivery"
              className={`w-full px-4 py-2.5 border rounded-xl text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-[#75d04b] focus:ring-2 focus:ring-[#75d04b]/20 transition ${validationErrors.phone ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`}
              disabled={isLoading}
            />
            {validationErrors.phone && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{validationErrors.phone}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button type="submit" disabled={isLoading} className="flex-1 px-4 py-2.5 bg-[#75d04b] text-white rounded-full text-sm font-semibold hover:brightness-95 transition disabled:opacity-50">
              {isLoading ? 'Saving...' : 'Save Address'}
            </button>
            <button type="button" onClick={handleClose} className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-full text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50" disabled={isLoading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BuyerAddressesPage
