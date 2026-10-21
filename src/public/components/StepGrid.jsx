import React from 'react';

/**
 * StepGrid — the shared "N steps" grid used by every public journey
 * (seller onboarding, delivery onboarding, how-it-works).
 *
 * Six pages used to hand-roll the same card grid, and the seller copy and the
 * delivery copy were near-identical down to the class names. One component
 * keeps the journeys visually identical; only the accent and the copy change.
 */
const StepGrid = ({
  steps = [],
  accent = '#00A8E1',
  columns = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  cardClassName = 'p-6 bg-[#F7F7F7] dark:bg-[#1a222d] border border-gray-200 dark:border-gray-800 rounded-xl',
  badgeClassName = 'w-12 h-12 text-white font-black text-lg rounded-xl flex items-center justify-center mb-4',
  badgeTextClassName = 'text-white',
  titleClassName = 'font-bold text-base text-[#0F1111] dark:text-white mb-2',
  descriptionClassName = 'text-xs text-[#565959] dark:text-gray-400 leading-relaxed',
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
