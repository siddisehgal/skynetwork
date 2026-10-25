import { MROLayer } from './MROLayer';
import { MapContainer, TileLayer } from 'react-leaflet';
import { AirportLayer } from './AirportLayer';
import { FlightLayer } from './FlightLayer';
import { RouteLayer } from './RouteLayer';
import { hasFlightPosition } from './flightPosition';
import { InitialViewport } from './InitialViewport';
import { MapLegend } from './MapLegend';
import './flightMap.css';
import { flightKey } from '../../utils/flightSelection';
import { MapFocus } from './MapFocus';
import { AircraftMetadataAttribution } from '../AircraftMetadataAttribution';

const worldCenter = [20, 0];
const MAX_RENDERED_FLIGHTS = 500;

export function FlightMap({
  flights,
  airports = [],
  mroFacilities = [],
  showRoutes = true,
  selectedKey = null,
  selectionRevision = 0,
  onSelectFlight,
  showAttribution = true,
}) {
  const positionedFlights = flights.filter(hasFlightPosition);
  const displayedFlights = positionedFlights.slice(0, MAX_RENDERED_FLIGHTS);
  const selectedFlight = positionedFlights.find((flight) => flightKey(flight) === selectedKey);
  if (selectedFlight && !displayedFlights.includes(selectedFlight)) {
    displayedFlights[displayedFlights.length - 1] = selectedFlight;
  }

  return (
    <div>
    <div className="flight-map-container">
      <MapContainer center={worldCenter} zoom={2} minZoom={2} worldCopyJump scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <InitialViewport flights={displayedFlights} />
        <MapFocus />
        {showRoutes && <RouteLayer flights={displayedFlights} airports={airports} />}
        <FlightLayer flights={displayedFlights} selectedKey={selectedKey} selectionRevision={selectionRevision} onSelectFlight={onSelectFlight} />
        <AirportLayer airports={airports} />
        <MROLayer facilities={mroFacilities} />
      </MapContainer>
      <div className="map-render-limit" role="status">
        Showing {displayedFlights.length} of {positionedFlights.length} positioned aircraft
        {positionedFlights.length > MAX_RENDERED_FLIGHTS ? ` (map limit ${MAX_RENDERED_FLIGHTS})` : ''}
      </div>
      <MapLegend />
    </div>
    {showAttribution && flights.length > 0 && <AircraftMetadataAttribution />}
    </div>
  );
}
