import { describe, it, expect } from 'vitest';
import { getSafeRedirect, resolvePostLoginRedirect } from '../redirect';

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

describe('resolvePostLoginRedirect utility', () => {
  it('redirects provider to fallback /provider if target was a public/marketing page', () => {
    expect(resolvePostLoginRedirect('/delivery-center', '/provider', 'PROVIDER')).toBe('/provider');
    expect(resolvePostLoginRedirect('/', '/provider', 'PROVIDER')).toBe('/provider');
    expect(resolvePostLoginRedirect(null, '/provider', 'PROVIDER')).toBe('/provider');
  });

  it('preserves provider deep link if target is an internal provider route', () => {
    expect(resolvePostLoginRedirect('/provider/deliveries', '/provider', 'PROVIDER')).toBe('/provider/deliveries');
    expect(resolvePostLoginRedirect('/provider/batches', '/provider', 'PROVIDER')).toBe('/provider/batches');
  });

  it('redirects seller to fallback /business if target was a public/marketing page', () => {
    expect(resolvePostLoginRedirect('/seller-center', '/business', 'SELLER')).toBe('/business');
    expect(resolvePostLoginRedirect('/', '/business', 'SELLER')).toBe('/business');
  });

  it('preserves seller deep link if target is an internal business route', () => {
    expect(resolvePostLoginRedirect('/business/orders', '/business', 'SELLER')).toBe('/business/orders');
  });

  it('redirects buyer from public landing pages to fallback /products', () => {
    expect(resolvePostLoginRedirect('/', '/products', 'BUYER')).toBe('/products');
    expect(resolvePostLoginRedirect('/delivery-center', '/products', 'BUYER')).toBe('/products');
  });

  it('preserves buyer checkout and protected pages', () => {
    expect(resolvePostLoginRedirect('/checkout', '/products', 'BUYER')).toBe('/checkout');
    expect(resolvePostLoginRedirect('/my-dashboard/orders', '/products', 'BUYER')).toBe('/my-dashboard/orders');
  });
});
