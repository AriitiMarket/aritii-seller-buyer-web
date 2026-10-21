import { catalogService } from '@/services/catalog.service';

/**
 * Public Content Service
 * Handles fetching curated/featured content for the public website.
 *
 * TWO RULES, both learned the hard way:
 *
 * 1. The homepage is PUBLIC, so every call here must use a public endpoint -
 *    /product/public/*, /shop/public/*, /category, /event/*. Their
 *    authenticated twins (/product/get-all-products, /shop/get-all-shops)
 *    answer 401 to a guest, which silently emptied the sections.
 *
 * 2. `showOnPublic`, `featured` and `displayPriority` are OPTIONAL curation
 *    fields. No collection defines them yet, so testing `=== true`
 *    unconditionally left every section permanently empty. Documents that DO
 *    carry the flags are still honoured - they win - and when none do the
 *    public listing is shown as-is instead of showing nothing.
 */

/** Featured items first, then explicit display order; capped at `limit`. */
function curate(items, limit) {
  const list = Array.isArray(items) ? items.filter(Boolean) : [];
  const publiclyVisible = list.filter((item) => item.showOnPublic === true);
  const candidates = publiclyVisible.length > 0 ? publiclyVisible : list;

  return [...candidates]
    .sort((a, b) => {
      const featuredDelta =
        Number(b.featured === true) - Number(a.featured === true);
      if (featuredDelta !== 0) return featuredDelta;
      return (a.displayPriority || 0) - (b.displayPriority || 0);
    })
    .slice(0, limit);
}

export const publicContentService = {
  /**
   * Featured events for the public pages.
   * @param {number} limit - Number of events to fetch (default: 3)
   * @returns {Promise<Array>} - Array of event objects
   */
  async getFeaturedEvents(limit = 3) {
    const events = await catalogService.getEvents();
    return curate(events, limit);
  },
};

export default publicContentService;
