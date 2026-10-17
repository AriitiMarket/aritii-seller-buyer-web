import React from 'react';

/**
 * SellerFormSection — consistent form section wrapper for seller pages.
 */
const SellerFormSection = ({ title, children }) => {
  return (
    <section className="seller-form-section">
      {title && <h2 className="seller-form-section-title">{title}</h2>}
      <div className="space-y-4">{children}</div>
    </section>
  );
};

export default SellerFormSection;
