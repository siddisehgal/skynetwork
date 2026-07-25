import { divIcon } from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import { AirportPopup } from './AirportPopup';

const airportIcon = divIcon({
  className: 'airport-marker-icon',
  html: '<span aria-hidden="true">A</span>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -14],
});

export function AirportMarker({ airport }) {
  return (
    <Marker position={[airport.latitude, airport.longitude]} icon={airportIcon}>
      <Popup minWidth={300} maxWidth={340}><AirportPopup airport={airport} /></Popup>
    </Marker>
  );
}
