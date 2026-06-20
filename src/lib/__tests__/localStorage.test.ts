import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getFromStorage,
  setToStorage,
  getSavedFootprints,
  saveFootprint,
  getLatestFootprint,
  getCompletedActions,
  toggleAction,
} from '../localStorage';
import type { SavedFootprint } from '../../types';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('localStorage utilities', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.restoreAllMocks();
  });

  describe('getFromStorage & setToStorage', () => {
    it('should set and get values successfully', () => {
      setToStorage('test_key', { foo: 'bar' });
      const val = getFromStorage('test_key', { foo: 'fallback' });
      expect(val).toEqual({ foo: 'bar' });
    });

    it('should return fallback if key does not exist', () => {
      const val = getFromStorage('non_existent', 'fallback');
      expect(val).toBe('fallback');
    });

    it('should return fallback if JSON parsing throws an error', () => {
      localStorageMock.setItem('bad_json', 'invalid{json');
      const val = getFromStorage('bad_json', 'fallback');
      expect(val).toBe('fallback');
    });
  });

  describe('footprint operations', () => {
    const dummyFootprint: SavedFootprint = {
      id: '1',
      date: '2026-06-20T00:00:00.000Z',
      formData: {
        transport: { commuteMode: 'walk', dailyDistance: 0, shortHaulFlights: 0, longHaulFlights: 0 },
        energy: { monthlyElectricity: 0, cookingFuel: 'electric', householdSize: 1 },
        diet: { dietType: 'vegan', monthlyOnlineOrders: 0, newClothesPerMonth: 0 },
      },
      result: {
        totalMonthly: 50,
        totalAnnual: 0.6,
        breakdown: { transport: 0, energy: 0, diet: 50, lifestyle: 0 },
        score: 'Eco Warrior',
      },
    };

    it('should return empty array when no footprints saved', () => {
      expect(getSavedFootprints()).toEqual([]);
    });

    it('should save and retrieve footprints', () => {
      saveFootprint(dummyFootprint);
      const footprints = getSavedFootprints();
      expect(footprints).toHaveLength(1);
      expect(footprints[0]).toEqual(dummyFootprint);
    });

    it('should retrieve the latest footprint', () => {
      expect(getLatestFootprint()).toBeNull();

      const secondFootprint = { ...dummyFootprint, id: '2', date: '2026-06-20T01:00:00.000Z' };
      saveFootprint(dummyFootprint);
      saveFootprint(secondFootprint); // prepended, so it should be first in list

      expect(getLatestFootprint()).toEqual(secondFootprint);
    });

    it('should cap the list at 50 entries', () => {
      for (let i = 0; i < 60; i++) {
        saveFootprint({ ...dummyFootprint, id: `id_${i}` });
      }
      const all = getSavedFootprints();
      expect(all).toHaveLength(50);
      expect(all[0].id).toBe('id_59'); // most recent
    });
  });

  describe('completed actions', () => {
    it('should return empty list when no actions completed', () => {
      expect(getCompletedActions()).toEqual([]);
    });

    it('should toggle action completion status', () => {
      let active = toggleAction('action_1');
      expect(active).toEqual(['action_1']);
      expect(getCompletedActions()).toEqual(['action_1']);

      // toggle again to remove
      active = toggleAction('action_1');
      expect(active).toEqual([]);
      expect(getCompletedActions()).toEqual([]);
    });

    it('should append status if toggling a new action', () => {
      toggleAction('action_1');
      const active = toggleAction('action_2');
      expect(active).toEqual(['action_1', 'action_2']);
    });
  });
});
