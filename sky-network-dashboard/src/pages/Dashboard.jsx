import React from 'react';
import { FlightCard } from '../components/FlightCard';
import { AircraftMetadataAttribution } from '../components/AircraftMetadataAttribution';
import { StatsCard } from '../components/StatsCard';
import { DashboardCard } from '../components/DashboardCard';
import { DataFreshness } from '../components/DataFreshness';
import { Pagination } from '../components/Pagination';
import { useLiveFlights } from '../hooks/useLiveFlights';


// Skeleton Loader components for high-fidelity loading states
function StatsSkeleton() {
  return (
    <div className="hud-stats-grid">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="hud-stat-card" style={{ height: 96, position: 'relative' }}>
          <div className="hud-skeleton" style={{ height: 12, width: '60%', marginBottom: 16 }} />
          <div className="hud-skeleton" style={{ height: 28, width: '40%', marginBottom: 8 }} />
          <div className="hud-skeleton" style={{ height: 10, width: '80%' }} />
        </div>
      ))}
    </div>
  );
}

function FlightGridSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--gutter)' }}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
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

// MRO Facilities Integration Placeholder Structure (User Adjustment #1)
function MroFacilitiesStatus() {
  const [facilities, setFacilities] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    fetch(`${API_URL}/api/mro`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch MRO facilities');
        return res.json();
      })
      .then((data) => {
        setFacilities(Array.isArray(data) ? data : []);
        setError(false);
      })
      .catch((err) => {
        console.error('MRO fetch error:', err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
      <h3
        className="font-display"
        style={{
          fontSize: 12,
          fontWeight: 700,
          textTransform: 'uppercase',
          color: 'var(--on-surface-variant)',
          borderTop: '1px solid var(--outline-variant)',
          paddingTop: 16,
          margin: 0,
          letterSpacing: '0.05em'
        }}
      >
        MRO Facilities Status
      </h3>

      {loading ? (
        <div
          style={{
            padding: 16,
            textAlign: 'center',
            color: 'var(--on-surface-variant)',
            fontSize: 11
          }}
        >
          Loading MRO facilities...
        </div>
      ) : error ? (
        <div
          style={{
            padding: 16,
            textAlign: 'center',
            color: 'var(--error)',
            fontSize: 11
          }}
        >
          Unable to load MRO facilities.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {facilities.slice(0, 5).map((facility) => (
            <div
              key={facility.id}
              style={{
                border: '1px solid var(--outline-variant)',
                borderRadius: 'var(--radius-md)',
                padding: 12,
                background: 'var(--surface-container-low)',
                color: 'var(--on-surface)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <strong
                  style={{
                    fontSize: 11,
                    color: 'var(--on-surface)'
                  }}
                >
                  {facility.name}
                </strong>

                <span
                  style={{
                    fontSize: 9,
                    color: 'var(--secondary-fixed-dim)'
                  }}
                >
                  ONLINE
                </span>
              </div>

              <div
                style={{
                  fontSize: 10,
                  color: 'var(--on-surface-variant)',
                  marginTop: 5
                }}
              >
                {facility.city}, {facility.country}
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 8,
                  fontSize: 9,
                  color: 'var(--on-surface-variant)'
                }}
              >
                <span>Hangars: {facility.hangars}</span>
                <span>Capacity: {facility.annual_capacity}/yr</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default function Dashboard() {
  const { flights, snapshotTimestamp, sourceTimestamp, freshness, source, loading, error, sourceError, sourceErrorCode } = useLiveFlights();
  const [page, setPage] = React.useState(0);
  const pageSize = 30;
  const pageCount = Math.ceil(flights.length / pageSize);
  const currentPage = Math.min(page, Math.max(0, pageCount - 1));
  const visibleFlights = flights.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const totalCount = flights.length;
  const airborneCount = flights.filter((flight) => flight.status === 'IN-FLIGHT').length;
  const groundCount = flights.filter((flight) => flight.status === 'ON-GROUND').length;

  const uniqueCarriers = new Set(
    flights.map(f => f.airlineCode).filter(c => c && c !== '---')
  ).size;
  const unknownOperatorCount = flights.filter(
    (flight) => !flight.airlineCode || flight.airlineCode === '---' || flight.operatorUnknown
  ).length;

  const uniqueCountries = new Set(
    flights.map(f => f.country).filter(c => c && c !== '---')
  ).size;

  const lastUpdatedString = sourceTimestamp
  ? new Date(sourceTimestamp).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  : 'Pending update';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gutter)' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1
            className="font-display glow-cyan"
            style={{ fontSize: 24, fontWeight: 700, margin: 0 }}
          >
            LIVE OPERATION CENTER
          </h1>

          <p
            className="label-caps"
            style={{ color: 'var(--on-surface-variant)', marginTop: 4 }}
          >
            System radar tracking telemetry
          </p>
          <DataFreshness
            freshness={freshness}
            source={source}
            snapshotTimestamp={snapshotTimestamp}
            sourceTimestamp={sourceTimestamp}
            error={sourceError || error}
            errorCode={sourceErrorCode}
          />
        </div>
      </div>

      {loading && flights.length === 0 ? (
        <StatsSkeleton />
      ) : (
        <div className="hud-stats-grid">
          <StatsCard
            label="Active Trajectories"
            value={totalCount}
            subtext="Tracked network nodes"
            variant="primary"
          />

          <StatsCard
            label="Airborne"
            value={airborneCount}
            subtext="Reported in flight"
            variant="secondary"
          />

          <StatsCard
            label="On Ground"
            value={groundCount}
            subtext="Reported on ground"
            variant="tertiary"
          />

          <StatsCard
            label="Known Carriers"
            value={uniqueCarriers || '---'}
            subtext="Distinct ICAO operator codes"
            variant="secondary"
          />

          <StatsCard
            label="Unknown Operators"
            value={unknownOperatorCount}
            subtext="No exact ICAO prefix match"
            variant="tertiary"
          />

          <StatsCard
            label="Countries Represented"
            value={uniqueCountries || '---'}
            subtext="Country boundaries crossed"
            variant="primary"
          />
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: 'var(--gutter)',
          alignItems: 'start'
        }}
      >

        <DashboardCard
          title="Live Trajectory Monitor"
          icon={
            <span
              style={{
                marginRight: 6,
                display: 'inline-block',
                width: 8,
                height: 8,
                background: 'var(--surface-tint)',
                borderRadius: '50%'
              }}
            />
          }
          headerActions={
            <span
              className="label-caps"
              style={{
                fontSize: 10,
                color: 'var(--on-surface-variant)'
              }}
            >
              {loading ? 'Refreshing...' : `${totalCount} records`}
            </span>
          }
        >
          {error && (
            <div
              style={{
                background: 'var(--error-container)',
                color: 'var(--on-error-container)',
                padding: 16,
                borderRadius: 'var(--radius-md)',
                marginBottom: 16,
                fontSize: 13,
                border: '1px solid var(--error)'
              }}
            >
              <strong>SYSTEM FAULT:</strong> Couldn't reach API server.
            </div>
          )}

          {loading && flights.length === 0 ? (
            <FlightGridSkeleton />
          ) : flights.length === 0 ? (
            <div className="hud-empty-state">
              <span className="hud-empty-icon">📡</span>
              <h3 style={{ margin: 0, color: 'var(--on-surface)' }}>
                NO ACTIVE TRAJECTORIES
              </h3>
              <p style={{ margin: 0, fontSize: 12 }}>
                Check backend services configuration. No flights currently tracked in sector.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 'var(--gutter)'
              }}
            >
              {visibleFlights.map((flight) => (
                <FlightCard key={flight.id} flight={flight} />
              ))}
            </div>
          )}
          {!loading && flights.length > 0 && (
            <Pagination page={currentPage} pageSize={pageSize} total={totalCount} onPageChange={setPage} />
          )}
          {flights.length > 0 && <AircraftMetadataAttribution />}
        </DashboardCard>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--gutter)'
          }}
        >
          <DashboardCard title="Data Connection status">

            <div className="hud-connection-panel">

              <div className="hud-connection-row">
                <span className="hud-connection-label">
                  API Status
                </span>

                <span
                  className="hud-connection-value"
                  style={{
                    color: error
                      ? 'var(--error)'
                      : 'var(--secondary-fixed-dim)'
                  }}
                >
                  {error ? 'API UNAVAILABLE' : freshness || 'CONNECTING'}
                </span>
              </div>

              <div className="hud-connection-row">
                <span className="hud-connection-label">
                  Data Source
                </span>

                <span className="hud-connection-value">
                  {source || 'Awaiting source'}
                </span>
              </div>

              <div className="hud-connection-row">
                <span className="hud-connection-label">
                  Last telemetry sync
                </span>

                <span className="hud-connection-value">
                  Snapshot: {snapshotTimestamp ? new Date(snapshotTimestamp).toLocaleString() : 'Pending'}
                  <br />Source: {lastUpdatedString}
                </span>
              </div>

              <div className="hud-connection-row">
                <span className="hud-connection-label">
                  Connection link
                </span>

                <span
                  className="hud-connection-value"
                  style={{
                    color: 'var(--secondary-fixed-dim)'
                  }}
                >
                  {error ? 'DISCONNECTED' : 'REST API'}
                </span>
              </div>

            </div>

            <MroFacilitiesStatus />

          </DashboardCard>
        </div>

      </div>
    </div>
  );
}
