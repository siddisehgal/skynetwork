function formatCoordinate(value) {
  return Number.isFinite(value) ? value.toFixed(4) : 'Unavailable';
}

export function AirportPopup({ airport }) {
  return (
    <div className="airport-popup">
      <strong>{airport.name}</strong>
      <dl>
        <div><dt>IATA</dt><dd>{airport.iata}</dd></div>
        <div><dt>Country</dt><dd>{airport.country}</dd></div>
        <div><dt>Latitude</dt><dd>{formatCoordinate(airport.latitude)}</dd></div>
        <div><dt>Longitude</dt><dd>{formatCoordinate(airport.longitude)}</dd></div>
      </dl>
    </div>
  );
}
