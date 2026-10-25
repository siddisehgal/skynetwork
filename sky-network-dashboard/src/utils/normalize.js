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

  const altitudeFt = flight.altitudeFt ?? flight.altitude ?? flight.currentAltitude ?? null;
  const speedKnots = flight.speedKnots ?? flight.groundSpeed ?? flight.speed ?? flight.velocity ?? flight.currentPosition?.speed ?? null;
  const heading = flight.heading ?? flight.track ?? flight.currentPosition?.heading ?? null;
  const hasPosition = Boolean(rawPos) || lat != null || lng != null;
  const aircraftMetadata = flight.aircraftMetadata || null;

  const normalized = {
    // Primary ID (guaranteed string)
    id: idVal,

    // Identifiers
    flightNumber: stringify(flight.flightNumber || flight.flightCode, 'No callsign'),
    callsign: stringify(flight.callsign, 'Unavailable'),
    airlineCode: stringify(flight.airlineCode),
    airline: stringify(flight.airline, 'Unknown operator'),
    operatorUnknown: flight.operatorUnknown ?? (!flight.airlineCode || flight.airlineCode === '---'),
    operatorSource: flight.operatorSource || 'Not available',
    country: stringify(flight.country || flight.originCountry),
    icao24: stringify(flight.icao24),

    // Routes & Departure/Arrival
    departure: flight.departure || '---',
    arrival: flight.arrival || '---',
    departureCode: stringify(depCode || null),
    arrivalCode: stringify(arrCode || null),

    // Aircraft Registration/Type (guaranteed string)
    aircraft: stringify(flight.aircraft?.type || flight.aircraftType || aircraftMetadata?.model || (typeof flight.aircraft === 'string' ? flight.aircraft : null)),
    aircraftRegistration: stringify(flight.aircraftRegistration || flight.aircraft?.registration || aircraftMetadata?.registration),
    aircraftManufacturer: stringify(flight.aircraftManufacturer || aircraftMetadata?.manufacturer),
    aircraftIcaoType: stringify(flight.aircraftIcaoType || aircraftMetadata?.icaoType),
    aircraftMetadataSource: stringify(flight.aircraftMetadataSource || aircraftMetadata?.source),
    aircraftMetadataCheckedAt: flight.aircraftMetadataCheckedAt || aircraftMetadata?.checkedAt || null,
    aircraftMetadataImportedAt: flight.aircraftMetadataImportedAt || null,
    aircraftMetadataVersion: flight.aircraftMetadataVersion || null,
    aircraftMetadataErrorCode: flight.aircraftMetadataErrorCode || null,

    // Status
    status: stringify(flight.status, 'UNKNOWN'),

    // Position & Coordinates
    position: hasPosition ? { latitude: lat, longitude: lng } : null,

    altitudeFt: altitudeFt != null ? Number(altitudeFt) : null,
    speedKnots: speedKnots != null ? Number(speedKnots) : null,
    heading: heading != null ? Number(heading) : null,
    verticalRateFpm: flight.verticalRateFpm != null ? Number(flight.verticalRateFpm) : null,

    // Metadata
    source: stringify(flight.source),
    lastUpdated: flight.lastUpdated || null,

    // Legacy backwards compatibility variables for map modules:
    flightCode: stringify(flight.flightCode || flight.flightNumber),
    currentPosition: hasPosition ? { latitude: lat, longitude: lng } : null,
    currentAltitude: altitudeFt != null ? Number(altitudeFt) : null,
    velocity: speedKnots != null ? Number(speedKnots) : null,
    track: heading != null ? Number(heading) : null,
    originCountry: stringify(flight.country || flight.originCountry),
    progress: null,
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
