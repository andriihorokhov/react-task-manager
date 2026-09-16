import { useState, useEffect } from 'react';

export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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
          setError(new Error('Failed to fetch data'));
          setLoading(false);
          return;
        }
        const data = await response.json();
        setData(data);
        setLoading(false);
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
    return () => {
      abortController.abort();
    };
  }, [url]);

  return { data, error, loading };
};
