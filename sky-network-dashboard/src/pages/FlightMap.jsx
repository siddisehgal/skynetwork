import { useEffect, useState } from 'react';
import { FlightMap as FlightMapView } from '../components/map/FlightMap';
import { OperationalSummary } from '../components/map/OperationalSummary';
import { DataFreshness } from '../components/DataFreshness';
import { MapFilters } from '../components/map/MapFilters';
import { applyMapFilters, defaultMapFilters } from '../utils/mapAirlineFilters';
import { hasFlightPosition } from '../components/map/flightPosition';
import { useAirports } from '../hooks/useAirports';
import { useLiveFlights } from '../hooks/useLiveFlights';

const API_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000'
).replace(/\/+$/, '');

function getValues(value) {
  return (Array.isArray(value) ? value : String(value || '').split(';'))
    .map((item) => String(item).trim())
    .filter(Boolean);
}

function getOptions(facilities, field) {
  return [
    ...new Set(
      facilities.flatMap((facility) => getValues(facility[field]))
    ),
  ].sort();
}

const inputStyle = {
  padding: '10px 12px',
  borderRadius: 6,
  border: '1px solid var(--outline-variant)',
  background: 'var(--surface-container-high)',
  color: 'var(--on-surface)',
  minWidth: 180,
  maxWidth: '100%',
};

const labelStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

const buttonStyle = {
  ...inputStyle,
  minWidth: 'auto',
  cursor: 'pointer',
};

const rowStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  gap: 12,
};

