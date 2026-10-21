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
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-gray-200 dark:border-gray-800 pb-3">
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        <input
          type="search"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-[#1a222d] border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] transition-colors"
          aria-label="Search"
        />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.key;
          return (
            <button
              key={filter.key}
              type="button"
              onClick={() => onFilterChange(filter.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${isActive
                ? 'bg-[#131921] text-white shadow-sm dark:bg-white dark:text-[#131921]'
                : 'text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
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
