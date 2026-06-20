import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { useCarbon } from './useCarbon';
import { useLanguage } from '../context/LanguageContext';
import { GREEN_ACTIONS } from '../lib/constants';
import type { GreenAction, ActionCategory } from '../types';

export interface UseActionsListReturn {
  activeCategory: ActionCategory | 'All';
  setActiveCategory: React.Dispatch<React.SetStateAction<ActionCategory | 'All'>>;
  filtered: GreenAction[];
  totalSaved: number;
  handleToggle: (actionId: string) => void;
  completedActions: string[];
}

/**
 * Hook managing the green actions list, category filtering, and toggle interactions.
 * Derives total CO₂ saved from the set of completed actions, triggers toast notifications
 * and confetti when a full category is completed.
 *
 * @returns A {@link UseActionsListReturn} object with filtered actions, category state,
 * total savings, toggle handler, and the raw completed-action IDs.
 */
export function useActionsList(): UseActionsListReturn {
  const { completedActions, toggleAction } = useCarbon();
  const { locale, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<ActionCategory | 'All'>('All');

  const filtered = useMemo(
    () =>
      activeCategory === 'All'
        ? GREEN_ACTIONS
        : GREEN_ACTIONS.filter((a) => a.category === activeCategory),
    [activeCategory]
  );

  const totalSaved = useMemo(
    () =>
      GREEN_ACTIONS.filter((a) => completedActions.includes(a.id)).reduce(
        (sum, a) => sum + a.co2Savings,
        0
      ),
    [completedActions]
  );

  const handleToggle = (actionId: string) => {
    const action = GREEN_ACTIONS.find((a) => a.id === actionId);
    if (!action) return;

    const wasCompleted = completedActions.includes(actionId);
    toggleAction(actionId);

    if (!wasCompleted) {
      toast.success(
        locale === 'en'
          ? `+${action.co2Savings} kg CO₂/year saved!`
          : `+${action.co2Savings} किग्रा CO₂/वर्ष की बचत सहेजी गई!`
      );

      // Check if category completed
      const categoryActions = GREEN_ACTIONS.filter(
        (a) => a.category === action.category
      );
      const completedInCategory = categoryActions.filter(
        (a) => a.id === actionId || completedActions.includes(a.id)
      );

      if (completedInCategory.length === categoryActions.length) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#4ade80', '#86efac', '#16a34a'],
        });
        const localizedCat = t(action.category.toLowerCase() as 'transport' | 'energy' | 'diet' | 'lifestyle');
        toast.success(
          locale === 'en'
            ? `🎉 ${action.category} category complete! Amazing work!`
            : `🎉 ${localizedCat} श्रेणी पूर्ण! अद्भुत कार्य!`,
          { duration: 4000 }
        );
      }
    }
  };

  return {
    activeCategory,
    setActiveCategory,
    filtered,
    totalSaved,
    handleToggle,
    completedActions,
  };
}
