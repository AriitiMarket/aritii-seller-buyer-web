import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import DELIVERY_NAV_ITEMS from './deliveryNavConfig';

const here = path.dirname(fileURLToPath(import.meta.url));

/**
 * The routes the provider workspace actually declares.
 *
 * Read from the route file rather than kept as a hand-written snapshot: a
 * snapshot silently goes stale the moment a page is added, and then the test
 * fails on a route that plainly exists (or, worse, passes while the nav
 * points at a route that does not).
 */
function readProviderRoutes() {
  const source = readFileSync(path.join(here, '../../../app/routes/ProviderRoutes.jsx'), 'utf8');
  const paths = new Set();
  for (const match of source.matchAll(/path="([^"]*)"/g)) {
    const route = match[1];
    if (!route || route.includes(':')) continue;
    paths.add(route.startsWith('/') ? route : `/provider/${route}`);
  }
  return paths;
}

describe('deliveryNavConfig', () => {
  it('exports a non-empty array of nav items', () => {
    expect(Array.isArray(DELIVERY_NAV_ITEMS)).toBe(true);
    expect(DELIVERY_NAV_ITEMS.length).toBeGreaterThan(0);
  });

  it('includes expected delivery sections and routes', () => {
    const labels = DELIVERY_NAV_ITEMS
      .filter((item) => item.label)
      .map((item) => item.label);
    expect(labels).toContain('Overview');
    expect(labels).toContain('Delivery Assignments');
    expect(labels).toContain('My Deliveries');
    expect(labels).toContain('Batches');
    expect(labels).toContain('Operating Area');
    expect(labels).toContain('Profile & Settings');
    expect(labels).toContain('Warnings & Support');
  });

  it('has a logout item at the end', () => {
    const last = DELIVERY_NAV_ITEMS[DELIVERY_NAV_ITEMS.length - 1];
    expect(last.type).toBe('logout');
  });

  it('every link item has a label, to, and icon', () => {
    DELIVERY_NAV_ITEMS.forEach((item) => {
      if (item.label) {
        expect(typeof item.label).toBe('string');
        expect(typeof item.to).toBe('string');
        expect(item.to.startsWith('/provider')).toBe(true);
        expect(typeof item.icon).toBe('string');
      }
    });
  });

  it('every route exists in ProviderRoutes', () => {
    const routePaths = readProviderRoutes();
    expect(routePaths.size).toBeGreaterThan(0);
    DELIVERY_NAV_ITEMS.forEach((item) => {
      if (item.to) {
        expect(routePaths).toContain(item.to);
      }
    });
  });
});
