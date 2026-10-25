export function formatAltitude(value) {
  return Number.isFinite(value) ? `${Math.round(value).toLocaleString()} ft` : 'Unavailable';
}

export function formatSpeedInKnots(value) {
  return Number.isFinite(value) ? `${Math.round(value).toLocaleString()} kt` : 'Unavailable';
}

export function formatHeading(value) {
  return Number.isFinite(value) ? `${Math.round(value)}\u00b0` : 'Unavailable';
}

export function formatTimestamp(value) {
  if (!value) return 'Unavailable';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unavailable';

  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export function getMostRecentTimestamp(flights) {
  const timestamps = flights
    .map((flight) => new Date(flight.lastUpdated).getTime())
    .filter(Number.isFinite);

  return timestamps.length > 0 ? new Date(Math.max(...timestamps)).toISOString() : null;
}
