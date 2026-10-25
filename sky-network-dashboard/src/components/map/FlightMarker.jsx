import { divIcon } from 'leaflet';
import { Marker, Popup, useMap } from 'react-leaflet';
import { useEffect, useRef } from 'react';
import { FlightPopup } from './FlightPopup';

const flightIcon = divIcon({
  className: 'flight-marker-icon',
  html: '<span aria-hidden="true">✈</span>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -16],
});

const selectedIcon = divIcon({
  className: 'flight-marker-icon flight-marker-selected',
  html: '<span aria-hidden="true">&#9992;</span>',
  iconSize: [28, 28], iconAnchor: [14, 14], popupAnchor: [0, -16],
});

export function FlightMarker({ flight, selected, selectionRevision, onSelectFlight }) {
  const { latitude, longitude } = flight.currentPosition;
  const map = useMap();
  const marker = useRef(null);

  useEffect(() => {
    if (!selected || !marker.current) return;
    map.setView([latitude, longitude], Math.max(map.getZoom(), 6), { animate: false });
    marker.current.openPopup();
    const selectedMarker = marker.current;
    return () => selectedMarker.closePopup();
  }, [selected, selectionRevision, latitude, longitude, map]);

  return (
    <Marker ref={marker} position={[latitude, longitude]} icon={selected ? selectedIcon : flightIcon}
      zIndexOffset={selected ? 1000 : 0}
      title={`Select ${flight.callsign || flight.flightCode || flight.icao24 || flight.id}`}
      alt={`Aircraft ${flight.callsign || flight.icao24 || flight.id}`}
      eventHandlers={{ click: () => onSelectFlight?.(flight) }}>
      <Popup minWidth={340} maxWidth={380} autoPan={false}
        maxHeight={Math.max(100, Math.min(260, map.getSize().y / 2 - 90))}>
        <FlightPopup flight={flight} />
      </Popup>
    </Marker>
  );
}
