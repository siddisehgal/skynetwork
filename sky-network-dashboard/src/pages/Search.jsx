import React, { useState } from 'react';
import { FlightCard } from '../components/FlightCard';
import { AircraftMetadataAttribution } from '../components/AircraftMetadataAttribution';
import { SearchBar } from '../components/SearchBar';
import { DashboardCard } from '../components/DashboardCard';
import { DataFreshness } from '../components/DataFreshness';
import { Pagination } from '../components/Pagination';
import { useLiveFlights } from '../hooks/useLiveFlights';
import { filterFlights } from '../utils/filterFlights';

const initialFilters = {
  flightNumber: '',
  callsign: '',
  airline: '',
  origin: '',
  destination: '',
  aircraftRegistration: '',
  status: '',
};

export default function Search() {
  const { flights, freshness, source, snapshotTimestamp, sourceTimestamp, sourceError, sourceErrorCode } = useLiveFlights();
  const [filters, setFilters] = useState(initialFilters);
  const [submitted, setSubmitted] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 30;
  const results = submitted ? filterFlights(flights, filters) : null;
  const currentPage = Math.min(page, Math.max(0, Math.ceil((results?.length || 0) / pageSize) - 1));
  const visibleResults = results?.slice(currentPage * pageSize, (currentPage + 1) * pageSize) || [];

  function updateFilter(event) {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
    setPage(0);
  }

  function handleSubmit(event) {
    if (event) event.preventDefault();
    setSubmitted(true);
    setPage(0);
  }

  function clearSearch() {
    setFilters(initialFilters);
    setSubmitted(false);
    setPage(0);
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--gutter)',
      }}
    >
      {/* Title */}
      <div>
        <h1
          className="font-display glow-cyan"
          style={{
            fontSize: 24,
            fontWeight: 700,
            margin: 0,
          }}
        >
          GLOBAL FLIGHT SEARCH
        </h1>

        <p
          className="label-caps"
          style={{
            color: 'var(--on-surface-variant)',
            marginTop: 4,
          }}
        >
          Search tracked network nodes
        </p>
        <DataFreshness freshness={freshness} source={source} snapshotTimestamp={snapshotTimestamp} sourceTimestamp={sourceTimestamp} error={sourceError} errorCode={sourceErrorCode} />
      </div>

      {/* Global Operations Search Card */}
      <DashboardCard
        title="Global Operations Search"
        icon={
          <svg
            viewBox="0 0 24 24"
            style={{
              width: 16,
              height: 16,
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: 2,
              marginRight: 6,
            }}
          >
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
          loading={false}
        />
      </DashboardCard>

      {/* Results Panel */}
      {results && (
        <DashboardCard
          title={`Query Results (${results.length} matching records in ${flights.length})`}
        >
          {results.length === 0 ? (
            <div className="hud-empty-state">
              <span className="hud-empty-icon">🔍</span>

              <h3
                style={{
                  margin: 0,
                  color: 'var(--on-surface)',
                }}
              >
                NO RESULTS FOUND
              </h3>

              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                }}
              >
                No tracked trajectories match the provided filter parameters.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 'var(--gutter)',
              }}
            >
              {visibleResults.map((flight) => (
                <FlightCard key={flight.id} flight={flight} />
              ))}
            </div>
          )}
          <Pagination page={currentPage} pageSize={pageSize} total={results.length} onPageChange={setPage} />
          {results.length > 0 && <AircraftMetadataAttribution />}
        </DashboardCard>
      )}
    </div>
  );
}
