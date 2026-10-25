import { FlightMarker } from './FlightMarker';
import { flightKey } from '../../utils/flightSelection';

export function FlightLayer({ flights, selectedKey, selectionRevision, onSelectFlight }) {
  return flights.map((flight) => <FlightMarker key={flightKey(flight)} flight={flight}
    selected={Boolean(selectedKey) && flightKey(flight) === selectedKey}
    selectionRevision={selectionRevision} onSelectFlight={onSelectFlight} />);
}
