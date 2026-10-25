function includes(value, query) {
  return !query || String(value || '').toLowerCase().includes(query.trim().toLowerCase());
}

export function filterFlights(flights, filters) {
  return flights.filter((flight) => (
    (includes(flight.flightNumber, filters.flightNumber) || includes(flight.icao24, filters.flightNumber)) &&
    includes(flight.callsign, filters.callsign) &&
    includes(`${flight.airline} ${flight.airlineCode}`, filters.airline) &&
    (!filters.origin || flight.departureCode.toUpperCase() === filters.origin.trim().toUpperCase()) &&
    (!filters.destination || flight.arrivalCode.toUpperCase() === filters.destination.trim().toUpperCase()) &&
    includes(flight.aircraftRegistration, filters.aircraftRegistration) &&
    (!filters.status || flight.status.toUpperCase() === filters.status.replaceAll(' ', '-').toUpperCase())
  ));
}