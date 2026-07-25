export function FlightList({ flights = [] }) {
  return (
    <div>
      <h3 style={{ marginBottom: "16px" }}>
        Active Flights ({flights.length})
      </h3>

      {flights.map((flight) => (
        <div
          key={flight.id || flight.icao24}
          style={{
            padding: "12px",
            marginBottom: "12px",
            border: "1px solid var(--outline)",
            borderRadius: "8px",
            background: "var(--surface)",
            cursor: "pointer",
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
            ✈ {flight.flightNumber || flight.callsign || "Unknown Flight"}
          </div>

          <div style={{ fontSize: "13px" }}>
            <strong>Altitude:</strong> {flight.altitude || "--"} ft
          </div>

          <div style={{ fontSize: "13px" }}>
            <strong>Speed:</strong> {flight.speed || "--"} kt
          </div>

          <div style={{ fontSize: "13px" }}>
            <strong>Heading:</strong> {flight.heading || "--"}°
          </div>
        </div>
      ))}
    </div>
  );
}