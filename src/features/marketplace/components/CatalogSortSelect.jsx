import React from 'react';

/**
 * CatalogSortSelect — the sort dropdown shared by every public catalog page
 * (/products, /best-selling, /deals, /shops).
 *
 * The four pages each carried their own copy of the same `<select>` with a
 * different Tailwind string, so the control looked different on every page.
 */
const CatalogSortSelect = ({
  value,
  onChange,
  options = [],
  ariaLabel = 'Sort',
  className = '',
  id,
}) => {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={ariaLabel}
      className={`px-3 py-1.5 text-sm border border-market-border rounded-button bg-market-surface text-market-on-surface focus:outline-none focus:ring-2 focus:ring-market-primary/30 transition-colors ${className}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export { CatalogSortSelect };
export default CatalogSortSelect;
