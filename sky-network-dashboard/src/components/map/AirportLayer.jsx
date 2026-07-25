import { AirportMarker } from './AirportMarker';

function hasAirportPosition(airport) {
  return Number.isFinite(airport.latitude) && Number.isFinite(airport.longitude);
}

export function AirportLayer({ airports }) {
  return airports.filter(hasAirportPosition).map((airport) => (
    <AirportMarker key={airport.icao} airport={airport} />
  ));
}
