import React from 'react';
import { CATEGORY_IMAGES } from '@/assets';
import {
  MdOutlineCategory,
  MdOutlineStorefront,
  MdOutlineRestaurant,
  MdOutlineHandyman,
  MdOutlineFactory,
  MdOutlineAgriculture,
  MdOutlineDevices,
} from 'react-icons/md';

/**
 * Business (shop) categories have no artwork of their own, so each of the
 * seeded ones gets an icon that reads at a glance in the sidebar / rails.
 */
const BUSINESS_ICONS = {
  Retail: MdOutlineStorefront,
  'Food & Beverage': MdOutlineRestaurant,
  Services: MdOutlineHandyman,
  Manufacturing: MdOutlineFactory,
  Agriculture: MdOutlineAgriculture,
  Technology: MdOutlineDevices,
};

/** The react-icons glyph for a category title (fallback: generic category). */
export function getCategoryGlyph(title) {
  return BUSINESS_ICONS[title] || MdOutlineCategory;
}

/**
 * CategoryIcon — one icon for a category everywhere in the app.
 *
 * Product categories use the existing SVG artwork (assets/images/categories);
 * business categories use a mapped glyph; anything unknown falls back to a
 * generic category icon so no tile ever renders as a bare box.
 */
const CategoryIcon = ({ title = '', size = 16, className = '' }) => {
  const artwork = CATEGORY_IMAGES[title];

  if (artwork) {
    return (
      <img
        src={artwork}
        alt=""
        aria-hidden="true"
        width={size}
        height={size}
        className={`object-contain shrink-0 ${className}`}
      />
    );
  }

  const Glyph = getCategoryGlyph(title);
  return <Glyph size={size} className={`shrink-0 ${className}`} aria-hidden="true" />;
};

export default CategoryIcon;
