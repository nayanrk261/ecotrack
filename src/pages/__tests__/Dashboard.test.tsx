import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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
    });

    renderComponent();

    expect(screen.getByText('No Data Yet')).toBeInTheDocument();
    expect(screen.getByText(/Calculate your carbon footprint first/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Calculate Your Footprint/i })).toBeInTheDocument();
  });

  it('renders calculation stats, charts, history, and leaderboard when data is present', () => {
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
    });

    renderComponent();

    // Verify main header
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Green Learner')).toBeInTheDocument();

    // Verify stats cards
    expect(screen.getAllByText('250.0').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('3.00').length).toBeGreaterThanOrEqual(1);

    // Verify charts are rendered (as mocks)
    expect(screen.getByTestId('mock-line')).toBeInTheDocument();
    expect(screen.getByTestId('mock-doughnut')).toBeInTheDocument();

    // Verify recent history table
    expect(screen.getByText('Recent History')).toBeInTheDocument();

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
