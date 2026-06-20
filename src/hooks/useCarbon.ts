import { useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useAuth } from '../context/AuthContext';
import { calculateCarbonFootprint } from '../lib/carbonCalculations';
import { STORAGE_KEYS, DEFAULT_TRANSPORT, DEFAULT_ENERGY, DEFAULT_DIET } from '../lib/constants';
import type { CalculatorFormData, CarbonResult, SavedFootprint } from '../types';

/**
 * Central hook for carbon footprint state & calculations.
 */
export function useCarbon() {
  const { user } = useAuth();

  const footprintsKey = user ? `ecotrack_footprints_${user.id}` : STORAGE_KEYS.footprints;
  const actionsKey = user ? `ecotrack_completed_actions_${user.id}` : STORAGE_KEYS.actions;

  const [footprints, setFootprints] = useLocalStorage<SavedFootprint[]>(
    footprintsKey,
    []
  );

  const [completedActions, setCompletedActions] = useLocalStorage<string[]>(
    actionsKey,
    []
  );

  const latest = footprints.length > 0 ? footprints[0] : null;

  const defaultFormData: CalculatorFormData = useMemo(
    () => ({
      transport: { ...DEFAULT_TRANSPORT },
      energy: { ...DEFAULT_ENERGY },
      diet: { ...DEFAULT_DIET },
    }),
    []
  );

  function calculate(formData: CalculatorFormData): CarbonResult {
    return calculateCarbonFootprint(formData);
  }

  function saveResult(formData: CalculatorFormData, result: CarbonResult): void {
    const entry: SavedFootprint = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      formData,
      result,
    };
    setFootprints((prev) => [entry, ...prev].slice(0, 50));
  }

  function toggleAction(actionId: string): void {
    setCompletedActions((prev) =>
      prev.includes(actionId)
        ? prev.filter((id) => id !== actionId)
        : [...prev, actionId]
    );
  }

  return {
    footprints,
    latest,
    completedActions,
    defaultFormData,
    calculate,
    saveResult,
    toggleAction,
  };
}
