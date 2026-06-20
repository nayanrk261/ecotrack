
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Calculator from '../Calculator';

const mockSaveResult = vi.fn();
const mockCalculate = vi.fn().mockReturnValue({
  totalMonthly: 455.3,
  totalAnnual: 5.5,
  breakdown: { transport: 240.5, energy: 117.8, diet: 85.0, lifestyle: 12.0 },
  score: 'Average',
});

vi.mock('../../hooks/useCarbon', () => ({
  useCarbon: () => ({
    calculate: mockCalculate,
    saveResult: mockSaveResult,
    defaultFormData: {
      transport: { commuteMode: 'car', dailyDistance: 10, shortHaulFlights: 0, longHaulFlights: 0 },
      energy: { monthlyElectricity: 150, cookingFuel: 'lpg', householdSize: 4 },
      diet: { dietType: 'vegetarian', monthlyOnlineOrders: 5, newClothesPerMonth: 2 },
    },
  }),
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
  }),
}));

// Mock react-hot-toast to test validation message hooks
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import toast from 'react-hot-toast';
import { LanguageProvider } from '../../context/LanguageContext';

describe('Calculator Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <LanguageProvider>
          <Calculator />
        </LanguageProvider>
      </BrowserRouter>
    );
  };

  it('renders transport step by default and allows navigation', () => {
    renderComponent();

    // Renders step titles and labels
    expect(screen.getByText('Transportation')).toBeInTheDocument();
    expect(screen.getByLabelText(/Daily commute distance/i)).toBeInTheDocument();

    // Next step navigation
    const nextBtn = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextBtn);

    expect(screen.getByText('Home Energy')).toBeInTheDocument();
    expect(screen.getByLabelText(/Monthly electricity consumption/i)).toBeInTheDocument();

    // Back step navigation
    const backBtn = screen.getByRole('button', { name: /Back/i });
    fireEvent.click(backBtn);
    expect(screen.getByText('Transportation')).toBeInTheDocument();
  });

  it('validates flights input (rejects empty strings and negative values)', () => {
    renderComponent();

    const shortFlightsInput = screen.getByLabelText(/Short-haul flights\/year/i) as HTMLInputElement;
    const longFlightsInput = screen.getByLabelText(/Long-haul flights\/year/i) as HTMLInputElement;
    const nextBtn = screen.getByRole('button', { name: /Next/i });

    // 1. Empty validation short-haul
    fireEvent.change(shortFlightsInput, { target: { value: '' } });
    fireEvent.click(nextBtn);
    expect(toast.error).toHaveBeenCalledWith('Short-haul flights cannot be empty. Please enter a value (0 or more).');

    // Restore short-haul, test negative short-haul
    fireEvent.change(shortFlightsInput, { target: { value: '-2' } });
    fireEvent.click(nextBtn);
    expect(toast.error).toHaveBeenCalledWith('Short-haul flights cannot be negative.');

    // 2. Empty validation long-haul
    fireEvent.change(shortFlightsInput, { target: { value: '3' } });
    fireEvent.change(longFlightsInput, { target: { value: '' } });
    fireEvent.click(nextBtn);
    expect(toast.error).toHaveBeenCalledWith('Long-haul flights cannot be empty. Please enter a value (0 or more).');

    // Restore long-haul, test negative long-haul
    fireEvent.change(longFlightsInput, { target: { value: '-5' } });
    fireEvent.click(nextBtn);
    expect(toast.error).toHaveBeenCalledWith('Long-haul flights cannot be negative.');
  });

  it('calculates carbon result on final steps', () => {
    renderComponent();

    // Go past step 1 (Transport)
    const nextBtn = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextBtn);

    // Go past step 2 (Energy)
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Go past step 3 (Diet & Lifestyle)
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Verify Results step calculations are rendered
    expect(screen.getByText('Your Results')).toBeInTheDocument();
    expect(screen.getByText(/455.3/)).toBeInTheDocument(); // totalMonthly
    expect(screen.getByText(/5.50/)).toBeInTheDocument(); // totalAnnual (formatted to 2 decimal places)
    expect(screen.getByText('Average')).toBeInTheDocument(); // score

    // Check saving triggers saveResult
    const saveBtn = screen.getByRole('button', { name: /Save Results/i });
    fireEvent.click(saveBtn);
    expect(mockSaveResult).toHaveBeenCalled();
  });
});
