import React from 'react';
import MarketplaceHeader from '@/public/components/MarketplaceHeader';

/**
 * BuyerHeader — unified with MarketplaceHeader so that the shopping experience
 * remains 100% consistent across public browsing, search, and buyer account pages.
 */
const BuyerHeader = (props) => {
  return <MarketplaceHeader {...props} />;
};

export default BuyerHeader;
