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
          <h1 className="text-2xl md:text-3xl font-bold text-[#171A21]">Addresses</h1>
          <p className="text-sm text-[#667085] mt-1">Manage your delivery addresses</p>
        </div>
        <button
          onClick={() => { setEditingId(null); setOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#20305C] text-white rounded-xl text-sm font-semibold hover:bg-[#2C3F6E] transition disabled:opacity-50"
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
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-[#E5E7EB] text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-[#E5E7EB] border-t-[#20305C] rounded-full"></div>
          <p className="text-[#667085] text-sm mt-4">Loading addresses...</p>
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
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-[#E5E7EB] text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MdLocationOn className="text-3xl text-gray-300" />
          </div>
          <p className="text-[#667085] font-medium mb-1">No addresses yet</p>
          <p className="text-[#667085] text-sm mb-6">Add a delivery address to get started</p>
          <button
            onClick={() => { setEditingId(null); setOpen(true); }}
            className="px-6 py-2.5 bg-[#20305C] text-white rounded-xl text-sm font-semibold hover:bg-[#2C3F6E] transition"
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
    if (t.includes('home')) return { emoji: '🏠', color: 'bg-blue-50 border-blue-200 text-blue-700' }
    if (t.includes('office')) return { emoji: '🏢', color: 'bg-purple-50 border-purple-200 text-purple-700' }
    return { emoji: '📍', color: 'bg-[#F7F8FA] border-[#E5E7EB] text-[#171A21]' }
  }

  const locationLine = [address.sectorName, address.areaName, address.cityName, address.regionName].filter(Boolean).join(', ')
  const legacyLine = [address.address1, address.city, address.country].filter(Boolean).join(', ')
  const typeConfig = getTypeConfig(address.addressType || address.label)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${typeConfig.color}`}>
          <span>{typeConfig.emoji}</span>
          <span className="capitalize">{address.addressType || address.label || 'Address'}</span>
        </div>
        <div className="flex gap-1">
          <button onClick={onEdit} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
            <MdEdit size={16} />
          </button>
          <button onClick={handleDelete} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50" title="Delete" disabled={isDeleting}>
            <MdDelete size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-2.5 text-sm">
        {locationLine && (
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Location</p>
            <p className="text-[#171A21] font-medium mt-0.5">{locationLine}</p>
          </div>
        )}
        {(address.houseBuilding || address.landmark || address.description || address.address1) && (
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Address</p>
            {address.houseBuilding && <p className="text-[#171A21] font-medium mt-0.5">{address.houseBuilding}</p>}
            {address.landmark && <p className="text-[#667085] text-xs">Near: {address.landmark}</p>}
            {address.description && <p className="text-[#667085] text-xs">{address.description}</p>}
            {!address.houseBuilding && address.address1 && <p className="text-[#171A21] font-medium mt-0.5">{address.address1}</p>}
          </div>
        )}
        {address.phone && (
          <div className="pt-2 border-t border-[#E5E7EB]">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Phone</p>
            <p className="text-[#171A21] font-medium mt-0.5">{address.phone}</p>
          </div>
        )}
        {!locationLine && legacyLine && (
          <p className="text-[#171A21] font-medium">{legacyLine}</p>
        )}
      </div>
    </div>
  )
}

const AddressModal = ({ open, setOpen, dispatch, editingId, editingAddress, isLoading }) => {
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
  })
  const [houseBuilding, setHouseBuilding] = useState(editingAddress?.houseBuilding || '')
  const [landmark, setLandmark] = useState(editingAddress?.landmark || '')
  const [description, setDescription] = useState(editingAddress?.description || editingAddress?.address1 || '')
  const [phone, setPhone] = useState(editingAddress?.phone || '')
  const [validationErrors, setValidationErrors] = useState({})

  const validateForm = () => {
    const errors = {}
    if (!addressType?.trim()) errors.addressType = 'Required'
    if (!locationData.sectorId) errors.location = 'Select location'
    if (!houseBuilding?.trim() && !landmark?.trim() && !description?.trim()) errors.address = 'Required'
    if (!phone?.trim()) errors.phone = 'Required'
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
      const addressPayload = {
        regionId: locationData.regionId,
        regionName: locationData.regionName,
        cityId: locationData.cityId,
        cityName: locationData.cityName,
        areaId: locationData.areaId,
        areaName: locationData.areaName,
        sectorId: locationData.sectorId,
        sectorName: locationData.sectorName,
        deliveryZoneId: locationData.deliveryZoneId,
        deliveryZoneName: locationData.deliveryZoneName,
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
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-[#171A21]">{editingId ? 'Edit Address' : 'Add New Address'}</h2>
          <button onClick={handleClose} className="p-1 rounded-lg hover:bg-gray-100 transition">
            <RxCross1 className="text-xl text-[#667085]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#171A21] mb-1.5">Address Type</label>
            <select
              value={addressType}
              onChange={(e) => { setAddressType(e.target.value); setValidationErrors({ ...validationErrors, addressType: '' }); }}
              className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm focus:border-[#20305C] focus:ring-2 focus:ring-[#20305C]/20"
              disabled={isLoading}
            >
              <option value="Home">Home</option>
              <option value="Office">Office</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#171A21] mb-1.5">Delivery Location</label>
            <LocationSelector onSelect={setLocationData} initialSelection={locationData} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#171A21] mb-1.5">House / Building</label>
            <input
              type="text"
              value={houseBuilding}
              onChange={(e) => { setHouseBuilding(e.target.value); setValidationErrors({ ...validationErrors, address: '' }); }}
              placeholder="House no., building name"
              className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm focus:border-[#20305C] focus:ring-2 focus:ring-[#20305C]/20"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#171A21] mb-1.5">Landmark</label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="Nearby landmark"
              className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm focus:border-[#20305C] focus:ring-2 focus:ring-[#20305C]/20"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#171A21] mb-1.5">Street / Directions</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Additional directions"
              className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm focus:border-[#20305C] focus:ring-2 focus:ring-[#20305C]/20 resize-none"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#171A21] mb-1.5">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setValidationErrors({ ...validationErrors, phone: '' }); }}
              placeholder="Phone number for delivery"
              className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm focus:border-[#20305C] focus:ring-2 focus:ring-[#20305C]/20"
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]">
            <button type="submit" disabled={isLoading} className="flex-1 px-4 py-2.5 bg-[#20305C] text-white rounded-xl text-sm font-semibold hover:bg-[#2C3F6E] transition disabled:opacity-50">
              {isLoading ? 'Saving...' : 'Save Address'}
            </button>
            <button type="button" onClick={handleClose} className="flex-1 px-4 py-2.5 border border-[#E5E7EB] text-[#171A21] rounded-xl text-sm font-semibold hover:bg-[#F7F8FA] transition disabled:opacity-50" disabled={isLoading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BuyerAddressesPage
