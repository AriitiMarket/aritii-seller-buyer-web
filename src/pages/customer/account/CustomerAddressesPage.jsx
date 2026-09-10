import React from 'react'
import ProfileContent from '../../../components/profile/ProfileContent'

// Buyer Account: Address Book.
// Reuses the shared address management editor (add/update/delete/set-default),
// scoped to the logged-in buyer via the identity address endpoints.
const CustomerAddressesPage = () => <ProfileContent active={7} />
export default CustomerAddressesPage