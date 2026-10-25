import { formatTimestamp } from './map/flightTelemetry';

const LABELS = {
  LIVE: 'LIVE',
  STALE: 'STALE',
  DEMO: 'DEMO / FALLBACK',
};

export function DataFreshness({ freshness, source, snapshotTimestamp, sourceTimestamp, error, errorCode }) {
  const label = LABELS[freshness] || 'CONNECTING';
  const time = sourceTimestamp || snapshotTimestamp;

  return (
    <div className={`data-freshness data-freshness-${String(freshness || 'pending').toLowerCase()}`} role="status">
      <strong>{label}</strong>
      <span>{source || 'Awaiting source'}</span>
      <span>Source time: {formatTimestamp(sourceTimestamp)}</span>
      {freshness === 'STALE' && <span>Snapshot: {formatTimestamp(time)}</span>}
      {freshness === 'DEMO' && <span>Demo snapshot: {formatTimestamp(snapshotTimestamp)}</span>}
      {error && <span className="data-freshness-error">{errorCode ? `${errorCode}: ` : ''}{error}</span>}
    </div>
  );
}