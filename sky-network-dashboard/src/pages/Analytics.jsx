import React, { useState } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import { StatsCard } from '../components/StatsCard';
import { DashboardCard } from '../components/DashboardCard';
import { LiveFlightMap } from '../components/LiveFlightMap';
import { FlightList } from "../components/FlightList";
import { BarChart } from '../components/charts/BarChart';

// Labeled temporary development mock data to help check dashboard UI/UX when API is offline
const DEV_MOCK_STATS = {
  totalFlights: 245,
  alertRate: '4.8%',
  averageAltitude: 31200,
  averageSpeed: 440,
  activeSectors: 12,
  carrierShare: [
    { code: 'AAL', name: 'American Airlines', count: 68 },
    { code: 'BAW', name: 'British Airways', count: 52 },
    { code: 'DLH', name: 'Lufthansa', count: 48 },
    { code: 'SIA', name: 'Singapore Airlines', count: 32 },
  ],
  sectorLoad: [
    { country: 'United Kingdom', count: 74, status: 'HIGH LOAD', color: 'var(--tertiary-fixed-dim)' },
    { country: 'United States', count: 110, status: 'NOMINAL', color: 'var(--secondary-fixed-dim)' },
    { country: 'Germany', count: 45, status: 'NOMINAL', color: 'var(--secondary-fixed-dim)' },
    { country: 'Japan', count: 16, status: 'LOW LOAD', color: 'var(--outline)' },
  ]
};

function AnalyticsSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gutter)' }}>
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
  const { stats: apiStats, loading, error } = useAnalytics();
  const [devMode, setDevMode] = useState(false);

  const stats = devMode ? DEV_MOCK_STATS : apiStats;

  // Safe checks for potentially missing/stabilizing API keys
  const totalFlights = stats?.totalFlights ?? stats?.total_flights ?? stats?.activeFlights ?? null;
  const alertRate = stats?.alertRate ?? stats?.delayedRate ?? (stats?.delayedFlights && stats?.totalFlights ? `${Math.round((stats.delayedFlights / stats.totalFlights) * 100)}%` : null);
  const averageAltitude = stats?.averageAltitude ?? stats?.avgAltitude ?? null;
  const averageSpeed = stats?.averageSpeed ?? stats?.avgSpeed ?? null;
  const activeSectors = stats?.activeSectors ?? stats?.sectorsCount ?? null;

  const hasData = totalFlights != null || activeSectors != null;

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gutter)' }}>
        <div>
          <h1 className="font-display glow-cyan" style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
            OPERATIONAL ANALYTICS
          </h1>
          <p className="label-caps" style={{ color: 'var(--on-surface-variant)', marginTop: 4 }}>
            Querying server statistics...
          </p>
        </div>
        <AnalyticsSkeleton />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gutter)' }}>
      {/* Title block with dev mode toggle banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="font-display glow-cyan" style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
            OPERATIONAL ANALYTICS
          </h1>
          <p className="label-caps" style={{ color: 'var(--on-surface-variant)', marginTop: 4 }}>
            Control center network throughput metrics
          </p>
        </div>

        {/* Development Mode Toggle Badge */}
        <button
          onClick={() => setDevMode(!devMode)}
          className={`hud-btn ${devMode ? 'hud-btn-primary' : 'hud-btn-outline'}`}
          style={{ height: 32, fontSize: 10, padding: '0 12px' }}
        >
          {devMode ? 'Switch to Live API Mode' : 'Preview with Development Data'}
        </button>
      </div>

      {/* Development Banner Warning */}
      {devMode && (
        <div style={{ background: 'rgba(255, 186, 32, 0.1)', color: 'var(--tertiary-fixed-dim)', padding: '10px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--tertiary-fixed-dim)', fontSize: 12 }}>
          ⚠️ <strong>DEVELOPMENT PREVIEW:</strong> Displaying temporary mock data. Turn off preview mode to view active API stats.
        </div>
      )}

      {/* Error state with fallback */}
      {error && !devMode && (
        <div style={{ background: 'var(--error-container)', color: 'var(--on-error-container)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--error)', fontSize: 13 }}>
          <p style={{ fontWeight: 700, margin: '0 0 4px' }}>TELEMETRY ACCESS FAULT</p>
          <p style={{ margin: '0 0 12px' }}>Could not reach the operational analytics API. Error: {error}</p>
          <button
            onClick={() => setDevMode(true)}
            className="hud-btn hud-btn-outline"
            style={{ height: 30, fontSize: 10, padding: '0 12px', background: 'rgba(0,0,0,0.2)' }}
          >
            Load Temporary Development Data
          </button>
        </div>
      )}

      {/* Empty State Fallback (No active data in API) */}
      {!hasData && !error && !devMode && (
        <div className="hud-empty-state">
          <span className="hud-empty-icon">📊</span>
          <h3 style={{ margin: 0, color: 'var(--on-surface)' }}>NO OPERATIONAL ANALYTICS AVAILABLE</h3>
          <p style={{ margin: 0, fontSize: 12, maxWidth: 440 }}>
            The API endpoint is online but returned no active tracking records. Feeds are currently empty.
          </p>
          <button
            onClick={() => setDevMode(true)}
            className="hud-btn hud-btn-primary"
            style={{ marginTop: 8 }}
          >
            Load Temporary Development Data
          </button>
        </div>
      )}

      {/* Stats Cards Dashboard Grid */}
      {hasData && (
        <>
          <div className="hud-stats-grid">

  <StatsCard
    label="Total Nodes Analyzed"
    value={totalFlights ?? '---'}
    subtext="Total cumulative logs"
    variant="primary"
  />


  <StatsCard
    label="Network Alert Rate"
    value={alertRate ?? '0.0%'}
    subtext="Gaps & delay anomalies"
    variant={
      alertRate && parseFloat(alertRate) > 5
        ? 'error'
        : 'secondary'
    }
  />


  <StatsCard
    label="Sector Altitudes"
    value={
      averageAltitude
        ? `${Math.round(averageAltitude).toLocaleString()} ft`
        : '---'
    }
    subtext="Mean cruising altitude"
    variant="primary"
  />


  <StatsCard
    label="Mean Ground Speed"
    value={
      averageSpeed
        ? `${Math.round(averageSpeed)} kt`
        : '---'
    }
    subtext="Mean node velocity"
    variant="secondary"
  />


  <StatsCard
    label="Network Health"
    value={
      stats?.networkHealth
        ? `${stats.networkHealth.score}/100`
        : '---'
    }
    subtext={
      stats?.networkHealth?.status ||
      'Awaiting telemetry'
    }
    variant={
      stats?.networkHealth?.status === 'OPTIMAL'
        ? 'secondary'
        : 'tertiary'
    }
  />

</div>

<DashboardCard title="Live Airspace Tracking">
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '3fr 1fr',
      gap: '16px',
      alignItems: 'start',
    }}
  >
    {/* Live Map */}
    <LiveFlightMap
      flights={stats?.flights || []}
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
        flights={stats?.flights || []}
      />
    </div>
  </div>
