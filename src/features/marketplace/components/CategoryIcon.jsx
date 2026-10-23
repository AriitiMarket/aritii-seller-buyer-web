import React from 'react';
import {
  MdDevices,
  MdCheckroom,
  MdLocalGroceryStore,
  MdHome,
  MdColorLens,
  MdSpa,
  MdMenuBook,
  MdDirectionsCar,
  MdSportsSoccer,
  MdCategory,
} from 'react-icons/md';

/**
 * CategoryIcon - Smart, branded icon component for marketplace categories.
 * Maps category title keywords to modern vector icons, with a clean fallback.
 */
const ICON_MAP = [
  { keywords: ['electron', 'phone', 'computer', 'tech', 'gadget', 'digital', 'device'], icon: MdDevices, color: '#00A8E1', bg: 'rgba(0, 168, 225, 0.15)' },
  { keywords: ['fashion', 'apparel', 'cloth', 'wear', 'shoe', 'dress', 'shirt'], icon: MdCheckroom, color: '#E91E63', bg: 'rgba(233, 30, 99, 0.15)' },
  { keywords: ['grocer', 'food', 'market', 'coffee', 'spice', 'fruit', 'vegetable', 'agri'], icon: MdLocalGroceryStore, color: '#75d04b', bg: 'rgba(117, 208, 75, 0.15)' },
  { keywords: ['home', 'living', 'furniture', 'kitchen', 'decor', 'bed'], icon: MdHome, color: '#FF9900', bg: 'rgba(255, 153, 0, 0.15)' },
  { keywords: ['handcraft', 'art', 'traditional', 'craft', 'cultural', 'souvenir', 'handmade'], icon: MdColorLens, color: '#9C27B0', bg: 'rgba(156, 39, 176, 0.15)' },
  { keywords: ['beauty', 'cosmetic', 'wellness', 'health', 'skin', 'perfume', 'hair'], icon: MdSpa, color: '#00BCD4', bg: 'rgba(0, 188, 212, 0.15)' },
  { keywords: ['book', 'stationery', 'office', 'school'], icon: MdMenuBook, color: '#795548', bg: 'rgba(121, 85, 72, 0.15)' },
  { keywords: ['auto', 'car', 'motor', 'vehicle'], icon: MdDirectionsCar, color: '#607D8B', bg: 'rgba(96, 125, 139, 0.15)' },
  { keywords: ['sport', 'fitness', 'outdoor', 'gym'], icon: MdSportsSoccer, color: '#4CAF50', bg: 'rgba(76, 175, 80, 0.15)' },
];

const CategoryIcon = ({ title = '', size = 20, className = '' }) => {
  const needle = String(title || '').toLowerCase().trim();
  const matched = ICON_MAP.find((m) => m.keywords.some((k) => needle.includes(k)));

  const IconComponent = matched ? matched.icon : MdCategory;
  const iconColor = matched ? matched.color : '#febd69';
  const iconBg = matched ? matched.bg : 'rgba(254, 189, 105, 0.15)';

  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg flex-shrink-0 transition-transform ${className}`}
      style={{
        width: `${size + 10}px`,
        height: `${size + 10}px`,
        backgroundColor: iconBg,
        color: iconColor,
      }}
      aria-hidden="true"
    >
      <IconComponent size={size} />
    </span>
  );
};

export default CategoryIcon;
