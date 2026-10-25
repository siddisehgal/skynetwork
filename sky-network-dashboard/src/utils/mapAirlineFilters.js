export const UNKNOWN_OPERATOR_FILTER = '__UNKNOWN_OPERATOR__';

export function getMapAirlineOptions(flights) {
  const counts = new Map();
  let unknownCount = 0;

  flights.forEach((flight) => {
    if (!flight.airlineCode || flight.airlineCode === '---' || flight.operatorUnknown) {
      unknownCount += 1;
      return;
    }

    const current = counts.get(flight.airlineCode) || {
      code: flight.airlineCode,
      name: flight.airline,
      count: 0,
    };
    current.count += 1;
    counts.set(flight.airlineCode, current);
  });

  return {
    operators: Array.from(counts.values()).sort((a, b) => a.code.localeCompare(b.code)),
    unknownCount,
  };
}

export function applyMapFilters(flights, filters) {
  return flights.filter((flight) => {
    if (filters.airline === UNKNOWN_OPERATOR_FILTER) {
      if (flight.airlineCode && flight.airlineCode !== '---' && !flight.operatorUnknown) return false;
    } else if (filters.airline && flight.airlineCode !== filters.airline) {
      return false;
    }
    if (filters.status && flight.status !== filters.status) return false;

    const altitude = flight.altitudeFt;
    if (filters.minAltitude !== '' && !(altitude >= Number(filters.minAltitude))) return false;
    if (filters.maxAltitude !== '' && !(altitude <= Number(filters.maxAltitude))) return false;

    return true;
  });
}

export const defaultMapFilters = {
  airline: '',
  status: '',
  minAltitude: '',
  maxAltitude: '',
  showRoutes: true,
};