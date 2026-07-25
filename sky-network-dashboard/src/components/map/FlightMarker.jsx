import { divIcon } from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import { FlightPopup } from './FlightPopup';

const flightIcon = divIcon({
  className: 'flight-marker-icon',
  html: '<span aria-hidden="true">✈</span>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -16],
});

export function FlightMarker({ flight }) {
  const { latitude, longitude } = flight.currentPosition;

  return (
    <Marker position={[latitude, longitude]} icon={flightIcon}>
      <Popup minWidth={340} maxWidth={380}><FlightPopup flight={flight} /></Popup>
    </Marker>
  );
}
