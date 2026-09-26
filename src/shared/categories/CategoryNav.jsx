import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { categoryHref } from './categoryHref';
import CategoryIcon from './CategoryIcon';

/**
 * CategoryNav — THE shared category navigation (two layout variants).
 *
 * - "rail": wrapping chip tabs — the buyer marketplace/shops headers (and the
 *           desktop chip row on public pages that have no sidebar). Chips wrap
 *           onto as many rows as they need; nothing scrolls sideways, and past
 *           `limit` they collapse behind a "More (+n)" toggle.
 * - "grid": chip/tile grid — the Categories page
 *
 * Every variant reads the active value from `?category=`, so links, chips and
 * sidebar rows can never disagree about what is selected. The vertical
 * sidebar list lives in `@/public/components/CategorySidebar` (it owns the
 * collapse-to-icon-rail behaviour); on <1024px the public catalog uses
 * `@/public/components/CategorySheet` (trigger + bottom sheet) instead.
 */

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function skeletonRail() {
  return (
    <div className="flex flex-wrap gap-2" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="w-20 h-9 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
      ))}
    </div>
  );
}

function skeletonGrid() {
  return (
    <div className="flex flex-wrap gap-2 md:gap-3" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="w-28 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
      ))}
    </div>
  );
}

const titleOf = (cat) => (typeof cat === 'string' ? cat : cat?.title || cat?.name || '');

function countOf(cat, counts) {
  if (counts) {
    const key = titleOf(cat);
    if (key && counts[key] !== undefined) return counts[key];
  }
  if (cat && typeof cat === 'object') return cat.productCount ?? cat.count ?? 0;
  return 0;
}

/* ------------------------------------------------------------------ */
/*  Variant: rail                                                      */
/* ------------------------------------------------------------------ */

function Rail({ categories, basePath, allLabel, counts, showIcon = true, limit = 12 }) {
  const [searchParams] = useSearchParams();
  const active = searchParams.get('category') || '';
  const [expanded, setExpanded] = useState(false);

  // Chips WRAP onto as many rows as they need — nothing scrolls sideways, so
  // every category stays reachable and visible ("more to explore" lives here,
  // behind the More chip, not in a separate shelf). Past `limit` they collapse
  // into a More/Show less toggle.
  useEffect(() => {
    if (!active) return;
    const index = categories.findIndex(
      (cat) => titleOf(cat).toLowerCase() === active.toLowerCase()
    );
    if (index >= limit) setExpanded(true);
  }, [active, categories, limit]);

  const overLimit = categories.length > limit;
  const shown = expanded || !overLimit ? categories : categories.slice(0, limit);
  const hiddenCount = categories.length - limit;

  const itemClass = (isActive) =>
    `flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs md:text-sm font-semibold border transition-colors whitespace-nowrap ${
      isActive
        ? 'bg-[#75d04b] text-white border-[#75d04b] shadow-sm'
        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-[#75d04b]/40 hover:text-[#75d04b]'
    }`;

  return (
    <nav className="flex flex-wrap items-center gap-2" aria-label="Categories">
      <Link
        to={basePath || '/products'}
        className={itemClass(!active)}
        aria-current={!active ? 'true' : undefined}
      >
        {allLabel || 'All'}
      </Link>
      {shown.map((cat) => {
        const name = titleOf(cat);
        if (!name) return null;
        const isActive = active?.toLowerCase() === name.toLowerCase();
        const count = countOf(cat, counts);
        return (
          <Link
            key={cat._id || name}
            to={categoryHref(name, basePath)}
            className={itemClass(isActive)}
            aria-current={isActive ? 'true' : undefined}
          >
            {showIcon && <CategoryIcon title={name} size={15} />}
            <span>{name}</span>
            {count > 0 && (
              <span className={`text-[11px] font-bold ${isActive ? 'text-white/80' : 'text-gray-400 dark:text-gray-500'}`}>
                {count}
              </span>
            )}
          </Link>
        );
      })}
      {overLimit && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className={`${itemClass(false)} border-dashed text-[#75d04b] border-[#75d04b]/50 hover:bg-[#f3ffee] dark:hover:bg-gray-800`}
        >
          {expanded ? 'Show less' : `More (+${hiddenCount})`}
        </button>
      )}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Variant: grid (Categories page)                                    */
/* ------------------------------------------------------------------ */

function Grid({ categories, basePath, counts, showIcon = true, selected }) {
  const [searchParams] = useSearchParams();
  const active = selected ?? searchParams.get('category') ?? '';

  return (
    <div className="flex flex-wrap gap-2 md:gap-3">
      {categories.map((cat) => {
        const name = titleOf(cat);
        if (!name) return null;
        const count = countOf(cat, counts);
        const isActive = active?.toLowerCase() === name.toLowerCase();
        return (
          <Link
            key={cat._id || name}
            to={categoryHref(name, basePath)}
            aria-current={isActive ? 'page' : undefined}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
              isActive
                ? 'bg-[#f3ffee] dark:bg-[#75d04b]/15 border-[#75d04b]/40 text-[#75d04b]'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#75d04b] hover:text-[#75d04b] hover:bg-[#f3ffee]'
            }`}
          >
            {showIcon && <CategoryIcon title={name} size={18} />}
            <span>{name}</span>
            {count > 0 && (
              <span className="text-[11px] text-gray-400 dark:text-gray-500">({count})</span>
            )}
          </Link>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main export                                                        */
/* ------------------------------------------------------------------ */

function CategoryNav({
  variant = 'rail',
  categories = [],
  loading = false,
  error = null,
  basePath,
  allLabel,
  counts,
  showIcon = true,
  selected,
  limit = 12,
}) {
  if (loading) return variant === 'grid' ? skeletonGrid() : skeletonRail();
  if (error || categories.length === 0) return null;

  const props = { categories, basePath, allLabel, counts, showIcon, selected, limit };

  if (variant === 'grid') return <Grid {...props} />;
  return <Rail {...props} />;
}

export default CategoryNav;
