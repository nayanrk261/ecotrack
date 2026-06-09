import { STORAGE_KEYS } from './constants';
import type { SavedFootprint } from '../types';

/**
 * Safely get a value from localStorage with JSON parsing.
 * Returns fallback on any error.
 */
export function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * Safely set a value in localStorage with JSON stringify.
 */
export function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

/**
 * Get all saved footprint entries
 */
export function getSavedFootprints(): SavedFootprint[] {
  return getFromStorage<SavedFootprint[]>(STORAGE_KEYS.footprints, []);
}

/**
 * Save a new footprint entry (prepend to list, keep max 50)
 */
export function saveFootprint(entry: SavedFootprint): void {
  const existing = getSavedFootprints();
  const updated = [entry, ...existing].slice(0, 50);
  setToStorage(STORAGE_KEYS.footprints, updated);
}

/**
 * Get the latest saved footprint
 */
export function getLatestFootprint(): SavedFootprint | null {
  const all = getSavedFootprints();
  return all.length > 0 ? all[0] : null;
}

/**
 * Get completed action IDs
 */
export function getCompletedActions(): string[] {
  return getFromStorage<string[]>(STORAGE_KEYS.actions, []);
}

/**
 * Toggle a completed action
 */
export function toggleAction(actionId: string): string[] {
  const current = getCompletedActions();
  const updated = current.includes(actionId)
    ? current.filter((id) => id !== actionId)
    : [...current, actionId];
  setToStorage(STORAGE_KEYS.actions, updated);
  return updated;
}
