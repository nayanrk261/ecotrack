import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock matchMedia if any component uses it (e.g. for responsive charts)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock react-chartjs-2 to prevent loading full Chart.js and drawing on HTML5 Canvas in tests
vi.mock('react-chartjs-2', () => {
  return {
    Doughnut: ({ data, options }: { data: unknown; options?: unknown }) =>
      React.createElement('div', {
        'data-testid': 'mock-doughnut',
        'data-data': JSON.stringify(data),
        'data-options': JSON.stringify(options),
      }, 'Mock Doughnut Chart'),
    Line: ({ data, options }: { data: unknown; options?: unknown }) =>
      React.createElement('div', {
        'data-testid': 'mock-line',
        'data-data': JSON.stringify(data),
        'data-options': JSON.stringify(options),
      }, 'Mock Line Chart'),
    Bar: ({ data, options }: { data: unknown; options?: unknown }) =>
      React.createElement('div', {
        'data-testid': 'mock-bar',
        'data-data': JSON.stringify(data),
        'data-options': JSON.stringify(options),
      }, 'Mock Bar Chart'),
  };
});


// Mock canvas-confetti since it relies on HTML5 Canvas APIs
vi.mock('canvas-confetti', () => ({
  default: vi.fn().mockImplementation(() => Promise.resolve()),
}));
