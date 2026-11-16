import React from 'react';

/**
 * StepGrid — The shared "N steps" grid used by public onboarding & how-it-works journeys.
 */
const StepGrid = ({
  steps = [],
  accent = '#0ea5e9',
  columns = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  cardClassName = 'p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xs',
  badgeClassName = 'w-12 h-12 text-white font-black text-lg rounded-full flex items-center justify-center mb-4 shadow-xs',
  badgeTextClassName = 'text-white',
  titleClassName = 'font-bold text-base text-gray-900 dark:text-white mb-2',
  descriptionClassName = 'text-xs text-gray-600 dark:text-gray-400 leading-relaxed',
}) => {
  if (!steps.length) return null;

  return (
    <div className={`grid ${columns} gap-6`}>
      {steps.map((item) => (
        <div key={item.step} className={cardClassName}>
          <div className={badgeClassName} style={{ backgroundColor: accent }}>
            <span className={badgeTextClassName}>{item.step}</span>
          </div>
          <h3 className={titleClassName}>{item.title}</h3>
          <p className={descriptionClassName}>{item.description}</p>
        </div>
      ))}
    </div>
  );
};

export { StepGrid };
export default StepGrid;
