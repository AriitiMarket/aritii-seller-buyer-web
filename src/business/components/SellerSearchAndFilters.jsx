import React from 'react';

/**
 * SellerSearchAndFilters — search bar + filter chips toolbar for seller pages.
 */
const SellerSearchAndFilters = ({
  searchValue,
  onSearchChange,
  filters,
  onFilterChange,
  activeFilter,
  placeholder = 'Search…',
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-market-border pb-3">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-market-on-surface-variant text-sm">🔍</span>
        <input
          type="search"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="seller-form-input pl-9 pr-4"
          aria-label="Search"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.key;
          return (
            <button
              key={filter.key}
              type="button"
              onClick={() => onFilterChange(filter.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive
                ? 'bg-market-primary text-market-on-primary'
                : 'text-market-on-surface-variant hover:bg-market-surface-container-high hover:text-market-primary'
              }`}
              aria-pressed={isActive}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SellerSearchAndFilters;
