/**
 * @file errorHandling.ts
 * @description Centralized error handling utilities.
 */

/**
 * Safely parse a JSON string. If parsing fails, returns the fallback value or calls the onError callback.
 * 
 * @param text - The JSON string to parse.
 * @param fallbackOrError - Either a fallback value of type T, or a callback that receives the error and returns a T or throws.
 * @returns The parsed object of type T or the result of fallbackOrError.
 */
export function safeJsonParse<T>(
  text: string,
  fallbackOrError: T | ((error: unknown) => T)
): T {
  try {
    return JSON.parse(text) as T;
  } catch (error) {
    if (typeof fallbackOrError === 'function') {
      return (fallbackOrError as (err: unknown) => T)(error);
    }
    return fallbackOrError;
  }
}
