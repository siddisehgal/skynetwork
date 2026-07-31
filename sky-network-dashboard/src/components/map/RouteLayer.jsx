import { Polyline, Tooltip } from 'react-leaflet';

// Builds a lookup of iata -> [lat, lng] from the airports list so routes can be
// drawn without needing extra data on the flight object itself.
function buildAirportIndex(airports) {
  const index = new Map();
  airports.forEach((airport) => {
    if (Number.isFinite(airport.latitude) && Number.isFinite(airport.longitude)) {
      index.set(airport.iata, [airport.latitude, airport.longitude]);
    }
  });
  return index;
}

export function RouteLayer({ flights, airports }) {
  const airportIndex = buildAirportIndex(airports);

  return flights.map((flight) => {
    const depCode = flight.departureCode || flight.departure?.iata;
    const arrCode = flight.arrivalCode || flight.arrival?.iata;
    const from = depCode && airportIndex.get(depCode);
    const to = arrCode && airportIndex.get(arrCode);

    // Only draw a route when both endpoints are known — otherwise skip
    // silently rather than drawing a misleading partial line.
    if (!from || !to) return null;

    return (
      <Polyline
        key={`route-${flight.id}`}
        positions={[from, to]}
        pathOptions={{
          color: 'var(--surface-tint)',
          weight: 1.5,
          opacity: 0.45,
          dashArray: '4 6',
        }}
      >
        <Tooltip sticky>{depCode} → {arrCode}</Tooltip>
      </Polyline>
    );
  });
}