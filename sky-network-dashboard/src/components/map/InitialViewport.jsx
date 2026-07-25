import { latLngBounds } from 'leaflet';
import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';

export function InitialViewport({ flights }) {
  const map = useMap();
  const hasFitted = useRef(false);

  useEffect(() => {
    if (hasFitted.current || flights.length === 0) return;

    const positions = flights.map((flight) => [flight.currentPosition.latitude, flight.currentPosition.longitude]);
    if (positions.length === 1) {
      map.setView(positions[0], 6);
    } else {
      map.fitBounds(latLngBounds(positions), { maxZoom: 6, padding: [36, 36] });
    }

    hasFitted.current = true;
  }, [flights, map]);

  return null;
}