export default function FlightMap() {
  const {
    flights,
    snapshotTimestamp,
    sourceTimestamp,
    freshness,
    source,
    sourceError,
    sourceErrorCode,
    loading,
    error,
  } = useLiveFlights();

  const { airports, error: airportError } = useAirports();

  const [filters, setFilters] = useState(defaultMapFilters);
  const [mroFacilities, setMroFacilities] = useState([]);
  const [allMroFacilities, setAllMroFacilities] = useState([]);
  const [mroLoading, setMroLoading] = useState(true);
  const [mroError, setMroError] = useState('');
  const [mroAircraft, setMroAircraft] = useState('');
  const [mroCapability, setMroCapability] = useState('');

  const [latitudeInput, setLatitudeInput] = useState('');
  const [longitudeInput, setLongitudeInput] = useState('');
  const [mroOrigin, setMroOrigin] = useState(null);
  const [locationError, setLocationError] = useState('');

  function applyLocation(event) {
    event.preventDefault();

    const latitude = Number(latitudeInput);
    const longitude = Number(longitudeInput);

    if (
      !latitudeInput.trim() ||
      !longitudeInput.trim() ||
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      setLocationError(
        'Enter latitude between -90 and 90 and longitude between -180 and 180.'
      );
      return;
    }

    setLocationError('');
    setMroOrigin({ latitude, longitude });
  }

  function clearLocation() {
    setLatitudeInput('');
    setLongitudeInput('');
    setLocationError('');
    setMroOrigin(null);
  }

  useEffect(() => {
    const controller = new AbortController();

    async function loadFacilities() {
      setMroLoading(true);
      setMroError('');
      setMroFacilities([]);

      try {
        const params = new URLSearchParams();

        if (mroAircraft) {
          params.set('aircraft', mroAircraft);
        }

        if (mroCapability) {
          params.set('capability', mroCapability);
        }

        if (mroOrigin) {
          params.set('latitude', String(mroOrigin.latitude));
          params.set('longitude', String(mroOrigin.longitude));
        }

        const query = params.toString();

        const response = await fetch(
          `${API_URL}/api/mro${query ? `?${query}` : ''}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error('Unable to load MRO facilities');
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Unexpected MRO response');
        }

        if (controller.signal.aborted) return;

        setMroFacilities(data);

        if (!mroAircraft && !mroCapability && !mroOrigin) {
          setAllMroFacilities(data);
        }
      } catch (err) {
        if (controller.signal.aborted) return;

        console.error('MRO map fetch error:', err);
        setMroError(err.message || 'Unable to load MRO facilities');
        setMroFacilities([]);
      } finally {
        if (!controller.signal.aborted) {
          setMroLoading(false);
        }
      }
    }

    loadFacilities();

    return () => controller.abort();
  }, [mroAircraft, mroCapability, mroOrigin]);

  const aircraftOptions = getOptions(
    allMroFacilities,
    'aircraft_supported'
  );

  const capabilityOptions = getOptions(
    allMroFacilities,
    'capabilities'
  );

  const positionedFlights = flights.filter(hasFlightPosition);
  const filteredFlights = applyMapFilters(positionedFlights, filters);

  const hasMapData =
    filteredFlights.length > 0 ||
    airports.length > 0 ||
    mroFacilities.length > 0;

  return (
    <main
      style={{
        padding: 'var(--margin-desktop)',
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
      }}
    >
      <h1
        className="font-display"
        style={{ fontSize: 32, fontWeight: 700, marginBottom: 4 }}
      >
        Flight Map
      </h1>

      <p
        className="label-caps"
        style={{
          color: 'var(--on-surface-variant)',
          marginBottom: 24,
        }}
      >
        {loading
          ? 'Loading live positions…'
          : `${filteredFlights.length} of ${positionedFlights.length} live positions shown`}
      </p>

      <DataFreshness
        freshness={freshness}
        source={source}
        snapshotTimestamp={snapshotTimestamp}
        sourceTimestamp={sourceTimestamp}
        error={sourceError || error}
        errorCode={sourceErrorCode}
      />

      {error && (
        <div
          style={{
            background: 'var(--error-container)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--on-error-container)',
            marginBottom: 16,
            padding: 16,
          }}
        >
          Couldn&apos;t refresh flight positions: {error}
        </div>
      )}

      {airportError && (
        <div
          style={{
            background: 'var(--surface-container-high)',
            border: '1px solid var(--outline-variant)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--on-surface-variant)',
            marginBottom: 16,
            padding: 16,
          }}
        >
          Airport intelligence is temporarily unavailable: {airportError}
        </div>
      )}

      {!loading && flights.length > 0 && (
        <MapFilters
          flights={positionedFlights}
          snapshotFlights={flights}
          filters={filters}
          onChange={setFilters}
        />
      )}

      <section
        aria-labelledby="mro-filter-title"
        style={{
          background: 'var(--surface-container-high)',
          border: '1px solid var(--outline-variant)',
          borderRadius: 'var(--radius-md)',
          padding: 16,
          marginBottom: 16,
        }}
      >
        <h2
          id="mro-filter-title"
          style={{ margin: '0 0 12px', fontSize: 18 }}
        >
          MRO Facility Search
        </h2>

        <div style={rowStyle}>
          <label style={labelStyle}>
            <span>Aircraft type</span>
            <select
              value={mroAircraft}
              onChange={(event) => setMroAircraft(event.target.value)}
              style={inputStyle}
            >
              <option value="">All aircraft</option>
              {aircraftOptions.map((aircraft) => (
                <option key={aircraft} value={aircraft}>
                  {aircraft}
                </option>
              ))}
            </select>
          </label>

          <label style={labelStyle}>
            <span>Maintenance requirement</span>
            <select
              value={mroCapability}
              onChange={(event) => setMroCapability(event.target.value)}
              style={inputStyle}
            >
              <option value="">All capabilities</option>
              {capabilityOptions.map((capability) => (
                <option key={capability} value={capability}>
                  {capability}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={() => {
              setMroAircraft('');
              setMroCapability('');
            }}
            disabled={!mroAircraft && !mroCapability}
            style={buttonStyle}
          >
            Reset MRO filters
          </button>
        </div>

        <form
          onSubmit={applyLocation}
          style={{ ...rowStyle, marginTop: 16 }}
        >
          <label style={labelStyle}>
            <span>Starting latitude</span>
            <input
              type="number"
              step="any"
              min="-90"
              max="90"
              required
              placeholder="12.9716"
              value={latitudeInput}
              onChange={(event) => setLatitudeInput(event.target.value)}
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            <span>Starting longitude</span>
            <input
              type="number"
              step="any"
              min="-180"
              max="180"
              required
              placeholder="77.5946"
              value={longitudeInput}
              onChange={(event) => setLongitudeInput(event.target.value)}
              style={inputStyle}
            />
          </label>

          <button type="submit" style={buttonStyle}>
            Rank by distance
          </button>

          <button
            type="button"
            onClick={clearLocation}
            style={buttonStyle}
          >
            Clear location
          </button>
        </form>

        {locationError && (
          <p role="alert" style={{ color: 'var(--error)' }}>
            {locationError}
          </p>
        )}

        {mroOrigin && (
          <p style={{ fontSize: 13 }}>
            Ranking from {mroOrigin.latitude}, {mroOrigin.longitude}.
            Distances are straight-line geographic distances.
          </p>
        )}

        <p role="status" style={{ margin: '12px 0 0' }}>
          {mroLoading
            ? 'Loading MRO facilities…'
            : mroError
              ? `MRO search unavailable: ${mroError}`
              : mroFacilities.length === 0
                ? 'No facilities match these filters.'
                : `${mroFacilities.length} of ${allMroFacilities.length} MRO facilities match.`}
        </p>

        {mroOrigin &&
          !mroLoading &&
          !mroError &&
          mroFacilities.length > 0 && (
            <div style={{ overflowX: 'auto', marginTop: 16 }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  textAlign: 'left',
                }}
              >
                <caption
                  style={{
                    textAlign: 'left',
                    fontWeight: 700,
                    marginBottom: 10,
                  }}
                >
                  Matching facilities — nearest first
                </caption>

                <thead>
                  <tr>
                    {['Rank', 'Facility', 'Location', 'Distance'].map(
                      (heading) => (
                        <th
                          key={heading}
                          scope="col"
                          style={{
                            padding: 10,
                            borderBottom:
                              '1px solid var(--outline-variant)',
                          }}
                        >
                          {heading}
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody>
                  {mroFacilities.map((facility, index) => (
                    <tr key={facility.id}>
                      <td style={{ padding: 10 }}>{index + 1}</td>
                      <td style={{ padding: 10 }}>{facility.name}</td>
                      <td style={{ padding: 10 }}>
                        {facility.city}, {facility.country}
                      </td>
                      <td style={{ padding: 10 }}>
                        {Number.isFinite(facility.distance_km)
                          ? `${facility.distance_km.toLocaleString(
                              undefined,
                              { maximumFractionDigits: 1 }
                            )} km`
                          : 'Unavailable'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        <p
          style={{
            margin: '12px 0 0',
            fontSize: 12,
            color: 'var(--on-surface-variant)',
          }}
        >
          Prototype using sample facility data. Aircraft and service
          combinations have not yet been verified.
        </p>
      </section>

      {loading && !hasMapData && (
        <div className="map-loading-state" role="status">
          <span className="map-loading-indicator" aria-hidden="true" />
          <span className="label-caps">Loading the world map…</span>
        </div>
      )}

      {!loading && !mroLoading && !hasMapData && (
        <div className="map-empty-state">
          No positions are available for the current filters.
          Try resetting the filters.
        </div>
      )}

      {hasMapData && (
        <>
          <OperationalSummary
            flights={filteredFlights}
            lastSync={sourceTimestamp || snapshotTimestamp}
          />

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