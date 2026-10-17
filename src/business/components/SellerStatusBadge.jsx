import React from 'react';
import { normalizeStatus } from '@/shared/utils/orderStatus';

/**
 * SellerStatusBadge — consistent status badge across the seller workspace.
 * Reuses existing normalizeStatus utility.
 */
const STATUS_CONFIG = {
  Published:   { cls: 'seller-status-badge published',   label: 'Published' },
  Active:      { cls: 'seller-status-badge active',      label: 'Active' },
  Processing:  { cls: 'seller-status-badge processing',  label: 'Processing' },
  Confirmed:   { cls: 'seller-status-badge confirmed',   label: 'Confirmed' },
  Shipped:     { cls: 'seller-status-badge processing',  label: 'Shipped' },
  'In Transit':{ cls: 'seller-status-badge processing',  label: 'In Transit' },
  Delivered:   { cls: 'seller-status-badge published',   label: 'Delivered' },
  Pending:     { cls: 'seller-status-badge pending',     label: 'Pending' },
  Cancelled:   { cls: 'seller-status-badge cancelled',   label: 'Cancelled' },
  Draft:       { cls: 'seller-status-badge draft',       label: 'Draft' },
  Archived:    { cls: 'seller-status-badge draft',       label: 'Archived' },
  Inactive:    { cls: 'seller-status-badge inactive',    label: 'Inactive' },
};

const SellerStatusBadge = ({ status }) => {
  const s = normalizeStatus(status) || 'Pending';
  const config = STATUS_CONFIG[s] || STATUS_CONFIG.Pending;

  return (
    <span className={config.cls}>
      {config.label}
    </span>
  );
};

export default SellerStatusBadge;
