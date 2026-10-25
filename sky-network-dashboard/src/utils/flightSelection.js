export function flightKey(flight) {
  const hex = String(flight?.icao24 || '').trim().toLowerCase();
  if (/^[0-9a-f]{6}$/.test(hex)) return `icao24:${hex}`;
  const id = String(flight?.id || '').trim();
  return id && id !== 'unknown-id' ? `id:${id}` : null;
}

export function findSelectedFlight(flights, key) {
  return key ? flights.find((flight) => flightKey(flight) === key) || null : null;
}
