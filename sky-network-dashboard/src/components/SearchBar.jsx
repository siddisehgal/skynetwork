import React from 'react';

/**
 * Reusable Search / Filter Form Panel
 * @param {object} props
 * @param {object} props.filters - Current filter values
 * @param {function} props.onChange - Handle filter value changes
 * @param {function} props.onSubmit - Handle form submit
 * @param {function} props.onClear - Handle filter resets
 * @param {boolean} props.loading - Is searching active
 */
export function SearchBar({ filters, onChange, onSubmit, onClear, loading }) {
  return (
    <form onSubmit={onSubmit} className="hud-search-form">
      <div className="hud-input-group">
        <label className="hud-input-label">Flight Number</label>
        <input
          type="text"
          name="flightNumber"
          value={filters.flightNumber || ''}
          onChange={onChange}
          placeholder="e.g. SC-9042"
          className="hud-input"
        />
      </div>

      <div className="hud-input-group">
        <label className="hud-input-label">Callsign</label>
        <input
          type="text"
          name="callsign"
          value={filters.callsign || ''}
          onChange={onChange}
          placeholder="e.g. AAL123"
          className="hud-input"
        />
      </div>

      <div className="hud-input-group">
        <label className="hud-input-label">Airline</label>
        <input
          type="text"
          name="airline"
          value={filters.airline || ''}
          onChange={onChange}
          placeholder="Carrier code"
          className="hud-input"
        />
      </div>

      <div className="hud-input-group">
        <label className="hud-input-label">Origin (DEP)</label>
        <input
          type="text"
          name="origin"
          value={filters.origin || ''}
          onChange={onChange}
          placeholder="IATA code"
          className="hud-input"
        />
      </div>

      <div className="hud-input-group">
        <label className="hud-input-label">Destination (ARR)</label>
        <input
          type="text"
          name="destination"
          value={filters.destination || ''}
          onChange={onChange}
          placeholder="IATA code"
          className="hud-input"
        />
      </div>

      <div className="hud-input-group">
        <label className="hud-input-label">Aircraft Reg.</label>
        <input
          type="text"
          name="aircraftRegistration"
          value={filters.aircraftRegistration || ''}
          onChange={onChange}
          placeholder="e.g. N123AA"
          className="hud-input"
        />
      </div>

      <div className="hud-input-group">
        <label className="hud-input-label">Status</label>
        <select
          name="status"
          value={filters.status || ''}
          onChange={onChange}
          className="hud-select"
        >
          <option value="">ALL STATUSES</option>
          <option value="IN-FLIGHT">IN FLIGHT</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="ON TIME">ON TIME</option>
          <option value="DELAYED">DELAYED</option>
          <option value="PENDING">PENDING</option>
          <option value="ON GROUND">ON GROUND</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button
          type="submit"
          disabled={loading}
          className="hud-btn hud-btn-primary"
          style={{ flexGrow: 1 }}
        >
          <svg className="hud-nav-icon" viewBox="0 0 24 24" style={{ width: 14, height: 14 }}>
            <path d="M2 21l21-9L2 3v7l15 2-15 2z" stroke="currentColor" fill="none" strokeWidth="2" />
          </svg>
          {loading ? 'Searching...' : 'Execute Search'}
        </button>
        <button
          type="button"
          onClick={onClear}
          className="hud-btn hud-btn-outline"
        >
          Clear
        </button>
      </div>
    </form>
  );
}
