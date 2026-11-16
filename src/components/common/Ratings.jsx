import React from 'react';

const sizeMap = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
};

const Ratings = ({ rating = 0, size = 'md' }) => {
  const stars = [];
  const value = Number(rating) || 0;
  const sizeClass = sizeMap[size] || (typeof size === 'number' ? `text-[${size}px]` : 'text-sm');

  for (let i = 1; i <= 5; i++) {
    const isFilled = i <= Math.ceil(value);
    stars.push(
      <span
        key={i}
        className={`${isFilled ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'} mr-0.5 ${sizeClass}`}
        aria-hidden="true"
      >
        ★
      </span>
    );
  }

  return (
    <div className="flex items-center" role="img" aria-label={`Rating ${value} out of 5`}>
      {stars}
    </div>
  );
};

export default Ratings;
