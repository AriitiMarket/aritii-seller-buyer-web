import React from 'react';
import BuyerSettingsPage from './Settings';

/**
 * BuyerProfilePage
 *
 * Merged into Buyer Settings:
 * Renders the centered, borderless BuyerSettingsPage with 'account' active by default.
 */
const BuyerProfilePage = (props) => {
  return <BuyerSettingsPage initialSection="account" {...props} />;
};

export default BuyerProfilePage;
