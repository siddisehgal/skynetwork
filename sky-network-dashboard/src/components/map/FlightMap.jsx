import { MapContainer, TileLayer } from 'react-leaflet';
import { AirportLayer } from './AirportLayer';
import { FlightLayer } from './FlightLayer';
import { RouteLayer } from './RouteLayer';
import { hasFlightPosition } from './flightPosition';
import { InitialViewport } from './InitialViewport';
import { MapLegend } from './MapLegend';
import './flightMap.css';

const worldCenter = [20, 0];

export function FlightMap({ flights, airports = [], showRoutes = true }) {
  const positionedFlights = flights.filter(hasFlightPosition);

  return (
    <div className="flight-map-container">
      <MapContainer center={worldCenter} zoom={2} minZoom={2} worldCopyJump scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <InitialViewport flights={positionedFlights} />
        {showRoutes && <RouteLayer flights={positionedFlights} airports={airports} />}
        <FlightLayer flights={positionedFlights} />
        <AirportLayer airports={airports} />
      </MapContainer>
      <MapLegend />
    </div>
  );
}