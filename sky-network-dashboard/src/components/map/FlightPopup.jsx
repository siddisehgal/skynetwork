import { formatAltitude, formatHeading, formatSpeedInKnots, formatTimestamp } from './flightTelemetry';
import { normalizeFlight } from '../../utils/normalize';
import { FlightDataSources } from '../FlightDataSources';

export function FlightPopup({ flight: rawFlight }) {
  const flight = normalizeFlight(rawFlight);
  if (!flight) return null;
  const icao24 = flight.icao24 || flight.id?.replace(/^opensky-/, '') || 'Unavailable';

  return (
    <div className="flight-popup">
      <strong className="font-mono">
  {flight.flightCode || flight.callsign || 'Unknown flight'}
</strong>
      <dl>
        <div><dt>ICAO24</dt><dd>{icao24}</dd></div>
        <div><dt>Callsign</dt><dd>{flight.callsign}</dd></div>
        <div><dt>Operator</dt><dd>{flight.airline}</dd></div>
        <div><dt>Registration (metadata)</dt><dd><span className="flight-registration">{flight.aircraftRegistration === '---' ? 'Not available' : flight.aircraftRegistration}</span></dd></div>
        <div><dt>Aircraft type (metadata)</dt><dd>{flight.aircraft === '---' ? 'Not available' : flight.aircraft}</dd></div>
        <div><dt>Position</dt><dd>{Number.isFinite(flight.position?.latitude) && Number.isFinite(flight.position?.longitude) ? `${flight.position.latitude.toFixed(4)}, ${flight.position.longitude.toFixed(4)}` : 'Not available'}</dd></div>
        {flight.departureCode !== '---' && flight.arrivalCode !== '---' && <div><dt>Route</dt><dd>{flight.departureCode} → {flight.arrivalCode}</dd></div>}
        <div><dt>Live telemetry source</dt><dd>{flight.source}</dd></div>
        <div><dt>Country</dt><dd>{flight.country || flight.originCountry || 'Unavailable'}</dd></div>
        <div><dt>Altitude</dt><dd>{formatAltitude(flight.altitudeFt ?? flight.currentAltitude)}</dd></div>
        <div><dt>Speed</dt><dd>{formatSpeedInKnots(flight.speedKnots ?? flight.velocity)}</dd></div>
        <div><dt>Heading</dt><dd>{formatHeading(flight.track ?? flight.heading)}</dd></div>
        <div><dt>Last updated</dt><dd>{formatTimestamp(flight.lastUpdated)}</dd></div>
      </dl>
      <FlightDataSources flight={flight} />
    </div>
  );
}
