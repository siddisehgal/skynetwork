import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export function MapFocus() {
  const map = useMap();
  useEffect(() => {
    const container = map.getContainer();
    // Leaflet restores window scroll after focusing, but our dashboard scrolls
    // inside a panel. Focus first without scrolling so marker clicks stay put.
    const focus = (event) => {
      if (event.target.closest('.leaflet-interactive')) container.focus({ preventScroll: true });
    };
    container.addEventListener('mousedown', focus, true);
    return () => container.removeEventListener('mousedown', focus, true);
  }, [map]);
  return null;
}