</DashboardCard>

{/* Detailed breakdowns */}
<div
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 'var(--gutter)',
  }}
></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--gutter)' }}>
            
            {/* Airline shares panel */}
            <DashboardCard title="Active carrier throughput share">
              {stats?.carrierShare && stats.carrierShare.length > 0 ? (
                <>
                  <BarChart
                    data={stats.carrierShare.map((c) => ({ label: c.code, value: c.count, color: 'var(--surface-tint)' }))}
                    height={140}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
                  {stats.carrierShare.map((c) => (
                    <div key={c.code} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8, borderBottom: '1px solid var(--outline-variant)' }}>
                      <div>
                        <strong style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>{c.code}</strong>
                        <span style={{ fontSize: 11, color: 'var(--on-surface-variant)', marginLeft: 8 }}>{c.name}</span>
                      </div>
                      <span className="font-mono" style={{ fontSize: 13, fontWeight: 700 }}>
                        {c.count} flights
                      </span>
                    </div>
                  ))}
                  </div>
                </>
              ) : (
                <p style={{ fontSize: 12, color: 'var(--on-surface-variant)', textAlign: 'center', margin: '20px 0' }}>
                  No airline breakdown statistics available from current endpoint.
                </p>
              )}
            </DashboardCard>

            <DashboardCard title="Flight Status Distribution">

  {stats?.flightStatus ? (

    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}
    >

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span className="label-caps">
          IN FLIGHT
        </span>

        <strong
          className="font-mono"
          style={{
            fontSize: 14
          }}
        >
          {stats.flightStatus.inFlight}
        </strong>
      </div>


      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span className="label-caps">
          DELAYED
        </span>

        <strong
          className="font-mono"
          style={{
            fontSize: 14
          }}
        >
          {stats.flightStatus.delayed}
        </strong>
      </div>


      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span className="label-caps">
          OTHER
        </span>

        <strong
          className="font-mono"
          style={{
            fontSize: 14
          }}
        >
          {
            stats.flightStatus.total -
            stats.flightStatus.inFlight -
            stats.flightStatus.delayed
          }
        </strong>
      </div>


      <div
        style={{
          marginTop: 8,
          paddingTop: 8,
          borderTop: '1px solid var(--outline-variant)',
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <span className="label-caps">
          TOTAL TRACKED
        </span>

        <strong
          className="font-mono"
          style={{
            fontSize: 14
          }}
        >
          {stats.flightStatus.total}
        </strong>
      </div>


    </div>

  ) : (

    <p
      style={{
        fontSize: 12,
        color: 'var(--on-surface-variant)',
        textAlign: 'center'
      }}
    >
      No flight status telemetry available.
    </p>

  )}

</DashboardCard>

            {/* Sector loads panel */}
            <DashboardCard title="Airspace Congestion Monitor">

  {stats?.sectorLoad &&
  stats.sectorLoad.length > 0 ? (
    <>
    <BarChart
      data={stats.sectorLoad.map((s) => ({ label: s.country, value: s.count, color: s.color }))}
      height={140}
    />
    <div
      style={{
        display:'flex',
        flexDirection:'column',
        gap:12,
        marginTop: 16
      }}
    >

      {stats.sectorLoad.map((s)=>(
        
        <div
          key={s.country}
          style={{
            display:'flex',
            justifyContent:'space-between',
            alignItems:'center',
            paddingBottom:8,
            borderBottom:
              '1px solid var(--outline-variant)'
          }}
        >

          <div>

            <div
              className="label-caps"
            >
              {s.country}
            </div>


            <div
              className="font-mono"
              style={{
                fontSize:11,
                color:'var(--on-surface-variant)'
              }}
            >
              {s.count} aircraft detected
            </div>

          </div>



          <span
            className="font-mono"
            style={{
              fontSize:11,
              fontWeight:700,
              color:
                s.status === 'HIGH LOAD'
                ? 'var(--error)'
                :
                s.status === 'NOMINAL'
                ? 'var(--secondary-fixed-dim)'
                :
                'var(--outline)'
            }}
          >
            {s.status}
          </span>


        </div>

      ))}

    </div>
    </>

  ) : (

    <p
      style={{
        fontSize:12,
        color:'var(--on-surface-variant)',
        textAlign:'center'
      }}
    >
      No airspace congestion telemetry available.
    </p>

  )}

</DashboardCard>

          </div>
        </>
      )}
    </div>
  );
}