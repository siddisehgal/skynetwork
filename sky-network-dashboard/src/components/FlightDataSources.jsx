import { formatTimestamp } from './map/flightTelemetry';

export function FlightDataSources({ flight }) {
  return (
    <details className="flight-data-sources">
      <summary>Data sources</summary>
      <div className="flight-source-fields">
        <span>Metadata source: {flight.aircraftMetadataSource === '---' ? 'Not available' : flight.aircraftMetadataSource}</span>
        <span>Dataset version: {flight.aircraftMetadataVersion || 'Not available'}</span>
        <span>Dataset imported: {formatTimestamp(flight.aircraftMetadataImportedAt)}</span>
        <span>Metadata fetched: {formatTimestamp(flight.aircraftMetadataCheckedAt)}</span>
        <span>Operator source: {flight.operatorSource}</span>
        <span>Aircraft metadata is reference data. Operator names use the shared ICAO callsign-prefix catalog when available; registration callsigns do not imply an airline.</span>
        {flight.aircraftMetadataErrorCode && <span>Metadata not available in local dataset</span>}
      </div>
    </details>
  );
}
