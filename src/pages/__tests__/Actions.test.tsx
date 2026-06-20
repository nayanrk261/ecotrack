import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Actions from '../Actions';
import { LanguageProvider } from '../../context/LanguageContext';

const mockToggleAction = vi.fn();
let mockCompletedActions: string[] = [];

vi.mock('../../hooks/useCarbon', () => ({
  useCarbon: () => ({
    completedActions: mockCompletedActions,
    toggleAction: mockToggleAction,
  }),
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Actions Component', () => {
  beforeEach(() => {
    mockCompletedActions = [];
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <LanguageProvider>
        <Actions />
      </LanguageProvider>
    );
  };

  it('renders overall progress summary and action lists', () => {
    mockCompletedActions = ['t1', 'e1'];
    renderComponent();

    // Verify progress text renders
    expect(screen.getByText('Actions Completed')).toBeInTheDocument();
    expect(screen.getByText('2/20')).toBeInTheDocument(); // 2 of 20 actions completed

    // Verify category tab buttons
    const transportTab = screen.getAllByRole('button', { name: /Transport/i }).find(el => el.classList.contains('filter-tab'));
    expect(transportTab).toBeDefined();

    const energyTab = screen.getAllByRole('button', { name: /Energy/i }).find(el => el.classList.contains('filter-tab'));
    expect(energyTab).toBeDefined();

    // Verify some actions are in the document
    expect(screen.getByText('Switch to public transport')).toBeInTheDocument();
    expect(screen.getByText('Switch to LED bulbs')).toBeInTheDocument();
  });

  it('filters actions by category tab', () => {
    renderComponent();

    // Initially shows all actions
    expect(screen.getByText('Switch to public transport')).toBeInTheDocument(); // Transport
    expect(screen.getByText('Switch to LED bulbs')).toBeInTheDocument(); // Energy

    // Filter by Energy
    const energyTab = screen.getAllByRole('button', { name: /^Energy/i }).find(el => el.classList.contains('filter-tab'));
    expect(energyTab).toBeDefined();
    fireEvent.click(energyTab!);

    // Transport action should be filtered out, Energy should remain
    expect(screen.queryByText('Switch to public transport')).not.toBeInTheDocument();
    expect(screen.getByText('Switch to LED bulbs')).toBeInTheDocument();
  });

  it('calls toggleAction when clicking an action card', () => {
    renderComponent();

    const publicTransportCard = screen.getByText('Switch to public transport').closest('.action-card');
    expect(publicTransportCard).toBeInTheDocument();

    fireEvent.click(publicTransportCard!);

    expect(mockToggleAction).toHaveBeenCalledWith('t1');
  });
});
