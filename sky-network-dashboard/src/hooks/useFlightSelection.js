import { useCallback, useEffect, useState } from 'react';
import { findSelectedFlight, flightKey } from '../utils/flightSelection';

export function useFlightSelection(flights) {
  const [selection, setSelection] = useState({ key: null, revision: 0 });
  const selectedFlight = findSelectedFlight(flights, selection.key);

  useEffect(() => {
    if (selection.key && !selectedFlight) {
      setSelection((current) => current.key === selection.key ? { ...current, key: null } : current);
    }
  }, [selection.key, selectedFlight]);

  const selectFlight = useCallback((flight) => {
    setSelection((current) => ({ key: flightKey(flight), revision: current.revision + 1 }));
  }, []);

  return { selectedKey: selectedFlight ? selection.key : null, selectionRevision: selection.revision, selectFlight };
}
