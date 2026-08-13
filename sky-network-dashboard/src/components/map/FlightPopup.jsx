import { formatAltitude, formatHeading, formatSpeedInKnots, formatTimestamp } from './flightTelemetry';

export function FlightPopup({ flight }) {
  const icao24 = flight.icao24 || flight.id?.replace(/^opensky-/, '') || 'Unavailable';

  return (
    <div className="flight-popup">
      <strong className="font-mono">
  {flight.flightCode || flight.callsign || 'Unknown flight'}
</strong>
      <dl>
        <div><dt>ICAO24</dt><dd>{icao24}</dd></div>
        <div><dt>Country</dt><dd>{flight.country || flight.originCountry || 'Unavailable'}</dd></div>
        <div><dt>Altitude</dt><dd>{formatAltitude(flight.currentAltitude)}</dd></div>
        <div><dt>Speed</dt><dd>{formatSpeedInKnots(flight.velocity)}</dd></div>
        <div><dt>Heading</dt><dd>{formatHeading(flight.track ?? flight.heading)}</dd></div>
        <div><dt>Last updated</dt><dd>{formatTimestamp(flight.lastUpdated)}</dd></div>
      </dl>
    </div>
  );
}
