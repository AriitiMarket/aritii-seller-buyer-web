import React from 'react'
import ProfileContent from '../../../components/profile/ProfileContent'

// Buyer Account: Profile.
// Reuses the existing rich profile editor (personal info, avatar, password) from the
// shared profile component. Only the logged-in buyer's data is editable.
const CustomerProfilePage = () => <ProfileContent active={1} />
export default CustomerProfilePage