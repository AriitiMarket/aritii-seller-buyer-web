import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineSearch, AiOutlineTags } from 'react-icons/ai';
import { useSelector, shallowEqual } from 'react-redux';

/**
 * HeaderSearch — shared search form with autocomplete suggestions.
 *
 * Variants:
 * - "inline":  always visible (marketplace, buyer desktop)
 * - "collapsible": icon toggle that opens a popup (public headers)
 *
 * Provides real-time search suggestions from product catalog.
 * Each header passes its own destination function.
 */
export default function HeaderSearch({
  variant = 'inline',
  destination,
  placeholder = 'Search...',
  ariaLabel = 'Search',
  className = '',
  categories = [],          // [{ title, productCount }] for department dropdown
  selectedCategory = '',    // currently active category
  onCategoryChange,         // (category) => void
  locations = [],           // [{ _id, name }] delivery zones for location filter
  selectedLocationId = '',  // currently selected location id
  onLocationChange,         // (locationId) => void
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Get product catalog from Redux for search suggestions.
  // Use shallowEqual to prevent new reference on every render
  const allProducts = useSelector((state) => state.products?.allProducts, shallowEqual);
  const reduxCategories = useSelector((state) => state.shop?.categoriesByType?.product, shallowEqual);

  // Generate suggestions from products and categories
  const availableSuggestions = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();
    const suggestions = [];

    // Add matching product names (limit to 5)
    const productMatches = (allProducts ?? [])
      .filter(p => {
        const name = String(p.name || p.title || '').toLowerCase();
        return name.includes(q);
      })
      .slice(0, 5)
      .map(p => ({
        type: 'product',
        label: p.name || p.title,
        value: p.name || p.title,
        id: p._id,
      }));
    suggestions.push(...productMatches);

    // Add matching categories (limit to 3)
    const categoryMatches = (reduxCategories ?? [])
      .filter(c => {
        const name = String(c.name || c.category || '').toLowerCase();
        return name.includes(q);
      })
      .slice(0, 3)
      .map(c => ({
        type: 'category',
        label: c.name || c.category,
        value: c.name || c.category,
        id: c._id,
      }));
    suggestions.push(...categoryMatches);

    return suggestions.slice(0, 8); // Max 8 suggestions total
  }, [query, allProducts, reduxCategories]);

  // Use availableSuggestions directly instead of syncing to state to avoid infinite loop
  const suggestions = availableSuggestions;

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleSubmit = (e, suggestion = null) => {
    e.preventDefault();
    const term = suggestion?.value || query.trim();
    if (!term) return;
    navigate(destination ? destination(term) : `/products?search=${encodeURIComponent(term)}`);
    setQuery('');
    setOpen(false);
  };

  const handleSuggestionClick = (suggestion) => {
    const term = suggestion.value;
    navigate(
      suggestion.type === 'category'
        ? `/products?category=${encodeURIComponent(term)}`
        : destination
        ? destination(term)
        : `/products?search=${encodeURIComponent(term)}`
    );
    setQuery('');
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!suggestions.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(i => i < suggestions.length - 1 ? i + 1 : 0);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(i => i > 0 ? i - 1 : suggestions.length - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSuggestionClick(suggestions[highlightedIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setQuery('');
        setHighlightedIndex(-1);
        break;
      default:
        break;
    }
  };

  if (variant === 'collapsible') {
    return (
      <div className={`relative flex items-center ${className}`} ref={containerRef}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75d04b]"
          aria-label={ariaLabel}
          aria-expanded={open}
        >
          <AiOutlineSearch size={20} />
        </button>
        {open && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg p-2 z-50">
            <form onSubmit={handleSubmit} className="flex gap-2" role="search">
              <input
                ref={inputRef}
                type="search"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setOpen(true)}
                className="flex-1 px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-[#75d04b]"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-[#75d04b] text-white text-sm font-medium rounded-md hover:bg-[#5ac12f] transition-colors"
              >
                Go
              </button>
            </form>
            {suggestions.length > 0 && (
              <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.type}-${suggestion.id}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center gap-2 ${
                      highlightedIndex === index
                        ? 'bg-[#75d04b]/10 text-[#5ac12f]'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {suggestion.type === 'category' ? (
                      <AiOutlineTags size={16} />
                    ) : (
                      <AiOutlineSearch size={16} />
                    )}
                    <span className="truncate">{suggestion.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative flex items-center h-10 w-full rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#e77600] border border-[#232f3e] focus-within:border-transparent transition-all shadow-sm" role="search">
        {categories.length > 0 && (
          <div className="relative flex-shrink-0 h-full border-r border-[#37475a] bg-[#232f3e] hover:bg-[#37475a] transition-colors flex items-center">
            <select
              value={selectedCategory ?? ''}
              onChange={(e) => onCategoryChange?.(e.target.value)}
              className="h-full bg-transparent text-xs font-medium cursor-pointer pl-3 pr-7 appearance-none text-gray-200 focus:outline-none"
              aria-label="Search in department"
            >
              <option value="" className="bg-[#131921] text-white">All</option>
              {categories.map((cat) => (
                <option key={cat._id || cat.title} value={cat.title} className="bg-[#131921] text-white">
                  {cat.title}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]">▼</span>
          </div>
        )}
        {locations.length > 0 && (
          <div className="relative flex-shrink-0 h-full border-r border-[#37475a] bg-[#232f3e] hover:bg-[#37475a] transition-colors flex items-center">
            <select
              value={selectedLocationId ?? ''}
              onChange={(e) => onLocationChange?.(e.target.value)}
              className="h-full bg-transparent text-xs font-medium cursor-pointer pl-3 pr-7 appearance-none text-gray-200 focus:outline-none"
              aria-label="Deliver to location"
            >
              <option value="" className="bg-[#131921] text-white">All locations</option>
              {locations.map((loc) => (
                <option key={loc._id || loc.id} value={loc._id || loc.id} className="bg-[#131921] text-white">
                  {loc.name || loc.title}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]">▼</span>
          </div>
        )}
        <input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          className={`flex-1 h-full px-4 text-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none w-full min-w-0`}
          aria-label={ariaLabel}
        />
        <button
          type="submit"
          aria-label="Search"
          className="h-full px-4 bg-[#febd69] hover:bg-[#f3a847] text-[#131921] flex items-center justify-center transition-colors flex-shrink-0 font-bold"
        >
          <AiOutlineSearch size={19} className="stroke-[1.5]" />
        </button>
      </form>

      {/* Inline suggestions dropdown */}
      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#1f1f1f] border border-[#232f3e] rounded-lg shadow-lg z-50 overflow-hidden">
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.type}-${suggestion.id}`}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full text-left px-4 py-3 text-sm border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors flex items-center gap-3 ${
                highlightedIndex === index
                  ? 'bg-[#75d04b]/10 text-[#5ac12f] font-medium'
                  : 'text-white hover:bg-[#232f3e]'
              }`}
            >
              {suggestion.type === 'category' ? (
                <AiOutlineTags size={16} className="flex-shrink-0" />
              ) : (
                <AiOutlineSearch size={16} className="flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="truncate">{suggestion.label}</p>
                <p className="text-xs text-gray-500">{suggestion.type === 'category' ? 'Category' : 'Product'}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
