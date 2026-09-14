import React, { useState } from 'react'
import api from '../../../services/api'
import { toast } from 'react-toastify'
import { MdLock, MdCheckCircle } from 'react-icons/md'

// Buyer Account: Settings - Modern card-based settings page
const CustomerSettingsPage = () => {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordChanged, setPasswordChanged] = useState(false)

  const handlePasswordChange = async (e) => {
    e.preventDefault()

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    try {
      setLoading(true)
      const response = await api.put('/user/update-user-password', {
        oldPassword,
        newPassword,
        confirmPassword
      })

      toast.success(response.data.message || 'Password changed successfully!')
      setPasswordChanged(true)
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')

      setTimeout(() => {
        setPasswordChanged(false)
      }, 5000)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen py-6 px-4 md:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your account security and preferences</p>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-teal-50 to-teal-100 px-6 py-6 border-b border-teal-200">
            <div className="flex items-center gap-3">
              <div className="bg-teal-600 text-white p-3 rounded-lg">
                <MdLock className="text-2xl" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Change Password</h2>
                <p className="text-sm text-gray-600 mt-1">Update your password to secure your account</p>
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6 md:p-8">
            {/* Success Message */}
            {passwordChanged && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <MdCheckCircle className="text-2xl text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-900">Password updated successfully!</p>
                  <p className="text-xs text-green-700 mt-1">Your new password is now active</p>
                </div>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-6">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter your current password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-teal-600 focus:ring-2 focus:ring-teal-600 transition"
                    disabled={loading}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Required for security verification</p>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200"></div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Create a new password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-teal-600 focus:ring-2 focus:ring-teal-600 transition"
                  disabled={loading}
                />
                <PasswordStrengthIndicator password={newPassword} />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Confirm New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className={`w-full px-4 py-3 border rounded-lg text-sm transition ${
                    confirmPassword && newPassword && confirmPassword !== newPassword
                      ? 'border-red-300 focus:border-red-600 focus:ring-2 focus:ring-red-600'
                      : 'border-gray-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600'
                  }`}
                  disabled={loading}
                />
                {confirmPassword && newPassword && confirmPassword !== newPassword && (
                  <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
                )}
              </div>

              {/* Show Password Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="showPassword"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500 cursor-pointer"
                />
                <label htmlFor="showPassword" className="text-sm text-gray-700 cursor-pointer">
                  Show password
                </label>
              </div>

              {/* Password Requirements */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-blue-900 mb-2">Password Requirements:</p>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li className="flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    Minimum 6 characters
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    Mix of uppercase and lowercase letters recommended
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    Include numbers and special characters for better security
                  </li>
                </ul>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Security Tips */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h3 className="text-base font-bold text-gray-900 mb-4">🔐 Security Tips</h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex gap-3 items-start">
              <span className="text-teal-600 font-bold mt-1">✓</span>
              <span>Use a strong, unique password that you don't use on other websites</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-teal-600 font-bold mt-1">✓</span>
              <span>Never share your password with anyone, including Aritii support staff</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-teal-600 font-bold mt-1">✓</span>
              <span>Change your password regularly and if you suspect unauthorized access</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="text-teal-600 font-bold mt-1">✓</span>
              <span>Clear your browser cache if you're using a shared device</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// Password Strength Indicator Component
const PasswordStrengthIndicator = ({ password }) => {
  if (!password) return null

  const calculateStrength = (pwd) => {
    let strength = 0
    if (pwd.length >= 6) strength += 1
    if (pwd.length >= 8) strength += 1
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength += 1
    if (/\d/.test(pwd)) strength += 1
    if (/[!@#$%^&*]/.test(pwd)) strength += 1
    return strength
  }

  const strength = calculateStrength(password)
  const strengthPercentage = (strength / 5) * 100
  
  const getStrengthLabel = (s) => {
    if (s <= 1) return { label: 'Weak', color: 'bg-red-500', text: 'text-red-700' }
    if (s <= 2) return { label: 'Fair', color: 'bg-yellow-500', text: 'text-yellow-700' }
    if (s <= 3) return { label: 'Good', color: 'bg-yellow-400', text: 'text-yellow-700' }
    if (s <= 4) return { label: 'Strong', color: 'bg-green-500', text: 'text-green-700' }
    return { label: 'Very Strong', color: 'bg-green-600', text: 'text-green-700' }
  }

  const info = getStrengthLabel(strength)

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-gray-600">Password strength:</p>
        <p className={`text-xs font-semibold ${info.text}`}>{info.label}</p>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${info.color} transition-all duration-300`}
          style={{ width: `${strengthPercentage}%` }}
        ></div>
      </div>
    </div>
  )
}

export default CustomerSettingsPage
