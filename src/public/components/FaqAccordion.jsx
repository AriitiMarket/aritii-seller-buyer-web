import React, { useState } from 'react';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';

/**
 * FaqAccordion — the shared FAQ accordion used by the help center and by the
 * delivery portal landing page.
 *
 * The two pages used to carry their own accordion with different behaviour:
 * the help center opened one item at a time and exposed `aria-expanded` /
 * `aria-controls`, while the delivery page used a native `<details>` element
 * that opened every item at once and exposed no state to assistive tech.
 * One implementation, one behaviour.
 */
const FaqAccordion = ({ items = [], idPrefix = 'faq' }) => {
  const [openIndex, setOpenIndex] = useState(-1);

  const toggle = (index) => {
    setOpenIndex((current) => (current === index ? -1 : index));
  };

  if (!items.length) return null;

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className={`bg-white dark:bg-gray-900 rounded-2xl border transition-colors ${
              isOpen
                ? 'border-[#75d04b] shadow-sm'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <button
              className="flex items-center justify-between gap-4 w-full text-left px-5 md:px-6 py-4 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75d04b]"
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
              aria-controls={`${idPrefix}-panel-${index}`}
            >
              <span className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                {item.question}
              </span>
              <span
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isOpen ? 'bg-[#75d04b] text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300'
                }`}
                aria-hidden="true"
              >
                {isOpen ? <AiOutlineMinus size={16} /> : <AiOutlinePlus size={16} />}
              </span>
            </button>
            {isOpen && (
              <div id={`${idPrefix}-panel-${index}`} className="px-5 md:px-6 pb-5">
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-4">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export { FaqAccordion };
export default FaqAccordion;
