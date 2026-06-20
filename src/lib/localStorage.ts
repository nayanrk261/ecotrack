import { STORAGE_KEYS } from './constants';
import type { SavedFootprint } from '../types';

/**
 * Safely get a value from localStorage with JSON parsing.
 * If fetching or parsing fails, returns the fallback value.
 *
 * @param key - The key of the item in localStorage.
 * @param fallback - The fallback value if key does not exist or JSON parsing fails.
 * @returns The parsed item or the fallback value.
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
 * Catches any storage quota errors or write permission errors silently.
 *
 * @param key - The key to set the item under.
 * @param value - The value to be stringified and saved.
 */
export function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

/**
 * Get all saved carbon footprint entries from storage.
 *
 * @returns An array of SavedFootprint objects.
 */
export function getSavedFootprints(): SavedFootprint[] {
  return getFromStorage<SavedFootprint[]>(STORAGE_KEYS.footprints, []);
}

/**
 * Save a new footprint entry.
 * Prepends the entry to the footprint list and keeps at most 50 historical entries.
 *
 * @param entry - The SavedFootprint record to store.
 */
export function saveFootprint(entry: SavedFootprint): void {
  const existing = getSavedFootprints();
  const updated = [entry, ...existing].slice(0, 50);
  setToStorage(STORAGE_KEYS.footprints, updated);
}

/**
 * Get the latest saved footprint entry.
 *
 * @returns The latest SavedFootprint or null if no data is found.
 */
export function getLatestFootprint(): SavedFootprint | null {
  const all = getSavedFootprints();
  return all.length > 0 ? all[0] : null;
}

/**
 * Get all completed action IDs from localStorage.
 *
 * @returns An array of strings representing action IDs.
 */
export function getCompletedActions(): string[] {
  return getFromStorage<string[]>(STORAGE_KEYS.actions, []);
}

/**
 * Toggle the completion status of a green action.
 * If the action is already completed, it removes it; otherwise, it adds it.
 *
 * @param actionId - The ID of the action to toggle.
 * @returns The updated list of completed action IDs.
 */
export function toggleAction(actionId: string): string[] {
  const current = getCompletedActions();
  const updated = current.includes(actionId)
    ? current.filter((id) => id !== actionId)
    : [...current, actionId];
  setToStorage(STORAGE_KEYS.actions, updated);
  return updated;
}

