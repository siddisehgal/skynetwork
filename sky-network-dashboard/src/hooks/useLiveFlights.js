import { useEffect, useState } from 'react';
import { getLiveFlights } from '../api/client';
import { normalizeFlights } from '../utils/normalize';

export function useLiveFlights(pollMs = 15000) {
  const [flights, setFlights] = useState([]);
  const [lastSync, setLastSync] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let timer;

    async function load() {
      try {
        const data = await getLiveFlights();

     
        console.log('LIVE FLIGHTS RESPONSE:', data);
console.log('TIMESTAMP:', data?.timestamp);
console.log('FIRST FLIGHT:', data?.flights?.[0]);

        if (!cancelled) {
          const normalized = normalizeFlights(data.flights).map((flight) => ({
            ...flight,
            lastUpdated: flight.lastUpdated || data.timestamp
          }));

          setFlights(normalized);

          if (data.timestamp) {
            setLastSync(data.timestamp);
          }

          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unknown request error'
          );
          setLoading(false);
        }
      } finally {
        if (!cancelled) {
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

  return {
    flights,
    lastSync,
    loading,
    error
  };
}