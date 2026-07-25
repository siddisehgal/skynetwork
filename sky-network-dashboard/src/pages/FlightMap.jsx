import { FlightMap as FlightMapView } from '../components/map/FlightMap';
import { OperationalSummary } from '../components/map/OperationalSummary';
import { hasFlightPosition } from '../components/map/flightPosition';
import { useAirports } from '../hooks/useAirports';
import { useLiveFlights } from '../hooks/useLiveFlights';

export default function FlightMap() {
  const { flights, loading, error } = useLiveFlights();
  const { airports, error: airportError } = useAirports();
  const positionedFlights = flights.filter(hasFlightPosition);
  const hasMapData = positionedFlights.length > 0 || airports.length > 0;

  return (
    <main style={{ padding: 'var(--margin-desktop)', maxWidth: 'var(--container-max)', margin: '0 auto' }}>
      <h1 className="font-display" style={{ fontSize: 32, fontWeight: 700, marginBottom: 4 }}>
        Flight Map
      </h1>
      <p className="label-caps" style={{ color: 'var(--on-surface-variant)', marginBottom: 24 }}>
        {loading ? 'Loading live positions…' : `${positionedFlights.length} live positions`}
      </p>

      {error && (
        <div style={{ background: 'var(--error-container)', borderRadius: 'var(--radius-md)', color: 'var(--on-error-container)', marginBottom: 16, padding: 16 }}>
          Couldn&apos;t refresh flight positions: {error}
        </div>
      )}
      {airportError && (
        <div style={{ background: 'var(--surface-container-high)', border: '1px solid var(--outline-variant)', borderRadius: 'var(--radius-md)', color: 'var(--on-surface-variant)', marginBottom: 16, padding: 16 }}>
          Airport intelligence is temporarily unavailable: {airportError}
        </div>
      )}

      {loading && flights.length === 0 && airports.length === 0 && (
        <div className="map-loading-state" role="status">
          <span className="map-loading-indicator" aria-hidden="true" />
          <span className="label-caps">Loading the world map…</span>
        </div>
      )}
      {!loading && !hasMapData && (
        <div className="map-empty-state">
          No live aircraft or airport positions are available right now. Please try again shortly.
        </div>
      )}
      {hasMapData && (
        <>
          <OperationalSummary flights={positionedFlights} />
          <FlightMapView flights={positionedFlights} airports={airports} />
        </>
      )}
    </main>
  );
}
