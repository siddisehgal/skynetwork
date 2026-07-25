/**
 * Normalizes raw flight data objects to conform to the stabilized backend flight contract.
 * Preserves both upcoming and legacy keys to prevent map and telemetry breaking changes.
 */
export function normalizeFlight(flight) {
  if (!flight) return null;

  // Extract coordinates from position or legacy currentPosition
  let lat = null;
  let lng = null;
  const rawPos = flight.position || flight.currentPosition;
  if (rawPos) {
    if (Array.isArray(rawPos) && rawPos.length >= 2) {
      lat = Number(rawPos[0]);
      lng = Number(rawPos[1]);
    } else if (typeof rawPos === 'object') {
      const flat = rawPos.latitude ?? rawPos.lat;
      const flng = rawPos.longitude ?? rawPos.lng ?? rawPos.lon;
      lat = flat != null ? Number(flat) : null;
      lng = flng != null ? Number(flng) : null;
    }
  }

  // Fallback to top-level latitude/longitude if present
  if (lat == null && flight.latitude != null) lat = Number(flight.latitude);
  if (lng == null && flight.longitude != null) lng = Number(flight.longitude);

  if (!Number.isFinite(lat)) lat = null;
  if (!Number.isFinite(lng)) lng = null;

  // Extract departure & arrival IATA codes/names
  const depCode = typeof flight.departure === 'string'
    ? flight.departure
    : (flight.departure?.iata || flight.departure?.code || '');
  const arrCode = typeof flight.arrival === 'string'
    ? flight.arrival
    : (flight.arrival?.iata || flight.arrival?.code || '');

  // Normalize string attributes safely to avoid React child object crashes
  const stringify = (val, fallback = '---') => {
    if (val == null) return fallback;
    if (typeof val === 'object') {
      return val.registration || val.name || val.code || val.iata || val.type || val.model || fallback;
    }
    return String(val);
  };

  const idVal = flight.id != null
    ? String(flight.id)
    : (flight.flightNumber || flight.flightCode || 'unknown-id');

  const normalized = {
    // Primary ID (guaranteed string)
    id: idVal,

    // Identifiers
    flightNumber: stringify(flight.flightNumber || flight.flightCode),
    callsign: stringify(flight.callsign),
    airlineCode: stringify(flight.airlineCode || flight.airline),
    country: stringify(flight.country || flight.originCountry),

    // Routes & Departure/Arrival
    departure: flight.departure || '---',
    arrival: flight.arrival || '---',
    departureCode: stringify(depCode),
    arrivalCode: stringify(arrCode),

    // Aircraft Registration/Type (guaranteed string)
    aircraft: stringify(flight.aircraft || flight.aircraftRegistration),

    // Status
    status: stringify(flight.status, 'UNKNOWN'),

    // Position & Coordinates
    position: (lat != null && lng != null) ? { latitude: lat, longitude: lng } : null,

    // Telemetry
    altitude: flight.altitude != null ? Number(flight.altitude) : (flight.currentAltitude != null ? Number(flight.currentAltitude) : null),
    speed: flight.speed != null ? Number(flight.speed) : (flight.velocity != null ? Number(flight.velocity) : null),
    heading: flight.heading != null ? Number(flight.heading) : (flight.track != null ? Number(flight.track) : null),
    verticalRate: flight.verticalRate != null ? Number(flight.verticalRate) : null,

    // Metadata
    source: stringify(flight.source),
    lastUpdated: flight.lastUpdated || null,

    // Legacy backwards compatibility variables for map modules:
    flightCode: stringify(flight.flightCode || flight.flightNumber),
    currentPosition: (lat != null && lng != null) ? { latitude: lat, longitude: lng } : null,
    currentAltitude: flight.altitude != null ? Number(flight.altitude) : (flight.currentAltitude != null ? Number(flight.currentAltitude) : null),
    velocity: flight.speed != null ? Number(flight.speed) : (flight.velocity != null ? Number(flight.velocity) : null),
    track: flight.heading != null ? Number(flight.heading) : (flight.track != null ? Number(flight.track) : null),
    originCountry: stringify(flight.country || flight.originCountry),
    airline: stringify(flight.airlineCode || flight.airline),
    progress: Number(flight.progress) || 0,
  };

  return normalized;
}

/**
 * Helper to normalize list of flights.
 */
export function normalizeFlights(flights) {
  if (!Array.isArray(flights)) return [];
  return flights.map(normalizeFlight).filter(Boolean);
}
