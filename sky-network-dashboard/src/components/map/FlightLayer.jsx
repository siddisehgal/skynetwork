import { FlightMarker } from './FlightMarker';

export function FlightLayer({ flights }) {
  return flights.map((flight) => <FlightMarker key={flight.id} flight={flight} />);
}
