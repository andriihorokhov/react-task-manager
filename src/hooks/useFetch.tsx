import { useState, useEffect } from 'react';

export function useFetch<T>(url: string): {
  data: T | null;
  error: string | null;
  loading: boolean;
} {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }
    const abortController = new AbortController();
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url, { signal: abortController.signal });
        if (!response.ok) {
          setError('Failed to fetch data');
          setLoading(false);
          return;
        }
        const data = (await response.json()) as T;
        setData(data);
        setLoading(false);
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }
        setError(
          error instanceof Error ? error.message : 'An unknown error occurred',
        );
        setLoading(false);
      }
    };
    fetchData();
    return () => {
      abortController.abort();
    };
  }, [url]);

  return { data, error, loading };
}
