import React from 'react';
import { Link } from 'react-router-dom';

/**
 * SellerEmptyState — consistent empty state for seller pages.
 * Supports both Link (to) and button (onClick) actions.
 */
const SellerEmptyState = ({ title, description, action, icon }) => {
  return (
    <div className="seller-empty-state">
      {icon && <span className="seller-empty-state-icon" aria-hidden="true">{icon}</span>}
      <h3 className="seller-empty-state-title">{title}</h3>
      {description && <p className="seller-empty-state-desc">{description}</p>}
      {action && (
        action.to ? (
          <Link to={action.to} className="seller-btn-primary" aria-label={action.label}>
            {action.label}
          </Link>
        ) : (
          <button
            type="button"
            onClick={action.onClick}
            className="seller-btn-primary"
            aria-label={action.label}
          >
            {action.label}
          </button>
        )
      )}
    </div>
  );
};

export default SellerEmptyState;
