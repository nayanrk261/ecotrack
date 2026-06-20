/**
 * @file useLocalStorage.ts
 * @description Custom React hook establishing synchronized binding between React state and browser local storage.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { safeJsonParse } from '../lib/errorHandling';

/**
 * Custom hook that provides React state synchronized with a `localStorage` key.
 * On mount, reads the stored value and parses it; on updates, writes back atomically.
 * Handles cross-tab synchronization via the `storage` event and gracefully
 * degrades if the storage quota is exceeded.
 *
 * @param key - The localStorage key to bind state to.
 * @param initialValue - The fallback value used when no stored value exists.
 * @returns A stateful tuple `[value, setValue]` matching the React `useState` signature.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const initialValueRef = useRef(initialValue);
  
  // Keep the ref up-to-date in case initialValue actually changes
  useEffect(() => {
    initialValueRef.current = initialValue;
  }, [initialValue]);

  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = localStorage.getItem(key);
    return item ? safeJsonParse<T>(item, initialValue) : initialValue;
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const newValue = value instanceof Function ? value(prev) : value;
        try {
          localStorage.setItem(key, JSON.stringify(newValue));
        } catch (e) {
          console.error('localStorage write failed:', e);
        }
        return newValue;
      });
    },
    [key]
  );

  // Reload state if key changes (e.g., when logging in/out to switch namespace keys)
  useEffect(() => {
    const item = localStorage.getItem(key);
    setStoredValue(item ? safeJsonParse<T>(item, initialValueRef.current) : initialValueRef.current);
  }, [key]);

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        setStoredValue(safeJsonParse<T>(e.newValue, storedValue));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [key, storedValue]);

  return [storedValue, setValue];
}

