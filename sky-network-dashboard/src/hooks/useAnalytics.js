import { useEffect, useState } from 'react';
import { getAnalyticsStats } from '../api/client';

/**
 * Custom hook to fetch analytics stats from the backend.
 */
export function useAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  let cancelled = false;

  async function load() {
    try {
      setLoading(true);

      const data = await getAnalyticsStats();

      if (!cancelled) {
        setStats(data);
        setError(null);
      }
    } catch (err) {
      if (!cancelled) {
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to retrieve operational analytics stats'
        );
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  }

  // First fetch immediately
  load();

  // Refresh every 15 seconds
  const interval = setInterval(() => {
    load();
  }, 15000);

  return () => {
    cancelled = true;
    clearInterval(interval);
  };
}, []);

  return { stats, loading, error };
}
