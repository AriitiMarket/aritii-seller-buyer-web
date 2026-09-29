import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { publicContentService } from '@/public/services/publicContentService';

/**
 * EventsSection - Upcoming events for the public homepage.
 *
 * Events are an INDEPENDENT feature (own service, own model — see docs/ARCHITECTURE.md).
 * This section only reads the publicly visible, featured events returned by the
 * backend (`showOnPublic` + `featured`). It renders nothing when there are no
 * publicly curated events, so no mock events ever reach production.
 */
const EventsSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    publicContentService
      .getFeaturedEvents(3)
      .then((items) => {
        if (active) setEvents(items);
      })
      .catch(() => {
        if (active) setEvents([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading || events.length === 0) return null;

  return (
    <section className="py-10 md:py-14 bg-[#FDF6EC] dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Upcoming Events</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Discover what is happening on Aritii</p>
          </div>
          <Link
            to="/events"
            className="text-sm font-semibold text-[#75d04b] hover:text-[#5ac12f] flex items-center gap-1 transition-colors"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {events.map((event) => {
            const id = event._id || event.id;
            const banner = event.banner || event.image;
            return (
              <Link key={id} to={`/events?event=${id}`} className="group">
                <div className="h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                  <div className="relative h-40 md:h-48 bg-gray-100 dark:bg-gray-700">
                    {banner ? (
                      <img
                        src={banner}
                        alt={event.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">🎪</div>
                    )}
                    {event.startDate ? (
                      <span className="absolute top-3 left-3 bg-[#75d04b] text-white text-xs font-bold px-2 py-1 rounded">
                        {new Date(event.startDate).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </span>
                    ) : null}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-base md:text-lg text-gray-900 dark:text-white mb-2 group-hover:text-[#75d04b] transition-colors line-clamp-2">
                      {event.name}
                    </h3>
                    {event.location ? (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>📍</span>
                        <span className="truncate">{event.location}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export { EventsSection };
export default EventsSection;
