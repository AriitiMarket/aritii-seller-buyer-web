import React from 'react';

/**
 * Horizontally scrollable stage tabs used by both request dashboards.
 *
 * Counts are optional; when supplied each tab shows its own total so a
 * buyer/seller can see where work is waiting without leaving the page.
 * On mobile the strip scrolls sideways instead of wrapping (no page overflow).
 */
const RequestTabs = ({ tabs = [], counts = null, active, onChange, ariaLabel = 'Request stages' }) => (
  <div
    role="tablist"
    aria-label={ariaLabel}
    className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none"
  >
    {tabs.map((tab) => {
      const isActive = active === tab.id;
      const count = counts ? counts[tab.id] ?? 0 : null;
      return (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={isActive}
          onClick={() => onChange(tab.id)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap border transition ${
            isActive
              ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
              : 'bg-white text-gray-600 border-gray-200 hover:border-brand-primary hover:text-brand-primary-dark'
          }`}
        >
          {tab.label}
          {count !== null && (
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                isActive ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {count}
            </span>
          )}
        </button>
      );
    })}
  </div>
);

export default RequestTabs;
