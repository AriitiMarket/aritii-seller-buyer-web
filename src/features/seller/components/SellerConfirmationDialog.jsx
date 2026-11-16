import React from 'react';

/**
 * SellerConfirmationDialog — modal confirmation for destructive actions.
 */
const SellerConfirmationDialog = ({
  isOpen,
  onClose,
  title,
  description,
  onConfirm,
  confirmLabel = 'Confirm',
  confirmVariant = 'danger',
  cancelLabel = 'Cancel',
}) => {
  if (!isOpen) return null;

  const btnClasses = confirmVariant === 'danger'
    ? 'bg-red-600 text-white hover:bg-red-700'
    : 'bg-market-primary text-market-on-primary hover:bg-market-primary-hover';

  return (
    <div className="seller-confirm-dialog" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div className="seller-confirm-dialog-panel" onClick={(e) => e.stopPropagation()}>
        <h3 className="seller-confirm-dialog-title">{title}</h3>
        <p className="seller-confirm-dialog-desc">{description}</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="seller-btn-secondary"
            aria-label="Cancel"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onConfirm(); }}
            className={`seller-btn-primary ${btnClasses}`}
            aria-label={confirmLabel}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerConfirmationDialog;
