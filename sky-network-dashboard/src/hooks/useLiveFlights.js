import { useEffect, useSyncExternalStore } from 'react';
import { getLiveFlights } from '../api/client';
import { normalizeFlights } from '../utils/normalize';

const POLL_MS = 15000;
let snapshot = {
  flights: [],
  source: null,
  freshness: null,
  snapshotTimestamp: null,
  sourceTimestamp: null,
  sourceError: null,
  sourceErrorCode: null,
  loading: true,
  error: null,
};
let timer;
let inFlight;
let consumers = 0;
const listeners = new Set();

function publish(nextSnapshot) {
  snapshot = nextSnapshot;
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return snapshot;
}

async function refresh() {
  if (inFlight) return inFlight;

  inFlight = getLiveFlights()
    .then((result) => {
      publish({
        ...result,
        flights: normalizeFlights(result.flights),
        loading: false,
        error: null,
      });
    })
    .catch((error) => {
      publish({
        ...snapshot,
        freshness: snapshot.source === 'OPENSKY' ? 'STALE' : snapshot.freshness,
        loading: false,
        error: error instanceof Error ? error.message : 'Unable to retrieve flights',
      });
    })
    .finally(() => {
      inFlight = null;
      if (consumers > 0) timer = window.setTimeout(refresh, POLL_MS);
    });

  return inFlight;
}

export function useLiveFlights() {
  const current = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useEffect(() => {
    consumers += 1;
    if (consumers === 1) refresh();

    return () => {
      consumers -= 1;
      if (consumers === 0) window.clearTimeout(timer);
    };
  }, []);

  return current;
}