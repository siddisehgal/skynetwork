import { useEffect, useState } from 'react';
import { FlightMap as FlightMapView } from '../components/map/FlightMap';
import { OperationalSummary } from '../components/map/OperationalSummary';
import { MapFilters, applyMapFilters, defaultMapFilters } from '../components/map/MapFilters';
import { hasFlightPosition } from '../components/map/flightPosition';
import { useAirports } from '../hooks/useAirports';
import { useLiveFlights } from '../hooks/useLiveFlights';

export default function FlightMap() {
  const { flights, loading, error } = useLiveFlights();
const { airports, error: airportError } = useAirports();
const [filters, setFilters] = useState(defaultMapFilters);

const [mroFacilities, setMroFacilities] = useState([]);
const [mroLoading, setMroLoading] = useState(true);

useEffect(() => {
  const API_URL =
    import.meta.env.VITE_API_URL || 'http://localhost:5000';

  fetch(`${API_URL}/api/mro`)
    .then((res) => {
      if (!res.ok) {
        throw new Error('Failed to fetch MRO facilities');
      }
      return res.json();
    })
    .then((data) => {
      

      setMroFacilities(Array.isArray(data) ? data : []);
    })
    .catch((err) => {
      console.error('MRO map fetch error:', err);
      setMroFacilities([]);
    })
    .finally(() => {
      setMroLoading(false);
    });
}, []);

  const positionedFlights = flights.filter(hasFlightPosition);
  const filteredFlights = applyMapFilters(positionedFlights, filters);
  const hasMapData =
  filteredFlights.length > 0 ||
  airports.length > 0 ||
  mroFacilities.length > 0;

  return (
    <main style={{ padding: 'var(--margin-desktop)', maxWidth: 'var(--container-max)', margin: '0 auto' }}>
      <h1 className="font-display" style={{ fontSize: 32, fontWeight: 700, marginBottom: 4 }}>
        Flight Map
      </h1>
      <p className="label-caps" style={{ color: 'var(--on-surface-variant)', marginBottom: 24 }}>
        {loading
          ? 'Loading live positions…'
          : `${filteredFlights.length} of ${positionedFlights.length} live positions shown`}
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
      {!loading && positionedFlights.length > 0 && (
        <MapFilters flights={positionedFlights} filters={filters} onChange={setFilters} />
      )}
      {hasMapData && (
        <>
          <OperationalSummary flights={filteredFlights} />
          <FlightMapView
  flights={filteredFlights}
  airports={airports}
  mroFacilities={mroFacilities}
  showRoutes={filters.showRoutes}
/>
        </>
      )}
    </main>
  );
}