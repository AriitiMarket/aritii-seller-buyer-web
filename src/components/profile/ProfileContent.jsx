import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../../services/api'
import { Avatar } from '../common/ImageWithFallback'
import { AiOutlineCamera, AiOutlineArrowRight, AiOutlineDelete } from 'react-icons/ai'
import { MdTrackChanges } from 'react-icons/md'
import { RxCross1 } from 'react-icons/rx'
import { Country, State } from 'country-state-city'
import {
  updatUserAddress,
  deleteUserAddress,
  updateUserInformation,
  loadUser
} from '../../store/redux/actions/user'
import { getAllOrdersOfUser } from '../../store/redux/actions/order'
import './ProfileContent.css'

const ProfileContent = ({ active }) => {
  const { user } = useSelector((state) => state.user)
  const { orders } = useSelector((state) => state.order)
  const dispatch = useDispatch()

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setPhoneNumber(user.phoneNumber)
    }
  }, [user])

  const handleProfileSubmit = (e) => {
    e.preventDefault()
    dispatch(updateUserInformation(name, email, phoneNumber, password))
    setPassword('')
  }

  const handleAvatarChange = async (e) => {
    try {
      const file = e.target.files[0]
      if (!file) return

      const formData = new FormData()
      formData.append('image', file)

      await api.put('/user/update-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Avatar updated successfully!')
      dispatch(loadUser())
    } catch (err) {
      toast.error(err.response?.data?.message || err.message)
    }
  }

  return (
    <div className="w-full">
      {active === 1 && <ProfileSection user={user} onAvatarChange={handleAvatarChange} onSubmit={handleProfileSubmit} name={name} setName={setName} email={email} setEmail={setEmail} phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} password={password} setPassword={setPassword} />}

      {active === 2 && <AllOrders />}

      {active === 3 && <AllRefundOrders />}

      {active === 5 && <TrackOrder />}

      {active === 6 && <ChangePassword />}

      {active === 7 && <Address />}
    </div>
  )
}

// ============ Profile Section ============
const ProfileSection = ({
  user,
  onAvatarChange,
  onSubmit,
  name,
  setName,
  email,
  setEmail,
  phoneNumber,
  setPhoneNumber,
  password,
  setPassword
}) => {
  return (
    <div className="profile-section">
      {/* Avatar Section */}
      <div className="profile-avatar-wrapper">
        <div className="profile-avatar-container">
          <Avatar
            data={user}
            fallback="/aritii-logo.svg"
            className="profile-avatar-image"
            alt={user?.name || 'Profile'}
          />
          <div className="profile-avatar-upload">
            <input
              type="file"
              id="avatar"
              accept="image/*"
              onChange={onAvatarChange}
            />
            <label htmlFor="avatar">
              <AiOutlineCamera />
            </label>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={onSubmit} className="profile-form-section">
        <div className="form-row">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              className="form-input"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              className="form-input"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              className="form-input"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>
          <div className="form-group">
            <label>Password (to confirm changes)</label>
            <input
              type="password"
              className="form-input"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Save Changes
          </button>
          <button type="reset" className="btn-secondary">
            Reset
          </button>
        </div>
      </form>
    </div>
  )
}

