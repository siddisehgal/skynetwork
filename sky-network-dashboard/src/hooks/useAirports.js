import { useEffect, useState } from 'react';
import { getAirports } from '../api/client';

export function useAirports() {
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadAirports() {
      try {
        const data = await getAirports({ signal: controller.signal });
        setAirports(data);
        setError(null);
      } catch (requestError) {
        if (requestError?.code !== 'ERR_CANCELED') {
          setError(requestError instanceof Error ? requestError.message : 'Unable to load airports');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadAirports();
    return () => controller.abort();
  }, []);

  return { airports, loading, error };
}
