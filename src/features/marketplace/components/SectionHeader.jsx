/**
 * SectionHeader - Header component for marketplace sections
 * Displays section title and description
 */
import React from 'react'

const SectionHeader = ({ title, description }) => {
  return (
    <header className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
      {description && <p className="text-gray-600 dark:text-gray-400">{description}</p>}
    </header>
  )
}

export default SectionHeader