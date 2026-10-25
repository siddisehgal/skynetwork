export function hasFlightPosition(flight) {
  const { latitude, longitude } = flight.currentPosition || {};
  return Number.isFinite(latitude) && Number.isFinite(longitude)
    && Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180;
}
