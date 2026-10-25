import { useEffect, useRef, useState } from 'react';
import { Pagination } from './Pagination';
import { flightKey } from '../utils/flightSelection';
import { hasFlightPosition } from './map/flightPosition';
import { FlightPopup } from './map/FlightPopup';
import { AircraftMetadataAttribution } from './AircraftMetadataAttribution';

export function FlightList({
  flights = [],
  selectedKey = null,
  selectionRevision = 0,
  onSelectFlight,
}) {
  const [page, setPage] = useState(0);
  const selectedCard = useRef(null);
  const pageSize = 12;

  const selectedIndex = selectedKey
    ? flights.findIndex((flight) => flightKey(flight) === selectedKey)
    : -1;

  const currentPage = Math.min(
    page,
    Math.max(0, Math.ceil(flights.length / pageSize) - 1)
  );

  const visibleFlights = flights.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  useEffect(() => {
    if (selectedIndex >= 0) {
      setPage(Math.floor(selectedIndex / pageSize));
    }
  }, [selectedIndex, selectionRevision]);

  useEffect(() => {
    selectedCard.current?.scrollIntoView({
      block: 'nearest',
      behavior: 'instant',
    });
  }, [selectedKey, selectionRevision, currentPage]);

  return (
    <div>
      <h3 style={{ marginBottom: 16 }}>
        Active Flights ({flights.length})
      </h3>

      {visibleFlights.map((flight) => {
        const key = flightKey(flight);
        const selected = Boolean(key) && key === selectedKey;
        const hasPosition = hasFlightPosition(flight);

        return (
          <div
            key={key}
            style={{ marginBottom: 12 }}
            ref={selected ? selectedCard : undefined}
          >
            <button
              type="button"
              className="active-flight-card"
              aria-pressed={selected}
              disabled={!key}
              onClick={() => onSelectFlight?.(flight)}
              aria-label={`Select aircraft ${
                flight.callsign ||
                flight.flightNumber ||
                flight.icao24 ||
                flight.id
              }`}
            >
              <span
                style={{
                  display: 'block',
                  fontWeight: 'bold',
                  marginBottom: 8,
                }}
              >
                {flight.flightNumber || flight.callsign || 'Unknown flight'}

                {selected && (
                  <span className="active-flight-selected-label">
                    Selected
                  </span>
                )}
              </span>

              {Number.isFinite(flight.altitudeFt) && (
                <span className="active-flight-value">
                  <strong>Altitude:</strong>{' '}
                  {Math.round(flight.altitudeFt).toLocaleString()} ft
                </span>
              )}

              {Number.isFinite(flight.speedKnots) && (
                <span className="active-flight-value">
                  <strong>Speed:</strong>{' '}
                  {Math.round(flight.speedKnots)} kt
                </span>
              )}

              {Number.isFinite(flight.heading) && (
                <span className="active-flight-value">
                  <strong>Heading:</strong>{' '}
                  {Math.round(flight.heading)}&deg;
                </span>
              )}

              {!hasPosition && (
                <span className="active-flight-value">
                  Position unavailable; select for details
                </span>
              )}
            </button>

            {selected && !hasPosition && (
              <div
                className="active-flight-details"
                role="region"
                aria-label="Selected aircraft details"
              >
                <p role="status">
                  Position unavailable. Map view unchanged.
                </p>
                <FlightPopup flight={flight} />
              </div>
            )}
          </div>
        );
      })}

      <Pagination
        page={currentPage}
        pageSize={pageSize}
        total={flights.length}
        onPageChange={setPage}
      />

      {flights.length > 0 && <AircraftMetadataAttribution />}
    </div>
  );
}