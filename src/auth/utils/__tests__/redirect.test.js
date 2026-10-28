import { describe, it, expect } from 'vitest';
import { getSafeRedirect } from '../redirect';

describe('getSafeRedirect utility', () => {
  it('allows safe internal relative paths', () => {
    expect(getSafeRedirect('/cart')).toBe('/cart');
    expect(getSafeRedirect('/product/123?variant=4')).toBe('/product/123?variant=4');
    expect(getSafeRedirect('/buyer/orders')).toBe('/buyer/orders');
    expect(getSafeRedirect('/seller-registration')).toBe('/seller-registration');
  });

  it('rejects external URLs and returns fallback', () => {
    expect(getSafeRedirect('https://malicious.com')).toBe('/');
    expect(getSafeRedirect('http://attacker.com/steal')).toBe('/');
    expect(getSafeRedirect('//evil.com/phish')).toBe('/');
    expect(getSafeRedirect('/\\evil.com')).toBe('/');
  });

  it('rejects dangerous protocols', () => {
    expect(getSafeRedirect('javascript:alert(1)')).toBe('/');
    expect(getSafeRedirect('data:text/html,<script>alert(1)</script>')).toBe('/');
  });

  it('rejects login paths to prevent redirect loops', () => {
    expect(getSafeRedirect('/login')).toBe('/');
    expect(getSafeRedirect('/seller-login')).toBe('/');
    expect(getSafeRedirect('/delivery-login')).toBe('/');
  });

  it('handles null, undefined, empty string with fallback', () => {
    expect(getSafeRedirect(null, '/default')).toBe('/default');
    expect(getSafeRedirect(undefined, '/default')).toBe('/default');
    expect(getSafeRedirect('', '/default')).toBe('/default');
    expect(getSafeRedirect('   ', null)).toBe(null);
  });
});
