import React from 'react';
import Loader from '@/components/common/Loading';

/**
 * SellerLoadingState — centered loading state for seller pages.
 */
const SellerLoadingState = ({ label = 'Loading…' }) => {
  return (
    <div className="seller-loading-state">
      <Loader variant="inline" label={label} />
    </div>
  );
};

export default SellerLoadingState;
