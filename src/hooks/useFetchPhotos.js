/**
 * useFetchPhotos.js
 * 
 * Custom React hook for fetching photos from the Picsum API.
 * Uses useState for API state and useEffect for data fetching with AbortController cleanup.
 * Prevents unnecessary duplicate requests and exposes a retry callback.
 */

import { useState, useEffect, useCallback } from 'react';

const PICSUM_API_URL = 'https://picsum.photos/v2/list?limit=30';

/**
 * @typedef {Object} Photo
 * @property {string} id
 * @property {string} author
 * @property {number} width
 * @property {number} height
 * @property {string} url
 * @property {string} download_url
 */

/**
 * @returns {{
 *   photos: Photo[],
 *   loading: boolean,
 *   error: string | null,
 *   retry: () => void
 * }}
 */
export function useFetchPhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Stable callback to trigger a retry of the fetch operation
  const retry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    let isMounted = true;

    async function fetchPhotos() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(PICSUM_API_URL, {
          signal: abortController.signal,
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch photos (HTTP ${response.status}: ${response.statusText || 'Unknown Error'})`
          );
        }

        const data = await response.json();

        // Validate API response format
        if (!Array.isArray(data)) {
          throw new Error('Unexpected response format: expected a list of photos.');
        }

        if (isMounted) {
          setPhotos(data);
          setLoading(false);
        }
      } catch (err) {
        // Ignore AbortError when component unmounts or retry runs
        if (err.name === 'AbortError') {
          return;
        }

        if (isMounted) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : 'A network error occurred while loading photos. Please check your internet connection.';
          setError(errorMessage);
          setLoading(false);
        }
      }
    }

    fetchPhotos();

    // Clean up pending requests on unmount or retry
    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [retryCount]);

  return { photos, loading, error, retry };
}
