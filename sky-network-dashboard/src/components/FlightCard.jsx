import React from 'react';
import { FlightDataSources } from './FlightDataSources';
import { normalizeFlight } from '../utils/normalize';
import { formatTimestamp } from './map/flightTelemetry';

// Helper to determine status badge classes
function getStatusClass(status) {
  const s = String(status).toUpperCase();
  if (s.includes('DELAY')) return 'hud-badge-delayed';
  if (s.includes('ACTIVE') || s.includes('IN-FLIGHT')) return 'hud-badge-active';
  if (s.includes('TIME')) return 'hud-badge-ontime';
  if (s.includes('GROUND')) return 'hud-badge-ground';
  return 'hud-badge-unknown';
}

export function FlightCard({ flight: rawFlight }) {
  const flight = normalizeFlight(rawFlight);
  if (!flight) return null;

  const registration = flight.aircraftRegistration !== '---' ? flight.aircraftRegistration : null;
  const aircraftType = flight.aircraft !== '---' ? flight.aircraft : null;

  // Formatting values
  const altText = flight.altitudeFt != null ? `${Math.round(flight.altitudeFt).toLocaleString()} ft` : 'Unavailable';
  const speedText = flight.speedKnots != null ? `${Math.round(flight.speedKnots)} kt` : 'Unavailable';
  const headingText = flight.heading != null ? `${Math.round(flight.heading)}°` : '---';
  const hasRoute = flight.departureCode !== '---' && flight.arrivalCode !== '---';
  const verticalRate = flight.verticalRateFpm;
  const verticalLabel = verticalRate == null
    ? 'RATE UNAVAILABLE'
    : verticalRate > 300
      ? 'CLIMB'
      : verticalRate < -300
        ? 'DESCENT'
        : 'LEVEL';
  const coordinates = flight.currentPosition;
  const coordinateText = Number.isFinite(coordinates?.latitude) && Number.isFinite(coordinates?.longitude)
    ? `${coordinates.latitude.toFixed(4)}, ${coordinates.longitude.toFixed(4)}`
    : 'Unavailable';

  return (
    <article
      style={{
        background: 'var(--surface-container-low)',
        border: '1px solid var(--outline-variant)',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 className="font-display" style={{ fontSize: 16, margin: 0, fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.05em' }}>
            {flight.flightNumber}
          </h3>
          <span className="font-mono" style={{ fontSize: 11, color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>
            C/S: {flight.callsign}
          </span>
        </div>
        <span className={`hud-status-badge ${getStatusClass(flight.status)}`}>
          {flight.status}
        </span>
      </div>

      {hasRoute ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '4px 0' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="font-mono" style={{ fontSize: 16, fontWeight: 700, color: 'var(--on-surface)' }}>{flight.departureCode}</span>
            <span style={{ fontSize: 10, color: 'var(--on-surface-variant)' }}>Origin</span>
          </div>
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 12px' }}>
            <span className="font-mono" style={{ fontSize: 12, color: 'var(--surface-tint)' }}>{verticalLabel}</span>
            <span style={{ color: 'var(--surface-tint)' }}>→</span>
            <span style={{ fontSize: 10, color: 'var(--on-surface-variant)', marginTop: 4 }}>
              {verticalRate == null ? 'Vertical rate unavailable' : `${Math.round(verticalRate).toLocaleString()} ft/min`}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span className="font-mono" style={{ fontSize: 16, fontWeight: 700, color: 'var(--on-surface)' }}>{flight.arrivalCode}</span>
            <span style={{ fontSize: 10, color: 'var(--on-surface-variant)' }}>Destination</span>
          </div>
        </div>
      ) : (
        <div className="flight-observation-grid">
          <div className="flight-observation">
            <span>Operator</span>
            <strong>{flight.airline}</strong>
            <small>{flight.airlineCode !== '---' ? `ICAO ${flight.airlineCode}` : 'ICAO code unavailable'}</small>
          </div>
          <div className="flight-observation">
            <span>Observed position</span>
            <strong className="font-mono">{coordinateText}</strong>
          </div>
          <div className="flight-observation">
            <span>Observation time</span>
            <strong>{formatTimestamp(flight.lastUpdated)}</strong>
          </div>
          <div className="flight-observation">
            <span>Vertical rate · {verticalLabel}</span>
            <strong>{verticalRate == null ? 'Unavailable' : `${Math.round(verticalRate).toLocaleString()} ft/min`}</strong>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', borderTop: '1px dashed var(--outline-variant)', paddingTop: '10px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 9, color: 'var(--on-surface-variant)', fontFamily: 'var(--font-mono)' }}>ALTITUDE</span>
          <strong className="font-mono" style={{ fontSize: 12, color: 'var(--on-surface)' }}>{altText}</strong>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 9, color: 'var(--on-surface-variant)', fontFamily: 'var(--font-mono)' }}>SPEED</span>
          <strong className="font-mono" style={{ fontSize: 12, color: 'var(--on-surface)' }}>{speedText}</strong>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span style={{ fontSize: 9, color: 'var(--on-surface-variant)', fontFamily: 'var(--font-mono)' }}>HEADING</span>
          <strong className="font-mono" style={{ fontSize: 12, color: 'var(--on-surface)' }}>{headingText}</strong>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 10, color: 'var(--on-surface-variant)', borderTop: '1px solid var(--outline-variant)', paddingTop: '8px', marginTop: '4px' }}>
        <span>LIVE TELEMETRY: {String(flight.source).toUpperCase()}</span>
        <span>ICAO24: {flight.icao24}</span>
        <span>REGISTRATION (METADATA): <span className="flight-registration">{registration || 'Not available'}</span></span>
        <span>A/C TYPE (METADATA): {aircraftType || 'Not available'}</span>
        <span>ICAO TYPE: {flight.aircraftIcaoType === '---' ? 'Not available' : flight.aircraftIcaoType}</span>
      </div>
      <FlightDataSources flight={flight} />
    </article>
  );
}
