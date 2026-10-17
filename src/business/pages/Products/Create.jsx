import React from 'react';
import CreateProduct from '@/business/components/CreateProduct';

const BusinessProductCreatePage = () => (
  <div className="seller-shell-bg min-h-screen space-y-6">
    <div className="seller-section-header">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-market-primary/10 text-market-primary">
          <span className="text-2xl">📦</span>
        </div>
        <div>
          <h1 className="seller-section-header-title">Add Product</h1>
          <p className="seller-section-header-desc">Create a new product for your shop. It will appear in the marketplace once published.</p>
        </div>
      </div>
    </div>
    <div className="max-w-3xl">
      <CreateProduct />
    </div>
  </div>
);

export default BusinessProductCreatePage;
