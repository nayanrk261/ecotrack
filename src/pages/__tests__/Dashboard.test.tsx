import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';
import { LanguageProvider } from '../../context/LanguageContext';

const mockUseCarbon = vi.fn();

vi.mock('../../hooks/useCarbon', () => ({
  useCarbon: () => mockUseCarbon(),
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
  }),
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <LanguageProvider>
          <Dashboard />
        </LanguageProvider>
      </BrowserRouter>
    );
  };

  it('renders empty state when there is no carbon footprint data', () => {
    mockUseCarbon.mockReturnValue({
      footprints: [],
      latest: null,
      clearHistory: vi.fn(),
    });

    renderComponent();

    expect(screen.getByText('No Data Yet')).toBeInTheDocument();
    expect(screen.getByText(/Calculate your carbon footprint first/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Calculate Your Footprint/i })).toBeInTheDocument();

    // Data panels should NOT appear in empty state
    expect(screen.queryByText('Data Settings')).not.toBeInTheDocument();
    expect(screen.queryByText('Recent History')).not.toBeInTheDocument();
  });

  it('renders empty state when localStorage is empty (first-time visitor)', () => {
    // Simulate a pristine browser with no stored data at all
    localStorage.clear();
    mockUseCarbon.mockReturnValue({
      footprints: [],
      latest: null,
      clearHistory: vi.fn(),
    });

    renderComponent();

    // Should gracefully show the empty / onboarding prompt
    expect(screen.getByText('No Data Yet')).toBeInTheDocument();
    // CTA link navigates to calculator
    const calcLink = screen.getByRole('link', { name: /Calculate Your Footprint/i });
    expect(calcLink).toBeInTheDocument();
    expect(calcLink).toHaveAttribute('href', '/calculator');
  });

  it('renders calculation stats, charts, history, and leaderboard when data is present', async () => {
    const mockFootprintEntry = {
      id: '1',
      date: '2026-06-20T00:00:00.000Z',
      formData: {
        transport: { commuteMode: 'car', dailyDistance: 10, shortHaulFlights: 0, longHaulFlights: 0 },
        energy: { monthlyElectricity: 150, cookingFuel: 'lpg', householdSize: 4 },
        diet: { dietType: 'vegetarian', monthlyOnlineOrders: 5, newClothesPerMonth: 2 },
      },
      result: {
        totalMonthly: 250,
        totalAnnual: 3.0,
        breakdown: { transport: 100, energy: 80, diet: 50, lifestyle: 20 },
        score: 'Green Learner',
      },
    };

    mockUseCarbon.mockReturnValue({
      footprints: [
        mockFootprintEntry,
        { ...mockFootprintEntry, id: '2', date: '2026-06-19T00:00:00.000Z' },
      ],
      latest: mockFootprintEntry,
      clearHistory: vi.fn(),
    });

    renderComponent();

    // Verify main header
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getAllByText('Green Learner').length).toBeGreaterThanOrEqual(1);

    // Verify stats cards
    expect(screen.getAllByText('250.0').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('3.00').length).toBeGreaterThanOrEqual(1);

    // DashboardCharts is lazy-loaded: wait for Suspense to resolve before
    // asserting the chart mock elements are present in the DOM.
    expect(await screen.findByTestId('mock-line')).toBeInTheDocument();
    expect(await screen.findByTestId('mock-doughnut')).toBeInTheDocument();

    // Verify recent history table
    await waitFor(() =>
      expect(screen.getByText('Recent History')).toBeInTheDocument()
    );

    // Verify friends leaderboard
    expect(screen.getByText('Compare with Friends')).toBeInTheDocument();
    expect(screen.getByText('Aditya Sharma')).toBeInTheDocument();
    expect(screen.getByText('Priya Patel')).toBeInTheDocument();
    expect(screen.getByText('You (You)')).toBeInTheDocument();

    // Verify settings card
    expect(screen.getByText('Data Settings')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Clear My Data/i })).toBeInTheDocument();
  });

  it('triggers confirmation dialog when clicking Clear My Data', () => {
    const clearHistorySpy = vi.fn().mockImplementation(() => {
      localStorage.removeItem('ecotrack_footprints');
      localStorage.removeItem('ecotrack_completed_actions');
    });

    mockUseCarbon.mockReturnValue({
      footprints: [
        {
          id: '1',
          date: '2026-06-20T00:00:00.000Z',
          result: {
            totalMonthly: 250,
            totalAnnual: 3.0,
            breakdown: { transport: 100, energy: 80, diet: 50, lifestyle: 20 },
            score: 'Green Learner',
          },
        },
      ],
      latest: {
        id: '1',
        date: '2026-06-20T00:00:00.000Z',
        result: {
          totalMonthly: 250,
          totalAnnual: 3.0,
          breakdown: { transport: 100, energy: 80, diet: 50, lifestyle: 20 },
          score: 'Green Learner',
        },
      },
      clearHistory: clearHistorySpy,
    });

    const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => true);
    const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');

    renderComponent();

    const clearBtn = screen.getByRole('button', { name: /Clear My Data/i });
    fireEvent.click(clearBtn);

    expect(confirmSpy).toHaveBeenCalled();
    expect(removeItemSpy).toHaveBeenCalled();
  });
});
