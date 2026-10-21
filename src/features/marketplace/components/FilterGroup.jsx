import React, { useRef, useState } from 'react';

/**
 * FilterGroup — the collapsible group used by every catalog filter sidebar.
 *
 * The Products/Deals filter sidebar and the category sidebar each carried
 * their own copy of this block; only the "scroll the content into view when
 * the group opens" behaviour differed. One component now serves both.
 */
function FilterGroup({
  title,
  children,
  defaultOpen = true,
  countBadge = null,
  revealOnOpen = false,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef(null);

  const toggleOpen = () => {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen && revealOnOpen) {
      requestAnimationFrame(() => {
        contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      });
    }
  };

  return (
    <div className="border-b border-[#e7e7e7] dark:border-gray-700 py-3">
      <button
        type="button"
        onClick={toggleOpen}
        className="flex w-full items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-[#0f1111] dark:text-white mb-2"
        aria-expanded={open}
      >
        <span className="flex items-center gap-1.5">
          {title}
          {countBadge && (
            <span className="inline-flex items-center justify-center min-w-[18px] h-4 px-1 bg-[#febd69] text-[#0f1111] text-[10px] font-bold rounded-full">
              {countBadge}
            </span>
          )}
        </span>
        <span className={`text-gray-500 text-xs transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {open && <div ref={contentRef} className="space-y-0 scroll-mb-4">{children}</div>}
    </div>
  );
}

export { FilterGroup };
export default FilterGroup;
