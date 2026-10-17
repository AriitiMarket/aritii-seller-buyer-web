/**
 * HeroSection - Hero section for marketplace pages
 * Displays featured content with a call-to-action
 */
import React from 'react'
import { AiOutlineArrowRight } from 'react-icons/ai'

const HeroSection = ({ title, description, ctaText, ctaLink }) => {
  return (
    <section className="mb-12">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{description}</p>
        <div>
          <a
            href={ctaLink}
            className={`inline-block px-6 py-3 bg-[#75d04b] text-white font-medium rounded-full transition-colors hover:bg-[#5ac12f]`}
          >
            {ctaText} <AiOutlineArrowRight />
          </a>
        </div>
      </div>
    </section>
  )
}

export { HeroSection };
export default HeroSection