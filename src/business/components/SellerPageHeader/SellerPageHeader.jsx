import React from 'react';

const SellerPageHeader = ({ 
  title, 
  description, 
  actions = null,
  icon: Icon = null 
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-2 bg-brand-primary-light rounded-lg">
              <Icon className="text-brand-primary-dark" size={24} />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {description && (
              <p className="text-sm text-gray-600 mt-0.5">{description}</p>
            )}
          </div>
        </div>
        
        {actions && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerPageHeader;
