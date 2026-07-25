import React, { useEffect, useRef, useState } from 'react';
import { searchFlights } from '../api/client';
import { FlightCard } from '../components/FlightCard';
import { SearchBar } from '../components/SearchBar';
import { DashboardCard } from '../components/DashboardCard';
import { normalizeFlights } from '../utils/normalize';

const initialFilters = {
  flightNumber: '',
  callsign: '',
  airline: '',
  origin: '',
  destination: '',
  aircraftRegistration: '',
  status: '',
};

function SearchSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--gutter)' }}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="hud-panel" style={{ height: 160, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div className="hud-skeleton" style={{ height: 16, width: '40%' }} />
            <div className="hud-skeleton" style={{ height: 16, width: '20%' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '12px 0' }}>
            <div className="hud-skeleton" style={{ height: 24, width: '25%' }} />
            <div className="hud-skeleton" style={{ height: 10, width: '30%' }} />
            <div className="hud-skeleton" style={{ height: 24, width: '25%' }} />
          </div>
          <div className="hud-skeleton" style={{ height: 20, width: '100%' }} />
        </div>
      ))}
    </div>
  );
}

export default function Search() {
  const [filters, setFilters] = useState(initialFilters);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);
  const latestRequestRef = useRef(0);

  useEffect(() => () => controllerRef.current?.abort(), []);

  function updateFilter(event) {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    if (event) event.preventDefault();
    controllerRef.current?.abort();
    const controller = new AbortController();
    const requestId = latestRequestRef.current + 1;
    controllerRef.current = controller;
    latestRequestRef.current = requestId;
    setLoading(true);
    setError(null);

    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value.trim() !== ''),
      );
      const response = await searchFlights({ ...activeFilters, limit: 50, offset: 0 }, { signal: controller.signal });
      if (requestId === latestRequestRef.current) {
        setResults(response.data);
      }
    } catch (requestError) {
      if (requestId === latestRequestRef.current && requestError?.code !== 'ERR_CANCELED') {
        setError(requestError instanceof Error ? requestError.message : 'Unable to search flights');
        setResults(null);
      }
    } finally {
      if (requestId === latestRequestRef.current) setLoading(false);
    }
  }

  function clearSearch() {
    controllerRef.current?.abort();
    latestRequestRef.current += 1;
    setFilters(initialFilters);
    setResults(null);
    setError(null);
  }

  // Normalize search results
  const normalizedResults = results ? normalizeFlights(results) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gutter)' }}>
      {/* Title */}
      <div>
        <h1 className="font-display glow-cyan" style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
          GLOBAL FLIGHT SEARCH
        </h1>
        <p className="label-caps" style={{ color: 'var(--on-surface-variant)', marginTop: 4 }}>
          Search tracked network nodes
        </p>
      </div>

      {/* Global Operations Search Card */}
      <DashboardCard
        title="Global Operations Search"
        icon={
          <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, fill: 'none', stroke: 'currentColor', strokeWidth: 2, marginRight: 6 }}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        }
      >
        <SearchBar
          filters={filters}
          onChange={updateFilter}
          onSubmit={handleSubmit}
          onClear={clearSearch}
          loading={loading}
        />
      </DashboardCard>

      {/* Error State */}
      {error && (
        <div style={{ background: 'var(--error-container)', color: 'var(--on-error-container)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--error)', fontSize: 13 }}>
          <strong>SEARCH FAULT:</strong> Couldn&apos;t execute query. Details: {error}
        </div>
      )}

      {/* Results Panel */}
      {(loading || normalizedResults) && (
        <DashboardCard
          title={loading ? "Executing Search Query..." : `Query Results (${normalizedResults.length} matching nodes)`}
        >
          {loading ? (
            <SearchSkeleton />
          ) : normalizedResults.length === 0 ? (
            <div className="hud-empty-state">
              <span className="hud-empty-icon">🔍</span>
              <h3 style={{ margin: 0, color: 'var(--on-surface)' }}>NO RESULTS FOUND</h3>
              <p style={{ margin: 0, fontSize: 12 }}>No tracked trajectories match the provided filter parameters.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--gutter)' }}>
              {normalizedResults.map((flight) => (
                <FlightCard key={flight.id} flight={flight} />
              ))}
            </div>
          )}
        </DashboardCard>
      )}
    </div>
  );
}
