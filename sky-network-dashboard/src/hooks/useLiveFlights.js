import { useEffect, useState } from 'react';
import { getLiveFlights } from '../api/client';
import { normalizeFlights } from '../utils/normalize';

export function useLiveFlights(pollMs = 15000) {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let timer;
    let latestRequest = 0;

    async function load() {
      const requestId = ++latestRequest;

      try {
        const data = await getLiveFlights();
        if (!cancelled && requestId === latestRequest) {
          // Normalize flights at the hook level to stabilize schemas across all views
          const normalized = normalizeFlights(data);
          setFlights(normalized);
          setError(null);
        }
      } catch (err) {
        if (!cancelled && requestId === latestRequest) {
          setError(err instanceof Error ? err.message : 'Unknown request error');
        }
      } finally {
        if (!cancelled && requestId === latestRequest) {
          setLoading(false);
          timer = window.setTimeout(load, pollMs);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [pollMs]);

  return { flights, loading, error };
}
