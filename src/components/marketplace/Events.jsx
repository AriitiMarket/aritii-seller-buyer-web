import React from 'react'
import EventCard from './EventCard'
import { useSelector } from 'react-redux'

/**
 * Events Component - Showcase marketplace events
 * Features:
 * - Shows most popular/sold event
 * - Event card with details
 * - Responsive layout
 */
const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);

  const mostSoldEvent =
    allEvents && allEvents.length !== 0
      ? allEvents.reduce((best, current) =>
          (current.sold_out || 0) > (best.sold_out || 0) ? current : best
        )
      : null;

  return (
    <div className="w-full">
      {!isLoading && allEvents && allEvents.length !== 0 && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          {/* Section Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
              </svg>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                Popular Event
              </h2>
            </div>
            <p className="text-gray-600 text-sm md:text-base">
              Don't miss out on our most popular marketplace event
            </p>
          </div>

          {/* Event Card */}
          <div className="w-full">
            <EventCard data={mostSoldEvent} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Events