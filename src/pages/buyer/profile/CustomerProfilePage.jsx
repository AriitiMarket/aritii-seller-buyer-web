import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Avatar } from '../../../components/common/ImageWithFallback'
import { AiOutlineCamera } from 'react-icons/ai'
import { toast } from 'react-toastify'
import { loadUser, updateUserInformation, updateUserAvatar } from '../../../store/redux/actions/user'
import { MdEdit } from 'react-icons/md'

// Buyer Account: Profile - Modern card-based profile editor
const CustomerProfilePage = () => {
  const { user, loading } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '')
  const [password, setPassword] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
      setPhoneNumber(user.phoneNumber || '')
    }
  }, [user])

  const handleAvatarChange = async (e) => {
    try {
      const file = e.target.files[0]
      if (!file) return

      const formData = new FormData()
      formData.append('image', file)

      await dispatch(updateUserAvatar(formData))
      toast.success('Avatar updated successfully!')
    } catch (err) {
      toast.error(err?.message || 'Failed to update avatar')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !email || !phoneNumber) {
      toast.error('Please fill in all fields')
      return
    }
    dispatch(updateUserInformation(name, email, phoneNumber, password))
      .then(() => {
        setIsEditing(false)
        setPassword('')
        toast.success('Profile updated successfully!')
      })
      .catch((err) => {
        toast.error(err?.message || 'Failed to update profile')
      })
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen py-6 px-4 md:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your personal information and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center pb-8 border-b border-gray-200">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 overflow-hidden flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg">
                <Avatar
                  data={user}
                  fallback={user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  className="w-full h-full object-cover"
                />
              </div>
              <label htmlFor="avatar" className="absolute bottom-0 right-0 bg-teal-600 text-white p-2 rounded-full cursor-pointer hover:bg-teal-700 transition shadow-lg disabled:cursor-not-allowed disabled:opacity-50" style={{ pointerEvents: loading ? 'none' : 'auto', opacity: loading ? 0.5 : 1 }}>
                <AiOutlineCamera className="text-lg" />
                <input
                  type="file"
                  id="avatar"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={loading}
                />
              </label>
            </div>
            <p className="text-sm text-gray-600 text-center mt-4">
              {user?.name || 'User'} • Customer Account
            </p>
            <p className="text-xs text-gray-500 text-center mt-1">
              Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : ''}
            </p>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Toggle Edit Button */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-teal-600 hover:bg-teal-50 rounded-lg transition border border-teal-200"
              >
                <MdEdit className="text-base" />
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border rounded-lg text-sm transition ${
                    isEditing
                      ? 'border-gray-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600'
                      : 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'
                  }`}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border rounded-lg text-sm transition ${
                    isEditing
                      ? 'border-gray-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600'
                      : 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'
                  }`}
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border rounded-lg text-sm transition ${
                    isEditing
                      ? 'border-gray-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600'
                      : 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'
                  }`}
                />
              </div>

              {/* Password (only shown in edit mode) */}
              {isEditing && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Required to save changes"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-teal-600 focus:ring-2 focus:ring-teal-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter your password to confirm changes</p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            {isEditing && (
              <div className="flex gap-3 pt-6 border-t border-gray-200 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Discard
                </button>
              </div>
            )}
          </form>

          {/* Additional Info */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Account Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-1">Email</p>
                <p className="text-sm text-gray-900 font-medium">{user?.email}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-1">Member Since</p>
                <p className="text-sm text-gray-900 font-medium">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerProfilePage
