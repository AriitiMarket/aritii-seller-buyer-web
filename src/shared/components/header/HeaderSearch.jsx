import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';

/**
 * HeaderSearch — shared search form for all headers.
 *
 * Variants:
 * - "inline":  always visible (marketplace, buyer desktop)
 * - "collapsible": icon toggle that opens a popup (public headers)
 *
 * Each header passes its own destination function.
 */
export default function HeaderSearch({
  variant = 'inline',
  destination,
  placeholder = 'Search...',
  ariaLabel = 'Search',
  className = '',
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const term = query.trim();
    if (!term) return;
    navigate(destination ? destination(term) : `/search?q=${encodeURIComponent(term)}`);
    setQuery('');
    setOpen(false);
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
          <form
            onSubmit={handleSubmit}
            className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg p-2 flex gap-2 z-50"
            role="search"
          >
            <input
              ref={inputRef}
              type="search"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-[#75d04b]"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-[#75d04b] text-white text-sm font-medium rounded-md hover:bg-[#5ac12f] transition-colors"
            >
              Go
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`} role="search">
      <input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 pr-12 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full focus:outline-none focus:border-[#75d04b] focus:ring-2 focus:ring-[#75d04b]/25 transition-all duration-200"
        aria-label={ariaLabel}
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 bg-[#75d04b] text-white rounded-full hover:brightness-95 transition-all"
      >
        <AiOutlineSearch size={16} />
      </button>
    </form>
  );
}
