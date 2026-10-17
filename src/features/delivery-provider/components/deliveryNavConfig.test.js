import { describe, it, expect } from 'vitest';
import DELIVERY_NAV_ITEMS from './deliveryNavConfig';

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

  it('every route exists in ProviderRoutes (path prefix check)', () => {
    const routePaths = [
      '/provider',
      '/provider/available-work',
      '/provider/deliveries',
      '/provider/batches',
      '/provider/operating-area',
      '/provider/profile',
      '/provider/warnings',
    ];
    DELIVERY_NAV_ITEMS.forEach((item) => {
      if (item.to) {
        expect(routePaths).toContain(item.to);
      }
    });
  });
});
