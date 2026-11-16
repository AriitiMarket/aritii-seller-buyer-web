import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { BaseLayout } from '@/components/layout/BaseLayout';

const CrashingWidget = ({ errorMessage = 'Widget crashed!' }) => {
  throw new Error(errorMessage);
};

describe('Portal-Level Error Boundary Resilience', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('catches crashes within a portal container and renders portal-specific recovery UI', () => {
    render(
      <ErrorBoundary portalName="Seller Central">
        <CrashingWidget errorMessage="Order table render failed" />
      </ErrorBoundary>
    );

    const boundary = screen.getByTestId('portal-error-boundary');
    expect(boundary).toBeInTheDocument();
    expect(boundary).toHaveAttribute('data-portal', 'Seller Central');

    expect(screen.getByText('Seller Central Encountered an Error')).toBeInTheDocument();
    expect(
      screen.getByText(/An unexpected error occurred in Seller Central\./)
    ).toBeInTheDocument();

    const reloadBtn = screen.getByRole('button', { name: /Reload Seller Central/i });
    expect(reloadBtn).toBeInTheDocument();

    const homeLink = screen.getByRole('link', { name: /Return to Marketplace/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('renders Buyer Portal error heading when portalName is Buyer Portal', () => {
    render(
      <ErrorBoundary portalName="Buyer Portal">
        <CrashingWidget errorMessage="Cart calculation failure" />
      </ErrorBoundary>
    );

    expect(screen.getByText('Buyer Portal Encountered an Error')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Buyer Portal/i })).toBeInTheDocument();
  });

  it('calls onReset callback when the user clicks the reload button', () => {
    const onResetMock = vi.fn();

    render(
      <ErrorBoundary portalName="Delivery Center" onReset={onResetMock}>
        <CrashingWidget errorMessage="Batch assignment failure" />
      </ErrorBoundary>
    );

    const reloadBtn = screen.getByRole('button', { name: /Reload Delivery Center/i });
    fireEvent.click(reloadBtn);

    expect(onResetMock).toHaveBeenCalledTimes(1);
  });

  it('calls onError callback when a child crashes', () => {
    const onErrorMock = vi.fn();

    render(
      <ErrorBoundary portalName="Marketplace" onError={onErrorMock}>
        <CrashingWidget errorMessage="Carousel image error" />
      </ErrorBoundary>
    );

    expect(onErrorMock).toHaveBeenCalledTimes(1);
    expect(onErrorMock).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Carousel image error' }),
      expect.any(Object)
    );
  });

  it('renders custom fallback when provided', () => {
    const customFallback = ({ error }) => (
      <div data-testid="custom-fallback">Custom error: {error.message}</div>
    );

    render(
      <ErrorBoundary fallback={customFallback}>
        <CrashingWidget errorMessage="Custom failure message" />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
    expect(screen.getByText('Custom error: Custom failure message')).toBeInTheDocument();
  });

  it('isolates portal crash so neighboring components remain mounted and unaffected', () => {
    render(
      <div>
        <div data-testid="neighboring-sidebar">Persistent Navigation Sidebar</div>
        <BaseLayout portalName="Seller Central" withErrorBoundary={true}>
          <CrashingWidget errorMessage="Seller dashboard widget failed" />
        </BaseLayout>
      </div>
    );

    // The neighboring sidebar outside the boundary is still alive
    expect(screen.getByTestId('neighboring-sidebar')).toBeInTheDocument();

    // The portal boundary caught the error safely inside the layout
    expect(screen.getByText('Seller Central Encountered an Error')).toBeInTheDocument();
  });
});
