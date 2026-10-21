import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEvents } from '@/store/slices/eventThunks';
import { PublicLayout } from '@/public/layout/PublicLayout';
import { EXPERIENCES } from '@/public/experiences';
import ExperiencePageHeader from '@/public/components/ExperiencePageHeader';
import { EventsSection } from '@/public/platform/components/EventsSection';
import { MarketplaceCTA } from '@/public/platform/components/MarketplaceCTA';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';

/**
 * Events page (/events) — platform events & activities. Standard
 * ExperiencePageHeader keeps the page consistent with the rest of the public
 * experiences.
 */
const EventsPage = () => {
  const dispatch = useDispatch();
  const { allEvents, isLoading } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  return (
    <PublicLayout>
      <ExperiencePageHeader
        experience={EXPERIENCES.marketplace}
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Events' }]}
        badge="Events & Activities"
        title="Events on Aritii Market"
        description="Seasonal campaigns, shop events and special offers from sellers across the platform."
        size="sm"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {isLoading ? (
          <Loading variant="inline" label="Loading events…" />
        ) : allEvents && allEvents.length > 0 ? (
          <EventsSection events={allEvents} limit={allEvents.length} />
        ) : (
          <EmptyState
            title="No events right now"
            description="Seller events and campaigns will appear here — check back soon."
          />
        )}
      </div>

      <MarketplaceCTA />
    </PublicLayout>
  );
};

export default EventsPage;
