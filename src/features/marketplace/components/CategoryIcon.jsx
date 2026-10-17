import React from 'react';

/**
 * CategoryIcon - Icon component for marketplace categories.
 * Renders an icon based on the category title/name.
 */
const CategoryIcon = ({ title, size }) => {
  const firstLetter = (title || '').charAt(0).toUpperCase();

  const sizePx = `${size}px`;

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ width: sizePx, height: sizePx, borderRadius: '50%', color: 'white', fontSize: `${size * 0.4}px`, fontWeight: 'bold', background: 'linear-gradient(135deg, #75d04b, #5ac12f)' }}
    >
      {firstLetter}
    </div>
  );
};

export default CategoryIcon;