// ============ All Orders ============
const AllOrders = () => {
  const { user } = useSelector((state) => state.user)
  const { orders } = useSelector((state) => state.order)
  const dispatch = useDispatch()

  useEffect(() => {
    if (user?._id) {
      dispatch(getAllOrdersOfUser(user._id))
    }
  }, [dispatch, user?._id])

  const getStatusBadgeClass = (status) => {
    const statusLower = status?.toLowerCase() || ''
    if (statusLower === 'delivered') return 'status-badge status-badge--delivered'
    if (statusLower === 'processing' || statusLower === 'pending') return 'status-badge status-badge--processing'
    if (statusLower === 'shipped') return 'status-badge status-badge--shipped'
    if (statusLower === 'cancelled') return 'status-badge status-badge--cancelled'
    return 'status-badge status-badge--default'
  }

  const rows = orders?.map((item) => ({
    id: item._id,
    itemsQty: item.cart?.length || 0,
    total: `US$ ${item.totalPrice}`,
    status: item.status
  })) || []

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h2>My Orders</h2>
        <p className="orders-count">{rows.length} order{rows.length !== 1 ? 's' : ''}</p>
      </div>

      {rows.length === 0 ? (
        <div className="orders-empty">
          <p>No orders yet. Start shopping to see your orders here.</p>
          <Link to="/products" style={{ marginTop: '16px', display: 'inline-block', color: '#0B6E4F', textDecoration: 'none', fontWeight: 600 }}>
            Browse Products →
          </Link>
        </div>
      ) : (
        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Status</th>
                <th>Items</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((order) => (
                <tr key={order.id} className="order-row">
                  <td className="order-id">{order.id}</td>
                  <td>
                    <span className={getStatusBadgeClass(order.status)}>
                      {order.status}
                    </span>
                  </td>
                  <td className="items-qty">{order.itemsQty}</td>
                  <td className="order-total">{order.total}</td>
                  <td className="order-action">
                    <Link to={`/user/order/${order.id}`}>
                      <button className="view-btn" title="View Order Details">
                        <AiOutlineArrowRight size={18} />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ============ All Refund Orders ============
const AllRefundOrders = () => {
  const { user } = useSelector((state) => state.user)
  const { orders } = useSelector((state) => state.order)
  const dispatch = useDispatch()

  useEffect(() => {
    if (user?._id) {
      dispatch(getAllOrdersOfUser(user._id))
    }
  }, [dispatch, user?._id])

  const eligibleRefundOrders = orders?.filter((order) => order.status === 'Processing refund') || []

  const getStatusBadgeClass = (status) => {
    const statusLower = status?.toLowerCase() || ''
    if (statusLower === 'processing refund') return 'status-badge status-badge--refund'
    return 'status-badge status-badge--default'
  }

  const rows = eligibleRefundOrders.map((item) => ({
    id: item._id,
    itemsQty: item.cart?.length || 0,
    total: `US$ ${item.totalPrice}`,
    status: item.status
  }))

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h2>Refund Requests</h2>
        <p className="orders-count">{rows.length} refund{rows.length !== 1 ? 's' : ''}</p>
      </div>

      {rows.length === 0 ? (
        <div className="orders-empty">
          <p>No refund requests. All orders are normal.</p>
        </div>
      ) : (
        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Status</th>
                <th>Items</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((order) => (
                <tr key={order.id} className="order-row">
                  <td className="order-id">{order.id}</td>
                  <td>
                    <span className={getStatusBadgeClass(order.status)}>
                      {order.status}
                    </span>
                  </td>
                  <td className="items-qty">{order.itemsQty}</td>
                  <td className="order-total">{order.total}</td>
                  <td className="order-action">
                    <Link to={`/user/order/${order.id}`}>
                      <button className="view-btn" title="View Order Details">
                        <AiOutlineArrowRight size={18} />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ============ Track Order ============
const TrackOrder = () => {
  const { user } = useSelector((state) => state.user)
  const { orders } = useSelector((state) => state.order)
  const dispatch = useDispatch()

  useEffect(() => {
    if (user?._id) {
      dispatch(getAllOrdersOfUser(user._id))
    }
  }, [dispatch, user?._id])

  const getStatusBadgeClass = (status) => {
    const statusLower = status?.toLowerCase() || ''
    if (statusLower === 'delivered') return 'status-badge status-badge--delivered'
    if (statusLower === 'processing' || statusLower === 'pending') return 'status-badge status-badge--processing'
    if (statusLower === 'shipped') return 'status-badge status-badge--shipped'
    if (statusLower === 'cancelled') return 'status-badge status-badge--cancelled'
    return 'status-badge status-badge--default'
  }

  const rows = orders?.map((item) => ({
    id: item._id,
    itemsQty: item.cart?.length || 0,
    total: `US$ ${item.totalPrice}`,
    status: item.status
  })) || []

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h2>Track Orders</h2>
        <p className="orders-count">{rows.length} order{rows.length !== 1 ? 's' : ''}</p>
      </div>

      {rows.length === 0 ? (
        <div className="orders-empty">
          <p>No orders to track. Place an order to start tracking.</p>
        </div>
      ) : (
        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Status</th>
                <th>Items</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((order) => (
                <tr key={order.id} className="order-row">
                  <td className="order-id">{order.id}</td>
                  <td>
                    <span className={getStatusBadgeClass(order.status)}>
                      {order.status}
                    </span>
                  </td>
                  <td className="items-qty">{order.itemsQty}</td>
                  <td className="order-total">{order.total}</td>
                  <td className="order-action">
                    <Link to={`/user/track/order/${order.id}`}>
                      <button className="view-btn" title="Track Order">
                        <MdTrackChanges size={18} />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ============ Change Password ============
const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handlePasswordChange = async (e) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match!')
      return
    }

    try {
      const res = await api.put('/user/update-user-password', {
        oldPassword,
        newPassword,
        confirmPassword
      })
      toast.success(res.data.message || 'Password updated successfully!')
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password')
    }
  }

  return (
    <div className="profile-section">
      <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1f2937', marginBottom: '24px' }}>
        Change Password
      </h2>

      <form onSubmit={handlePasswordChange} className="password-form-wrapper">
        <div className="form-group">
          <label>Current Password</label>
          <input
            type="password"
            className="form-input"
            required
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter your current password"
          />
        </div>

        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            className="form-input"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
          />
        </div>

        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            className="form-input"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your new password"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Update Password
          </button>
          <button
            type="button"
            onClick={() => {
              setOldPassword('')
              setNewPassword('')
              setConfirmPassword('')
            }}
            className="btn-secondary"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  )
}

// ============ Address Manager ============
const Address = () => {
  const [open, setOpen] = useState(false)
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [addressType, setAddressType] = useState('')
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const addressTypeData = ['Default', 'Home', 'Office']

  const handleAddressSubmit = (e) => {
    e.preventDefault()

    if (!addressType || !country || !city || !address1) {
      toast.error('Please fill all required fields!')
      return
    }

    dispatch(
      updatUserAddress(country, city, address1, address2, zipCode, addressType)
    )
    setOpen(false)
    resetForm()
    toast.success('Address added successfully!')
  }

  const resetForm = () => {
    setCountry('')
    setCity('')
    setAddress1('')
    setAddress2('')
    setZipCode('')
    setAddressType('')
  }

  const handleDeleteAddress = (item) => {
    dispatch(deleteUserAddress(item._id))
    toast.success('Address deleted successfully!')
  }

  return (
    <div className="address-container">
      {/* Modal */}
      {open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Address</h2>
              <button
                className="modal-close-btn"
                onClick={() => {
                  setOpen(false)
                  resetForm()
                }}
              >
                <RxCross1 />
              </button>
            </div>

            <form onSubmit={handleAddressSubmit}>
              <div className="modal-body">
                <div className="modal-form-group">
                  <label>Country *</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    <option value="">Choose your country</option>
                    {Country?.getAllCountries().map((item) => (
                      <option key={item.isoCode} value={item.isoCode}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="modal-form-group">
                  <label>State/City *</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  >
                    <option value="">Choose your city</option>
                    {State?.getStatesOfCountry(country).map((item) => (
                      <option key={item.isoCode} value={item.isoCode}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="modal-form-group">
                  <label>Address Line 1 *</label>
                  <input
                    type="text"
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    placeholder="Street address"
                  />
                </div>

                <div className="modal-form-group">
                  <label>Address Line 2</label>
                  <input
                    type="text"
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                    placeholder="Apartment, suite, etc. (optional)"
                  />
                </div>

                <div className="modal-form-group">
                  <label>Zip/Postal Code *</label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="Zip code"
                  />
                </div>

                <div className="modal-form-group">
                  <label>Address Type *</label>
                  <select
                    value={addressType}
                    onChange={(e) => setAddressType(e.target.value)}
                  >
                    <option value="">Choose address type</option>
                    {addressTypeData.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="modal-btn modal-btn--secondary"
                  onClick={() => {
                    setOpen(false)
                    resetForm()
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="modal-btn modal-btn--primary">
                  Add Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="address-header">
        <h2>Saved Addresses</h2>
        <button className="add-address-btn" onClick={() => setOpen(true)}>
          + Add New Address
        </button>
      </div>

      {/* Address List */}
      {user?.addresses && user.addresses.length > 0 ? (
        <div style={{ marginTop: '24px' }}>
          {user.addresses.map((item, index) => (
            <div key={index} className="address-card">
              <div className="address-info">
                <span className="address-type-badge">{item.addressType}</span>
                <div className="address-details">
                  <div>{item.address1}</div>
                  {item.address2 && <div>{item.address2}</div>}
                  <div>
                    {item.city} {item.zipCode}
                  </div>
                </div>
                <div className="address-phone">
                  {user?.phoneNumber}
                </div>
              </div>
              <div className="address-actions">
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteAddress(item)}
                  title="Delete this address"
                >
                  <AiOutlineDelete size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="address-empty">
          <p>No saved addresses yet.</p>
          <button
            className="add-address-btn"
            onClick={() => setOpen(true)}
            style={{ marginTop: '16px' }}
          >
            Add Your First Address
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfileContent
