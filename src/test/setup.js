import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

/**
 * Global Vitest Test Environment Setup
 *
 * Mocks heavy browser-only APIs and canvas/chart libraries to eliminate
 * JSDOM rendering hangs and ensure deterministic execution across parallel workers.
 */

if (typeof window !== 'undefined') {
  // 1. Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // 2. Mock window.scrollTo
  window.scrollTo = vi.fn();

  // 3. Mock ResizeObserver and IntersectionObserver
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  global.IntersectionObserver = class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  // 4. Mock HTMLCanvasElement 2D context for charts & data visualizations
  if (window.HTMLCanvasElement) {
    window.HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      getImageData: vi.fn().mockReturnValue({ data: new Array(4) }),
      putImageData: vi.fn(),
      createImageData: vi.fn().mockReturnValue([]),
      setTransform: vi.fn(),
      drawImage: vi.fn(),
      save: vi.fn(),
      fillText: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      stroke: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
      rotate: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      measureText: vi.fn().mockReturnValue({ width: 0 }),
      transform: vi.fn(),
      rect: vi.fn(),
      clip: vi.fn(),
    });
  }
}

// 5. Mock Chart.js to prevent JSDOM execution hangs
vi.mock('chart.js', () => {
  const ChartMock = vi.fn().mockImplementation(() => ({
    destroy: vi.fn(),
    update: vi.fn(),
    render: vi.fn(),
    data: {},
    options: {},
  }));
  ChartMock.register = vi.fn();
  ChartMock.getChart = vi.fn().mockReturnValue(null);
  return {
    Chart: ChartMock,
    default: ChartMock,
    CategoryScale: vi.fn(),
    LinearScale: vi.fn(),
    PointElement: vi.fn(),
    LineElement: vi.fn(),
    BarElement: vi.fn(),
    ArcElement: vi.fn(),
    Title: vi.fn(),
    Tooltip: vi.fn(),
    Legend: vi.fn(),
    Filler: vi.fn(),
    LineController: vi.fn(),
    BarController: vi.fn(),
    DoughnutController: vi.fn(),
  };
});

// 6. Mock react-chartjs-2
vi.mock('react-chartjs-2', () => ({
  Bar: () => React.createElement('div', { 'data-testid': 'mock-chart-bar' }),
  Line: () => React.createElement('div', { 'data-testid': 'mock-chart-line' }),
  Doughnut: () => React.createElement('div', { 'data-testid': 'mock-chart-doughnut' }),
  Pie: () => React.createElement('div', { 'data-testid': 'mock-chart-pie' }),
}));
