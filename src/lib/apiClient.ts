/**
 * @file apiClient.ts
 * @description Generic API client wrapper to standardize HTTP requests, header settings, and response/error processing.
 */

/**
 * Execute a standardized HTTP request with JSON serialization and response validation.
 *
 * @template T - Expected JSON response shape.
 * @param url - Destination endpoint URL.
 * @param options - Standard fetch options configuration.
 * @returns A promise resolving to the typed API response payload.
 * @throws Error if the network request fails, or server responds with a non-2xx status.
 */
export async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API Request failed (${response.status}): ${errorBody}`);
  }

  return response.json() as Promise<T>;
}
