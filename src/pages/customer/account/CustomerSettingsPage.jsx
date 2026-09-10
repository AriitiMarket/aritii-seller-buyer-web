import React from 'react'
import ProfileContent from '../../../components/profile/ProfileContent'

// Buyer Account: Settings.
// Reuses the shared profile editor — the Change Password tab (active===6) plus
// personal info are the customer's account settings, scoped to their own user.
const CustomerSettingsPage = () => <ProfileContent active={6} />
export default CustomerSettingsPage