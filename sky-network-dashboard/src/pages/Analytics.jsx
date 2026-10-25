import React from 'react';
import { StatsCard } from '../components/StatsCard';
import { DashboardCard } from '../components/DashboardCard';
import { FlightList } from '../components/FlightList';
import { CategoryBreakdown } from '../components/charts/CategoryBreakdown';
import { analyticsSnapshot } from '../utils/analyticsSnapshot';
import './Analytics.css';
import { useLiveFlights } from '../hooks/useLiveFlights';
import { FlightMap } from '../components/map/FlightMap';
import { DataFreshness } from '../components/DataFreshness';
import { useFlightSelection } from '../hooks/useFlightSelection';

function AnalyticsSkeleton() {
  return (
    <div className="analytics-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gutter)' }}>
      <div className="hud-stats-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="hud-stat-card" style={{ height: 96 }}>
            <div className="hud-skeleton" style={{ height: 12, width: '60%', marginBottom: 16 }} />
            <div className="hud-skeleton" style={{ height: 28, width: '40%' }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--gutter)' }}>
        <div className="hud-panel" style={{ height: 220, padding: 16 }}>
          <div className="hud-skeleton" style={{ height: 20, width: '40%', marginBottom: 24 }} />
          <div className="hud-skeleton" style={{ height: 16, width: '80%', marginBottom: 12 }} />
          <div className="hud-skeleton" style={{ height: 16, width: '60%', marginBottom: 12 }} />
          <div className="hud-skeleton" style={{ height: 16, width: '70%' }} />
        </div>
        <div className="hud-panel" style={{ height: 220, padding: 16 }}>
          <div className="hud-skeleton" style={{ height: 20, width: '45%', marginBottom: 24 }} />
          <div className="hud-skeleton" style={{ height: 16, width: '75%', marginBottom: 12 }} />
          <div className="hud-skeleton" style={{ height: 16, width: '65%', marginBottom: 12 }} />
          <div className="hud-skeleton" style={{ height: 16, width: '80%' }} />
        </div>
      </div>
    </div>
  );
}

export default function Analytics() {
  const { flights, loading, error, freshness, source, snapshotTimestamp, sourceTimestamp, sourceError, sourceErrorCode } = useLiveFlights();
  const { selectedKey, selectionRevision, selectFlight } = useFlightSelection(flights);
  const stats = analyticsSnapshot(flights);
  const { airborne, averageAltitude, averageSpeed } = stats;
  const totalFlights = stats.total;
  const hasData = flights.length > 0;

  if (loading && flights.length === 0) {
    return (
      <div className="analytics-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gutter)' }}>
        <div>
          <h1 className="font-display glow-cyan" style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
            OPERATIONAL ANALYTICS
          </h1>
          <p className="label-caps" style={{ color: 'var(--on-surface-variant)', marginTop: 4 }}>
            Loading the current flight snapshot...
          </p>
        </div>
        <AnalyticsSkeleton />
      </div>
    );
  }

  return (
    <div className="analytics-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gutter)' }}>
      {/* Snapshot status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="font-display glow-cyan" style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
            OPERATIONAL ANALYTICS
          </h1>
          <p className="label-caps" style={{ color: 'var(--on-surface-variant)', marginTop: 4 }}>
            Metrics calculated from the current flight snapshot
          </p>
        </div>
      </div>
      <DataFreshness freshness={freshness} source={source} snapshotTimestamp={snapshotTimestamp} sourceTimestamp={sourceTimestamp} error={sourceError || error} errorCode={sourceErrorCode} />

      {/* Error state with fallback */}
      {error && flights.length === 0 && (
        <div style={{ background: 'var(--error-container)', color: 'var(--on-error-container)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--error)', fontSize: 13 }}>
          <p style={{ fontWeight: 700, margin: '0 0 4px' }}>TELEMETRY ACCESS FAULT</p>
          <p style={{ margin: '0 0 12px' }}>Could not reach the operational analytics API. Error: {error}</p>
        </div>
      )}

      {/* Empty State Fallback (No active data in API) */}
      {!hasData && !loading && (
        <div className="hud-empty-state">
          <span className="hud-empty-icon">📊</span>
          <h3 style={{ margin: 0, color: 'var(--on-surface)' }}>NO OPERATIONAL ANALYTICS AVAILABLE</h3>
          <p style={{ margin: 0, fontSize: 12, maxWidth: 440 }}>
            The API endpoint is online but returned no active tracking records. Feeds are currently empty.
          </p>
        </div>
      )}

      {/* Stats Cards Dashboard Grid */}
      {hasData && (
        <>
          <div className="hud-stats-grid">

  <StatsCard
  label="Aircraft in snapshot"
  value={totalFlights ?? '---'}
  subtext="Current snapshot records"
  variant="primary"
/>


  <StatsCard
    label="Airborne"
    value={airborne}
    subtext="Reported in flight"
    variant="secondary"
  />


  <StatsCard
  label="Mean altitude"
  value={
    averageAltitude != null
      ? `${Math.round(averageAltitude).toLocaleString()} ft`
      : '---'
  }
  subtext="Among records with altitude"
  variant="primary"
/>


  <StatsCard
  label="Mean Ground Speed"
  value={
    averageSpeed != null
      ? `${Math.round(averageSpeed)} kt`
      : '---'
  }
  subtext="Mean node velocity"
  variant="secondary"
/>

</div>

<DashboardCard title="Live Airspace Tracking">
  <div className="analytics-tracking-grid">
    {/* Live Map */}
    <FlightMap
    flights={flights}
    showAttribution={false}
    selectedKey={selectedKey}
    selectionRevision={selectionRevision}
    onSelectFlight={selectFlight}
/>

    {/* Flight List */}
    <div
      style={{
        maxHeight: '500px',
        overflowY: 'auto',
        borderLeft: '1px solid var(--outline)',
        paddingLeft: '16px',
      }}
    >
      <FlightList
    flights={flights}
    selectedKey={selectedKey}
    selectionRevision={selectionRevision}
    onSelectFlight={selectFlight}
/>
    </div>
  </div>
</DashboardCard>

{/* All breakdowns and status totals derive from the same flights snapshot. */}
          <div className="analytics-breakdowns">
            <DashboardCard title="Operators by callsign prefix">
              <CategoryBreakdown categories={stats.operators} label="Operators" />
            </DashboardCard>
            <DashboardCard title="Flight Status Distribution">
              <CategoryBreakdown categories={stats.statuses} label="Flight statuses" />
              <div className="analytics-total"><span>Total tracked</span><strong>{stats.total.toLocaleString()}</strong></div>
            </DashboardCard>
            <DashboardCard title="Aircraft Registration Countries">
              <p className="analytics-caption">Grouped by OpenSky origin_country, the aircraft registration country. This is not the aircraft's current location. Missing countries are shown as unknown.</p>
              <CategoryBreakdown categories={stats.countries} label="Aircraft registration countries" unit="aircraft" />
            </DashboardCard>
          </div>
        </>
      )}
    </div>
  );
}
