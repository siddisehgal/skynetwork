import { useMemo } from 'react';

export function MapFilters({ flights, filters, onChange }) {
  const airlines = useMemo(
    () => Array.from(new Set(flights.map((f) => f.airline).filter(Boolean))).sort(),
    [flights],
  );
  const statuses = useMemo(
    () => Array.from(new Set(flights.map((f) => f.status).filter(Boolean))).sort(),
    [flights],
  );

  function update(key, value) {
    onChange({ ...filters, [key]: value });
  }

  function reset() {
    onChange({ airline: '', status: '', minAltitude: '', maxAltitude: '', showRoutes: filters.showRoutes });
  }

  const hasActiveFilters = filters.airline || filters.status || filters.minAltitude || filters.maxAltitude;

  return (
    <div className="map-filters" role="group" aria-label="Map filters">
      <div className="map-filter-field">
        <label className="label-caps" htmlFor="filter-airline">Airline</label>
        <select id="filter-airline" value={filters.airline} onChange={(e) => update('airline', e.target.value)}>
          <option value="">All airlines</option>
          {airlines.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      <div className="map-filter-field">
        <label className="label-caps" htmlFor="filter-status">Status</label>
        <select id="filter-status" value={filters.status} onChange={(e) => update('status', e.target.value)}>
          <option value="">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="map-filter-field">
        <label className="label-caps" htmlFor="filter-min-alt">Min altitude (ft)</label>
        <input
          id="filter-min-alt"
          type="number"
          min="0"
          step="1000"
          placeholder="0"
          value={filters.minAltitude}
          onChange={(e) => update('minAltitude', e.target.value)}
        />
      </div>

      <div className="map-filter-field">
        <label className="label-caps" htmlFor="filter-max-alt">Max altitude (ft)</label>
        <input
          id="filter-max-alt"
          type="number"
          min="0"
          step="1000"
          placeholder="No limit"
          value={filters.maxAltitude}
          onChange={(e) => update('maxAltitude', e.target.value)}
        />
      </div>

      <label className="map-filter-toggle label-caps">
        <input
          type="checkbox"
          checked={filters.showRoutes}
          onChange={(e) => update('showRoutes', e.target.checked)}
        />
        Show routes
      </label>

      {hasActiveFilters && (
        <button type="button" className="hud-btn hud-btn-outline" onClick={reset} style={{ height: 28, fontSize: 10, padding: '0 10px' }}>
          Clear filters
        </button>
      )}
    </div>
  );
}

export function applyMapFilters(flights, filters) {
  return flights.filter((flight) => {
    if (filters.airline && flight.airline !== filters.airline) return false;
    if (filters.status && flight.status !== filters.status) return false;

    const altitude = flight.currentAltitude;
    if (filters.minAltitude !== '' && !(altitude >= Number(filters.minAltitude))) return false;
    if (filters.maxAltitude !== '' && !(altitude <= Number(filters.maxAltitude))) return false;

    return true;
  });
}

export const defaultMapFilters = {
  airline: '',
  status: '',
  minAltitude: '',
  maxAltitude: '',
  showRoutes: true,
};