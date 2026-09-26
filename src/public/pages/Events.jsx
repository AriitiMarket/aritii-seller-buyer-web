import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllEvents } from '@/store/slices/eventThunks';
import { PublicLayout } from '@/public/layout/PublicLayout';
import { EventsSection } from '@/public/sections/EventsSection';
import { MarketplaceCTA } from '@/public/sections/MarketplaceCTA';
import { BusinessCTA } from '@/public/sections/BusinessCTA';

const EventsPage = () => {
  const dispatch = useDispatch();
  const { allEvents, isLoading } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Events & Activities</h1>
        <p className="text-slate-600 mb-12">Don't miss our upcoming sales and special offers</p>

        {isLoading ? (
          <div className="text-center py-12">Loading events...</div>
        ) : (
          <>
            <EventsSection />
            <MarketplaceCTA />
            <BusinessCTA />
          </>
        )}
      </div>
    </PublicLayout>
  );
};

export default EventsPage;