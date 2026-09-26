import catalogService from '@/services/catalog.service';

/**
 * Event Service — time-based activities/occasions.
 *
 * Events are an INDEPENDENT feature with their own data model, service, pages
 * and business logic (see docs/ARCHITECTURE.md § Events). Events live on the
 * gateway's `/event/*` routes; this module is the single place the frontend
 * talks to them, so `eventThunks`/`publicContentService` never call the catalog
 * service directly.
 */
export const eventService = {
  /** All platform events (used by the events feature + business events page). */
  async getAll() {
    return catalogService.getEvents();
  },

  /** Only events the backend marks as publicly visible. */
  async getPublic() {
    const events = await this.getAll();
    return (events || []).filter((event) => event.showOnPublic !== false);
  },

  /** Featured events for the public homepage (admin curated). */
  async getFeatured(limit = 3) {
    const events = await this.getPublic();
    return events
      .filter((event) => event.featured === true)
      .sort((a, b) => (a.displayPriority || 0) - (b.displayPriority || 0))
      .slice(0, limit);
  },
};

export default eventService;