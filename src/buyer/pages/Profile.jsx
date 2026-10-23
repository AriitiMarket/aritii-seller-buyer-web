import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Avatar } from '@/components/common/ImageWithFallback'
import { AiOutlineCamera } from 'react-icons/ai'
import { toast } from 'react-toastify'
import { updateUserInformation, updateUserAvatar } from '@/store/slices/userThunks'
import { MdEdit } from 'react-icons/md'

const BuyerProfilePage = () => {
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
    <div className="w-full max-w-2xl mx-auto space-y-6 flex flex-col items-center">
      {/* Header — Centered */}
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-extrabold text-market-on-surface dark:text-white">My Profile</h1>
        <p className="text-sm text-market-on-surface-variant dark:text-gray-400 mt-1">Manage your personal information</p>
      </div>

      <div className="w-full">
        {/* Profile Card — Centered & Border None */}
        <div className="bg-white dark:bg-[#1a222d] rounded-2xl shadow-sm border-0 border-none overflow-hidden">
          {/* Avatar Section — Border None */}
          <div className="bg-gradient-to-r from-market-surface-container-low to-market-surface-container dark:from-[#131921] dark:to-[#1a222d] px-8 py-10 flex flex-col items-center border-none">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#2162a1] to-[#0064f9] overflow-hidden flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-[#2162a1]/20">
                <Avatar
                  data={user}
                  fallback={user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  className="w-full h-full object-cover"
                />
              </div>
              <label
                htmlFor="avatar"
                className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 text-market-secondary p-2 rounded-xl cursor-pointer hover:bg-market-surface-dim transition shadow-md border-0 border-none"
                style={{ pointerEvents: loading ? 'none' : 'auto', opacity: loading ? 0.5 : 1 }}
              >
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
            <h2 className="text-lg font-bold text-market-on-surface dark:text-white">{user?.name || 'User'}</h2>
            <p className="text-sm text-market-on-surface-variant dark:text-gray-400 mt-0.5">{user?.email}</p>
            <p className="text-xs text-gray-400 mt-1">
              Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : ''}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-market-on-surface dark:text-white">Personal Information</h3>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-market-secondary hover:bg-market-surface-container dark:hover:bg-gray-800 rounded-full transition"
              >
                <MdEdit size={14} />
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-market-on-surface dark:text-gray-200 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm transition ${
                    isEditing
                      ? 'border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-market-secondary focus:ring-2 focus:ring-market-secondary/20'
                      : 'border-0 border-none bg-market-surface-dim dark:bg-gray-800/60 text-market-on-surface-variant dark:text-gray-300 cursor-not-allowed'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-market-on-surface dark:text-gray-200 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm transition ${
                    isEditing
                      ? 'border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-market-secondary focus:ring-2 focus:ring-market-secondary/20'
                      : 'border-0 border-none bg-market-surface-dim dark:bg-gray-800/60 text-market-on-surface-variant dark:text-gray-300 cursor-not-allowed'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-market-on-surface dark:text-gray-200 mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm transition ${
                    isEditing
                      ? 'border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-market-secondary focus:ring-2 focus:ring-market-secondary/20'
                      : 'border-0 border-none bg-market-surface-dim dark:bg-gray-800/60 text-market-on-surface-variant dark:text-gray-300 cursor-not-allowed'
                  }`}
                />
              </div>

              {isEditing && (
                <div>
                  <label className="block text-sm font-semibold text-market-on-surface dark:text-gray-200 mb-1.5">Current Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Required to save changes"
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl text-sm focus:border-market-secondary focus:ring-2 focus:ring-market-secondary/20"
                  />
                  <p className="text-xs text-gray-400 mt-1">Enter your password to confirm changes</p>
                </div>
              )}
            </div>

            {isEditing && (
              <div className="flex gap-3 mt-6 pt-6 border-0 border-none">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-5 py-2.5 bg-market-primary text-market-on-primary rounded-xl text-sm font-semibold hover:bg-market-primary-hover transition disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-market-on-surface dark:text-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition border-0 border-none"
                >
                  Discard
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default BuyerProfilePage
