import React from 'react';
import EmptyState from '@/components/common/EmptyState';
import Button from '@/components/common/Button';

/**
 * CatalogErrorState — the "could not load" state shared by every public
 * catalog page.
 *
 * The four catalog pages each carried their own copy of the same empty state
 * and "Try again" button; only the title differed.
 */
const CatalogErrorState = ({ title, description, onRetry }) => (
  <EmptyState
    title={title}
    description={description}
    action={
      <Button onClick={onRetry} className="bg-[#75d04b] hover:bg-[#5ac12f] text-white">
        Try again
      </Button>
    }
  />
);

export { CatalogErrorState };
export default CatalogErrorState;
