/**
 * @file useLocalStorage.ts
 * @description Custom React hook establishing synchronized binding between React state and browser local storage.
 */

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for syncing React state with localStorage.
 * Handles JSON parse/stringify and errors gracefully.
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
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
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
    try {
      const item = localStorage.getItem(key);
      setStoredValue(item ? (JSON.parse(item) as T) : initialValueRef.current);
    } catch {
      setStoredValue(initialValueRef.current);
    }
  }, [key]);

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue) as T);
        } catch {
          // ignore parse errors from other tabs
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [key]);

  return [storedValue, setValue];
}
