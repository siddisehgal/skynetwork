import React from 'react';
import { normalizeFlight } from '../utils/normalize';

// Helper to determine status badge classes
function getStatusClass(status) {
  const s = String(status).toUpperCase();
  if (s.includes('DELAY')) return 'hud-badge-delayed';
  if (s.includes('ACTIVE') || s.includes('IN-FLIGHT')) return 'hud-badge-active';
  if (s.includes('TIME')) return 'hud-badge-ontime';
  return 'hud-badge-error';
}

export function FlightCard({ flight: rawFlight }) {
  const flight = normalizeFlight(rawFlight);
  if (!flight) return null;

  // Formatting values
  const altText = flight.altitude != null ? `${Math.round(flight.altitude).toLocaleString()} ft` : '---';
  const speedText = flight.speed != null ? `${Math.round(flight.speed)} kt` : '---';
  const headingText = flight.heading != null ? `${Math.round(flight.heading)}°` : '---';
  
  // Vertical rate arrow
  let vRateArrow = '→';
  let vRateText = 'CRUISE';
  if (flight.verticalRate > 100) {
    vRateArrow = '↗';
    vRateText = 'CLIMB';
  } else if (flight.verticalRate < -100) {
    vRateArrow = '↘';
    vRateText = 'DESCENT';
  }

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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '4px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="font-mono" style={{ fontSize: 16, fontWeight: 700, color: 'var(--on-surface)' }}>
            {flight.departureCode || '---'}
          </span>
          <span style={{ fontSize: 10, color: 'var(--on-surface-variant)' }}>Origin</span>
        </div>
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 12px' }}>
          <span className="font-mono" style={{ fontSize: 12, color: 'var(--surface-tint)' }}>
            {vRateArrow} {vRateText}
          </span>
          <div className="hud-progress-track">
            <div className="hud-progress-fill" style={{ width: `${flight.progress || 0}%` }} />
          </div>
          <span style={{ fontSize: 10, color: 'var(--on-surface-variant)', marginTop: 4 }}>
            {flight.progress || 0}% Complete
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span className="font-mono" style={{ fontSize: 16, fontWeight: 700, color: 'var(--on-surface)' }}>
            {flight.arrivalCode || '---'}
          </span>
          <span style={{ fontSize: 10, color: 'var(--on-surface-variant)' }}>Destination</span>
        </div>
      </div>

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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10, color: 'var(--on-surface-variant)', borderTop: '1px solid var(--outline-variant)', paddingTop: '8px', marginTop: '4px' }}>
        <span>SRC: {String(flight.source).toUpperCase()}</span>
        <span>A/C: {flight.aircraft}</span>
      </div>
    </article>
  );
}
